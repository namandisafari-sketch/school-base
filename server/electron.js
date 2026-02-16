/**
 * Electron Main Process
 * Packages the school management system as a desktop application
 * 
 * After export, install:
 *   npm install electron electron-builder --save-dev
 *   npm install express cors better-sqlite3
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { initDatabase } = require('./database');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const os = require('os');

let mainWindow;
let tray;
const PORT = 3000;

// Initialize Express server
function startServer() {
  const server = express();
  
  initDatabase();
  
  server.use(cors());
  server.use(express.json({ limit: '10mb' }));
  server.use('/api', routes);
  
  // Serve the built React app
  server.use(express.static(path.join(__dirname, '..', 'dist')));
  server.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    const ips = getLanIPs();
    ips.forEach(ip => console.log(`LAN: http://${ip}:${PORT}`));
  });
}

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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'School Manager',
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  // Load the app from the local Express server
  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// System tray (keeps server running when window is closed)
function createTray() {
  tray = new Tray(path.join(__dirname, '..', 'public', 'favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open School Manager', click: () => {
      if (!mainWindow) createWindow();
      else mainWindow.focus();
    }},
    { type: 'separator' },
    { label: `LAN: ${getLanIPs().map(ip => `${ip}:${PORT}`).join(', ') || 'No network'}` },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('School Manager - Server Running');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  startServer();
  
  // Small delay to let server start
  setTimeout(() => {
    createWindow();
    createTray();
  }, 1500);
});

app.on('window-all-closed', () => {
  // Don't quit - keep server running for LAN clients
  // Users quit via system tray
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});
