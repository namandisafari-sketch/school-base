/**
 * Express Server - School Management System
 * Serves both the API and the React frontend over LAN
 * 
 * After export, install: npm install express cors better-sqlite3
 * Run: node server/server.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const routes = require('./routes');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', routes);

// Serve React frontend (after building with: npm run build)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
});

// Get LAN IP addresses
function getLanIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  const ips = getLanIPs();
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   🎓 School Manager - Server Running         ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Local:   http://localhost:${PORT}              ║`);
  ips.forEach(ip => {
    console.log(`║  LAN:     http://${ip}:${PORT}         ║`);
  });
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  Share the LAN URL with other PCs on the     ║');
  console.log('║  same Wi-Fi/router to access the system.     ║');
  console.log('╚══════════════════════════════════════════════╝\n');
});
