// menu.js
const { Menu, shell, dialog, BrowserWindow } = require('electron');

function createAppMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Inicio',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            win.webContents.send('navegar-vue', '/');
          }
        },
        {
            label: 'Crear Factura',
            click: () => {
              const win = BrowserWindow.getFocusedWindow();
              win.webContents.send('navegar-vue', '/crear-factura');
            }
        },
        {
          label: 'Clientes',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            win.webContents.send('navegar-vue', '/clientes');
          }
        },
        {
          label: 'Productos',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            win.webContents.send('navegar-vue', '/productos');
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Edición',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        {
          label: 'Buscar',
          accelerator: 'Ctrl+F',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.send('activar-busqueda');
            }
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools', label: 'Herramientas de Desarrollador' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Acerca de',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow(); // ventana activa
            dialog.showMessageBox(focusedWindow, {
              type: 'info',
              title: 'Acerca de',
              message: 'Factuacion Analoga \nVersión 1.0.0 \nDesarrollado por Yeser Sabillon \n2025',
            });
          }
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

module.exports = createAppMenu;

