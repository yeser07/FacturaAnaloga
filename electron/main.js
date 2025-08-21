const { app, BrowserWindow } = require('electron')
const path = require('path')
const { sequelize } = require('./db')
const { ipcMain } = require('electron')
const { DataRegimenFacturacion } = require('./models/dataRegimenFacturacion')

///IPC HANDLERS

require('./ipcHandlers/ipcMainDataRegimenFacturacion');
require('./ipcHandlers/ipcHandlerEmpresa');
require('./ipcHandlers/ipcHandlerCliente');
require('./ipcHandlers/ipcHandlerProducto');


//BD SQLITE


function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,

    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async () => {
  await sequelize.sync({alter: true}) // Sincronizar la base de datos
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

