/**
 * Electron Builder Configuration
 * Generates installers for Windows, macOS, and Linux
 * 
 * Usage after export:
 *   1. npm run build          (builds React frontend)
 *   2. npx electron-builder   (packages into installer)
 */

module.exports = {
  appId: 'com.schoolmanager.app',
  productName: 'School Manager',
  directories: {
    output: 'release',
    buildResources: 'public',
  },
  files: [
    'dist/**/*',
    'server/**/*',
    'node_modules/**/*',
    'public/favicon.ico',
  ],
  extraResources: [
    { from: 'server', to: 'server' }
  ],
  win: {
    target: [
      { target: 'nsis', arch: ['x64', 'ia32'] }
    ],
    icon: 'public/favicon.ico',
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'public/favicon.ico',
    shortcutName: 'School Manager',
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Education',
    icon: 'public/favicon.ico',
  },
  mac: {
    target: ['dmg'],
    category: 'public.app-category.education',
  },
};
