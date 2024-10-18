const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const arduino = require('./arduino.js');
const SerialPort = require('serialport');

ipcMain.handle('list-ports', async (event) => {
  try {
      const ports = await SerialPort.list();
      return ports.map(port => ({ path: port.path, manufacturer: port.manufacturer }));
  } catch (error) {
      console.error('Failed to list ports:', error);
      return [];
  }
});

ipcMain.handle('connect-arduino', async (event, portPath) => {
    return arduino.connect(portPath);
});

ipcMain.handle('disconnect-arduino', async (event) => {
    return arduino.disconnect();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});