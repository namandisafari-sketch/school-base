# 🎓 School Manager — Server & Electron Setup

## Overview
This folder contains everything needed to run the School Manager as a **local LAN server** or **desktop application** after exporting from Lovable.

## Architecture
```
┌─────────────────────────────────────────────┐
│  School Router (No Internet Required)        │
│                                              │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  Server PC   │    │  Client PCs      │   │
│  │  (Electron)  │◄───│  (Browser only)  │   │
│  │  Express +   │    │  Open browser to  │   │
│  │  SQLite DB   │    │  http://IP:3000   │   │
│  └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────┘
```

## Quick Start

### 1. Export & Install
```bash
# After exporting from Lovable via GitHub:
git clone <your-repo>
cd <your-repo>

# Install dependencies
npm install
npm install express cors better-sqlite3
npm install electron electron-builder --save-dev
```

### 2. Add scripts to package.json
```json
{
  "main": "server/electron.js",
  "scripts": {
    "server": "node server/server.js",
    "electron": "electron .",
    "package": "npm run build && electron-builder --config server/electron-builder.config.js"
  }
}
```

### 3. Run Options

#### Option A: Desktop App (Server PC)
```bash
npm run build      # Build the React frontend
npm run electron   # Launch Electron desktop app + LAN server
```

#### Option B: Server Only (headless)
```bash
npm run build      # Build the React frontend
npm run server     # Start Express server on port 3000
```

### 4. Connect Client PCs
On any other computer connected to the same router/Wi-Fi:
1. Open a web browser (Chrome, Firefox, Edge)
2. Navigate to `http://<SERVER-IP>:3000`
3. The server IP is shown in the terminal when you start the server

## Building Installers

```bash
# Windows installer (.exe)
npm run package

# The installer will be in the /release folder
# Share this installer with schools - they just double-click to install
```

## Requirements
- **Server PC**: Windows 7+, macOS 10.12+, or Ubuntu 18.04+
- **Client PCs**: Any device with a web browser
- **Router**: Any Wi-Fi router (no internet SIM needed)
- **RAM**: 2GB minimum on server PC
- **Storage**: 500MB + data

## Database
- SQLite database stored at: `%APPDATA%/School Manager/school_manager.db` (Windows)
- Automatic backup recommended: copy this file periodically to USB drive

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect from other PCs | Check firewall allows port 3000 |
| "Address already in use" | Change PORT in server.js or kill existing process |
| Database locked | Restart the server, ensure only one instance runs |
| Slow on old PCs | Reduce `limit` in API queries |

## Security Note
This system runs on a **local network only**. No data leaves the school premises. For additional security:
- Set a strong Wi-Fi password on the router
- Disable router's internet/WAN port if not needed
- Regular USB backups of the database file
