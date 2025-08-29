const { ipcMain, BrowserWindow } = require('electron')

// Primera búsqueda
ipcMain.on('find-in-page', (event, texto) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.findInPage(texto)
  }
})

// Coincidencia siguiente
ipcMain.on('find-in-page-next', (event, texto) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.findInPage(texto, { forward: true, findNext: true })
  }
})

// Coincidencia anterior
ipcMain.on('find-in-page-prev', (event, texto) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.findInPage(texto, { forward: false, findNext: true })
  }
})

// Detener búsqueda cuando se cierra el cuadro
ipcMain.on('stop-find-in-page', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.stopFindInPage('clearSelection')
  }
})
