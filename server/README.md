# 🎓 School Manager — Local LAN Web App

## How It Works (Like a Router Admin Panel)
```
┌──────────────────────────────────────────────────┐
│            School Wi-Fi Router                    │
│          (No internet required)                   │
│                                                   │
│  ┌──────────────┐                                │
│  │  Server PC   │  ← Runs Node.js server         │
│  │  192.168.1.5 │  ← Stores all school data      │
│  └──────┬───────┘                                │
│         │                                         │
│  ┌──────┴──────────────────────────┐             │
│  │  Any device on the same Wi-Fi   │             │
│  │  opens browser and goes to:     │             │
│  │  http://192.168.1.5:3000        │             │
│  │                                  │             │
│  │  📱 Phone  💻 Laptop  🖥️ Desktop │             │
│  └─────────────────────────────────┘             │
└──────────────────────────────────────────────────┘
```

## Setup (One-Time on Server PC)

### 1. Install Node.js
Download from https://nodejs.org (LTS version) on the server PC.

### 2. Export & Install
```bash
git clone <your-repo>
cd <your-repo>

npm install
npm install express cors better-sqlite3
```

### 3. Add server script to package.json
```json
{
  "scripts": {
    "server": "npm run build && node server/server.js"
  }
}
```

### 4. Start the Server
```bash
npm run server
```
The terminal will show:
```
╔══════════════════════════════════════════════╗
║   🎓 School Manager - Server Running         ║
║  LAN:  http://192.168.1.5:3000               ║
╚══════════════════════════════════════════════╝
```

### 5. Access from Any Device
On **any phone, tablet, or computer** connected to the same router:
1. Open Chrome / Firefox / Safari
2. Type `http://192.168.1.5:3000` in the address bar
3. Done! Full school management system — no internet needed.

## Auto-Start on Boot (Windows)
To make the server start automatically when the PC turns on:

1. Press `Win + R`, type `shell:startup`, press Enter
2. Create a shortcut to a `.bat` file containing:
```bat
@echo off
cd /d "C:\path\to\school-manager"
node server/server.js
```
3. Now the server starts every time the PC boots — just like a router.

## Auto-Start on Boot (Linux/Ubuntu)
```bash
# Create a systemd service
sudo nano /etc/systemd/system/school-manager.service
```
```ini
[Unit]
Description=School Manager
After=network.target

[Service]
WorkingDirectory=/path/to/school-manager
ExecStart=/usr/bin/node server/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable school-manager
sudo systemctl start school-manager
```

## Requirements
| Item | Details |
|------|---------|
| **Server PC** | Any laptop/desktop with Node.js installed |
| **Router** | Any Wi-Fi router (no internet SIM needed) |
| **Clients** | Any device with a web browser |
| **OS** | Windows, Linux, or macOS on server PC |
| **Storage** | ~200MB + school data |

## Database Backup
The database file is at the project root: `school_manager.db`
- Copy this file to a USB drive periodically
- To restore: replace the file and restart the server

## Security
- Data **never leaves the school** — it stays on the server PC
- Only devices connected to the router can access the system
- Set a strong Wi-Fi password on the router
- Optionally disable the router's WAN/internet port entirely

## FAQ

**Q: What if the server PC turns off?**  
A: No one can access the system until it's turned back on (same as a router).

**Q: Can I use a Raspberry Pi as the server?**  
A: Yes! A Raspberry Pi 4 works perfectly and uses very little power.

**Q: What if the IP address changes?**  
A: Set a static IP on the server PC, or configure DHCP reservation on the router.

**Q: Can multiple teachers use it at the same time?**  
A: Yes, unlimited concurrent users — they all access via browser.
