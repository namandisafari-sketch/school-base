/**
 * Express API Routes
 * All CRUD endpoints for the school management system
 * 
 * After export, install: npm install express cors
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

// ─── Helper ──────────────────────────────────────────────
function crud(table, options = {}) {
  const r = express.Router();
  const { searchCols = [], orderBy = 'id DESC' } = options;

  // GET all
  r.get('/', (req, res) => {
    const { search, limit = 100, offset = 0 } = req.query;
    let sql = `SELECT * FROM ${table}`;
    const params = [];
    if (search && searchCols.length) {
      const where = searchCols.map(c => `${c} LIKE ?`).join(' OR ');
      sql += ` WHERE (${where})`;
      searchCols.forEach(() => params.push(`%${search}%`));
    }
    sql += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const rows = getDb().prepare(sql).all(...params);
    const total = getDb().prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    res.json({ data: rows, total: total.count });
  });

  // GET one
  r.get('/:id', (req, res) => {
    const row = getDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  // POST create
  r.post('/', (req, res) => {
    const keys = Object.keys(req.body);
    const vals = Object.values(req.body);
    const placeholders = keys.map(() => '?').join(',');
    const result = getDb().prepare(
      `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`
    ).run(...vals);
    const created = getDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json(created);
  });

  // PUT update
  r.put('/:id', (req, res) => {
    const keys = Object.keys(req.body);
    const vals = Object.values(req.body);
    const sets = keys.map(k => `${k} = ?`).join(',');
    getDb().prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...vals, req.params.id);
    const updated = getDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    res.json(updated);
  });

  // DELETE
  r.delete('/:id', (req, res) => {
    getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  });

  return r;
}

// ─── Settings (key-value) ────────────────────────────────
router.get('/settings', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM settings').all();
  const obj = {};
  rows.forEach(r => { obj[r.key] = JSON.parse(r.value); });
  res.json(obj);
});

router.put('/settings', (req, res) => {
  const upsert = getDb().prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  );
  const tx = getDb().transaction((data) => {
    for (const [key, val] of Object.entries(data)) {
      const v = JSON.stringify(val);
      upsert.run(key, v, v);
    }
  });
  tx(req.body);
  res.json({ success: true });
});

// ─── Resource Routes ─────────────────────────────────────
router.use('/students', crud('students', { searchCols: ['first_name', 'last_name', 'admission_number'] }));
router.use('/classes', crud('classes', { searchCols: ['name', 'level'] }));
router.use('/parents', crud('parents', { searchCols: ['first_name', 'last_name', 'phone'] }));
router.use('/staff', crud('staff', { searchCols: ['first_name', 'last_name', 'role'] }));
router.use('/subjects', crud('subjects', { searchCols: ['name', 'code'] }));
router.use('/attendance', crud('attendance', { orderBy: 'date DESC' }));
router.use('/exams', crud('exams', { searchCols: ['name'] }));
router.use('/exam-results', crud('exam_results'));
router.use('/fee-structures', crud('fee_structures', { searchCols: ['name'] }));
router.use('/fee-payments', crud('fee_payments', { orderBy: 'payment_date DESC' }));
router.use('/discipline', crud('discipline', { orderBy: 'incident_date DESC' }));
router.use('/gate-log', crud('gate_log', { orderBy: 'timestamp DESC' }));
router.use('/visitors', crud('visitors', { searchCols: ['name', 'purpose'], orderBy: 'check_in DESC' }));
router.use('/payroll', crud('payroll', { orderBy: 'month DESC' }));
router.use('/transactions', crud('transactions', { searchCols: ['description', 'category'], orderBy: 'date DESC' }));
router.use('/requisitions', crud('requisitions', { searchCols: ['item'], orderBy: 'date DESC' }));
router.use('/assets', crud('assets', { searchCols: ['name', 'category', 'serial_number'] }));
router.use('/letters', crud('letters', { searchCols: ['title', 'recipient'] }));
router.use('/calendar-events', crud('calendar_events', { searchCols: ['title'], orderBy: 'start_date ASC' }));
router.use('/timetable', crud('timetable'));
router.use('/ecd-progress', crud('ecd_progress'));

// ─── Dashboard Stats ─────────────────────────────────────
router.get('/dashboard/stats', (req, res) => {
  const db = getDb();
  res.json({
    totalStudents: db.prepare('SELECT COUNT(*) as c FROM students WHERE status = ?').get('active').c,
    totalStaff: db.prepare('SELECT COUNT(*) as c FROM staff WHERE status = ?').get('active').c,
    totalClasses: db.prepare('SELECT COUNT(*) as c FROM classes').get().c,
    todayAttendance: db.prepare('SELECT COUNT(*) as c FROM attendance WHERE date = date("now") AND status = ?').get('present').c,
    totalFees: db.prepare('SELECT COALESCE(SUM(amount),0) as c FROM fee_payments').get().c,
    pendingRequisitions: db.prepare('SELECT COUNT(*) as c FROM requisitions WHERE status = ?').get('pending').c,
  });
});

// ─── Reports ─────────────────────────────────────────────
router.get('/reports/attendance-summary', (req, res) => {
  const { class_id, start_date, end_date } = req.query;
  let sql = `SELECT s.first_name, s.last_name, 
    SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) as present_days,
    SUM(CASE WHEN a.status='absent' THEN 1 ELSE 0 END) as absent_days,
    COUNT(a.id) as total_days
    FROM students s LEFT JOIN attendance a ON s.id = a.student_id
    WHERE 1=1`;
  const params = [];
  if (class_id) { sql += ' AND s.class_id = ?'; params.push(class_id); }
  if (start_date) { sql += ' AND a.date >= ?'; params.push(start_date); }
  if (end_date) { sql += ' AND a.date <= ?'; params.push(end_date); }
  sql += ' GROUP BY s.id ORDER BY s.first_name';
  res.json(getDb().prepare(sql).all(...params));
});

router.get('/reports/fee-balance', (req, res) => {
  const sql = `SELECT s.id, s.first_name, s.last_name, s.admission_number,
    COALESCE(fs.total_fees, 0) as total_fees,
    COALESCE(fp.total_paid, 0) as total_paid,
    COALESCE(fs.total_fees, 0) - COALESCE(fp.total_paid, 0) as balance
    FROM students s
    LEFT JOIN (SELECT class_id, SUM(amount) as total_fees FROM fee_structures GROUP BY class_id) fs ON s.class_id = fs.class_id
    LEFT JOIN (SELECT student_id, SUM(amount) as total_paid FROM fee_payments GROUP BY student_id) fp ON s.id = fp.student_id
    WHERE s.status = 'active'
    ORDER BY balance DESC`;
  res.json(getDb().prepare(sql).all());
});

module.exports = router;
