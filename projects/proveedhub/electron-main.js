import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork, spawn } from 'child_process';
import fs from 'fs';

// Obtener rutas actuales
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
let mainWindow;
let backendProcess;

// Configurar ruta de datos persistente
const DATA_PATH = isDev 
    ? __dirname // En desarrollo, usar carpeta local
    : path.join(app.getPath('documents'), 'ProveedoresMIP_Data'); // En producción, Mis Documentos

if (!isDev && !fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
}

// Manejador IPC para seleccionar carpeta
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

const WINDOW_STATE_FILE = path.join(DATA_PATH, 'window-state.json');

const saveWindowState = (win) => {
    try {
        const isMaximized = win.isMaximized();
        const bounds = win.getBounds();
        fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify({ isMaximized, bounds }));
    } catch (e) { /* ignore */ }
};

const loadWindowState = () => {
    try {
        if (fs.existsSync(WINDOW_STATE_FILE)) {
            return JSON.parse(fs.readFileSync(WINDOW_STATE_FILE));
        }
    } catch (e) { /* ignore */ }
    return null;
};

const createWindow = () => {
  const state = loadWindowState();
  
  mainWindow = new BrowserWindow({
    width: state?.bounds?.width || 1280,
    height: state?.bounds?.height || 800,
    x: state?.bounds?.x,
    y: state?.bounds?.y,
    title: "Proveedores MIP",
    icon: path.join(__dirname, 'public', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (state?.isMaximized) mainWindow.maximize();

  mainWindow.on('close', () => {
      saveWindowState(mainWindow);
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
      mainWindow.loadURL('http://localhost:3000');
      // Open DevTools
      // mainWindow.webContents.openDevTools();
  } else {
      // En producción, cargar el archivo compilado
      // Nota: 'dist' debe estar junto al main en el asar o fuera
      mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const startBackend = () => {
  console.log("Iniciando Backend...");
  console.log("Data Path:", DATA_PATH);
  
  const serverPath = isDev 
      ? path.join(__dirname, 'server.js')
      : path.join(__dirname, 'server.js'); // En prod, asegurarnos que se copie

  // Usamos fork para ejecutar el servidor usando el mismo ejecutable de Node/Electron
  backendProcess = fork(serverPath, [], {
      env: { 
          ...process.env, 
          START_SERVER: 'true',
          PROVEEHUB_DATA_PATH: DATA_PATH
      },
      stdio: 'inherit'
  });
};

app.whenReady().then(() => {
  startBackend();
  
  if (isDev) {
      // En desarrollo, iniciamos Vite
      console.log("Iniciando Vite...");
      spawn('npm', ['run', 'dev'], {
          stdio: 'inherit',
          shell: true
      });
      // Damos tiempo a Vite
      setTimeout(createWindow, 4000);
  } else {
      createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});
