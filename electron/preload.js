// Electron Preload Script - HairyWallet Desktop
const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la aplicación
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Control de ventana
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Navegación
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, route) => callback(route));
  },
  
  // Plataforma
  platform: process.platform,
  isElectron: true
});

// Prevenir acceso directo a Node.js
window.addEventListener('DOMContentLoaded', () => {
  console.log('HairyWallet Desktop cargado correctamente');
});
