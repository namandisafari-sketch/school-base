/**
 * SQLite Database Setup & Schema
 * Uses better-sqlite3 for synchronous, fast local database operations
 * 
 * After export, install: npm install better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db;

function getDbPath() {
  const userDataPath = app ? app.getPath('userData') : __dirname;
  return path.join(userDataPath, 'school_manager.db');
}

function initDatabase() {
  db = new Database(getDbPath());
  
  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create all tables
  db.exec(`
    -- Users (Authentication)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'teacher' CHECK(role IN ('admin','teacher')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- School Settings
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Students
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('male','female')) NOT NULL,
      date_of_birth TEXT,
      class_id INTEGER,
      admission_number TEXT UNIQUE,
      admission_date TEXT DEFAULT (date('now')),
      parent_id INTEGER,
      address TEXT,
      medical_info TEXT,
      photo TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','inactive','transferred','graduated')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (parent_id) REFERENCES parents(id)
    );

    -- Classes
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level TEXT,
      section TEXT,
      capacity INTEGER DEFAULT 40,
      teacher_id INTEGER,
      academic_year TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (teacher_id) REFERENCES staff(id)
    );

    -- Parents / Guardians
    CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      relationship TEXT DEFAULT 'parent',
      occupation TEXT,
      national_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Staff
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('male','female')),
      role TEXT DEFAULT 'teacher',
      phone TEXT,
      email TEXT,
      qualification TEXT,
      date_joined TEXT DEFAULT (date('now')),
      salary REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Subjects
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      category TEXT DEFAULT 'standard',
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Class-Subject mapping
    CREATE TABLE IF NOT EXISTS class_subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      teacher_id INTEGER,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (teacher_id) REFERENCES staff(id),
      UNIQUE(class_id, subject_id)
    );

    -- Attendance
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT CHECK(status IN ('present','absent','late','excused')) NOT NULL,
      notes TEXT,
      recorded_by INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      UNIQUE(student_id, date)
    );

    -- Exams
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      term TEXT,
      academic_year TEXT,
      exam_date TEXT,
      max_marks REAL DEFAULT 100,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Exam Results / Marks
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      marks REAL,
      grade TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (exam_id) REFERENCES exams(id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      UNIQUE(exam_id, student_id, subject_id)
    );

    -- Fees
    CREATE TABLE IF NOT EXISTS fee_structures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      class_id INTEGER,
      term TEXT,
      academic_year TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (class_id) REFERENCES classes(id)
    );

    CREATE TABLE IF NOT EXISTS fee_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      fee_structure_id INTEGER,
      amount REAL NOT NULL,
      payment_date TEXT DEFAULT (date('now')),
      payment_method TEXT DEFAULT 'cash',
      receipt_number TEXT,
      term TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id)
    );

    -- Discipline
    CREATE TABLE IF NOT EXISTS discipline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      incident_date TEXT DEFAULT (date('now')),
      type TEXT,
      description TEXT,
      action_taken TEXT,
      recorded_by INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (recorded_by) REFERENCES staff(id)
    );

    -- Gate Log
    CREATE TABLE IF NOT EXISTS gate_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      direction TEXT CHECK(direction IN ('in','out')) NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      reason TEXT,
      authorized_by INTEGER,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );

    -- Visitors
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      purpose TEXT,
      visiting TEXT,
      check_in TEXT DEFAULT (datetime('now')),
      check_out TEXT,
      id_number TEXT
    );

    -- Payroll
    CREATE TABLE IF NOT EXISTS payroll (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      basic_salary REAL,
      allowances REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      net_salary REAL,
      payment_date TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (staff_id) REFERENCES staff(id)
    );

    -- Accounting
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('income','expense')) NOT NULL,
      category TEXT,
      description TEXT,
      amount REAL NOT NULL,
      date TEXT DEFAULT (date('now')),
      reference TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Requisitions
    CREATE TABLE IF NOT EXISTS requisitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requested_by INTEGER,
      item TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      estimated_cost REAL,
      reason TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','fulfilled')),
      date TEXT DEFAULT (date('now')),
      approved_by INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (requested_by) REFERENCES staff(id)
    );

    -- Assets
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      location TEXT,
      condition TEXT DEFAULT 'good',
      purchase_date TEXT,
      purchase_cost REAL,
      serial_number TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Letters
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT,
      recipient TEXT,
      date TEXT DEFAULT (date('now')),
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Term Calendar
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      type TEXT DEFAULT 'event',
      term TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Timetable
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      teacher_id INTEGER,
      day TEXT CHECK(day IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')) NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      room TEXT,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (teacher_id) REFERENCES staff(id)
    );

    -- ECD Progress (Kindergarten)
    CREATE TABLE IF NOT EXISTS ecd_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      term TEXT,
      area TEXT NOT NULL,
      skill TEXT NOT NULL,
      rating TEXT CHECK(rating IN ('emerging','developing','proficient','advanced')),
      notes TEXT,
      assessed_date TEXT DEFAULT (date('now')),
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  return db;
}

function getDb() {
  if (!db) initDatabase();
  return db;
}

module.exports = { initDatabase, getDb };
