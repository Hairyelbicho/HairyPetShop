// Electron Main Process - HairyWallet Desktop
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let tray;

// Configuración de la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#7c3aed',
    show: false,
    frame: true,
    titleBarStyle: 'default'
  });

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, cargar desde el servidor de Vite
    mainWindow.loadURL('http://localhost:5173/hairy-wallet');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar desde los archivos compilados
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimizar a la bandeja en lugar de cerrar
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Limpiar referencia cuando se cierre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear icono de bandeja del sistema
function createTray() {
  const iconPath = path.join(__dirname, '../public/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir HairyWallet',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Ocultar',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('HairyWallet - Tu wallet de Solana');
  tray.setContextMenu(contextMenu);

  // Mostrar ventana al hacer clic en el icono
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// Crear menú de la aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nueva Wallet',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet/crear');
          }
        },
        {
          label: 'Importar Wallet',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet/importar');
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Wallet',
      submenu: [
        {
          label: 'Ver Balance',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet');
          }
        },
        {
          label: 'Enviar',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet/enviar');
          }
        },
        {
          label: 'Recibir',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet/recibir');
          }
        },
        {
          label: 'Historial',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.send('navigate', '/hairy-wallet/historial');
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Documentación',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://hairywallet.com/docs');
          }
        },
        {
          label: 'Reportar Problema',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/hairywallet/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'Acerca de HairyWallet',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Acerca de HairyWallet',
              message: 'HairyWallet Desktop',
              detail: `Versión: ${app.getVersion()}\nTu wallet de Solana para escritorio\n\n© 2024 HairyWallet`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Eventos IPC para comunicación con el renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow.hide();
});

// Inicialización de la aplicación
app.whenReady().then(() => {
  createWindow();
  createTray();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevenir múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });
}

// Configuración de seguridad
app.on('web-contents-created', (event, contents) => {
  // Prevenir navegación a URLs externas
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:5173' && !isDev) {
      event.preventDefault();
    }
  });

  // Prevenir apertura de nuevas ventanas
  contents.setWindowOpenHandler(({ url }) => {
    const { shell } = require('electron');
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});
