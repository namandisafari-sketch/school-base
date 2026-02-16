/**
 * Auth Routes for Express Server
 * Handles user registration, login, and management
 * Uses bcrypt for password hashing (production-ready)
 * 
 * After export, install: npm install bcryptjs jsonwebtoken
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'school-manager-secret-change-in-production';

// ─── Auth Middleware ─────────────────────────────────────
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ─── Register ────────────────────────────────────────────
router.post('/register', (req, res) => {
  const { username, password, fullName } = req.body;

  if (!username || !password || !fullName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // First user becomes admin
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const role = userCount === 0 ? 'admin' : 'teacher';

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)'
  ).run(username.trim(), passwordHash, fullName.trim(), role);

  const user = db.prepare('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({
    user: { id: user.id, username: user.username, fullName: user.full_name, role: user.role, createdAt: user.created_at },
    token,
  });
});

// ─── Login ───────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    user: { id: user.id, username: user.username, fullName: user.full_name, role: user.role, createdAt: user.created_at },
    token,
  });
});

// ─── Get Current User ────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, fullName: user.full_name, role: user.role, createdAt: user.created_at });
});

// ─── List Users (Admin only) ─────────────────────────────
router.get('/users', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at').all();
  res.json(users.map(u => ({ id: u.id, username: u.username, fullName: u.full_name, role: u.role, createdAt: u.created_at })));
});

// ─── Update User Role (Admin only) ──────────────────────
router.put('/users/:id/role', authenticate, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'teacher'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const db = getDb();
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ success: true });
});

// ─── Delete User (Admin only) ───────────────────────────
router.delete('/users/:id', authenticate, requireAdmin, (req, res) => {
  if (String(req.params.id) === String(req.user.id)) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── Check if any users exist ────────────────────────────
router.get('/has-users', (req, res) => {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  res.json({ hasUsers: count > 0 });
});

module.exports = { router, authenticate, requireAdmin };
