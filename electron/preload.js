const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // Ejemplo
  sayHello: () => console.log('Hola desde Electron preload.js'),

  // CRUD de DataRegimenFacturacion
  createDataRegimen: (data) => ipcRenderer.invoke('dataRegimen:create', data),
  getAllDataRegimen: () => ipcRenderer.invoke('dataRegimen:getAll'),
   updateDataRegimen: (id, data) => ipcRenderer.invoke('dataRegimen:update', id, data),
  deleteDataRegimen: (id) => ipcRenderer.invoke('dataRegimen:delete', id),
  getCaiActivo: () => ipcRenderer.invoke('dataRegimen:getCaiActivo'),

  //CRUD EmpresaA

  createEmpresa: (data) => ipcRenderer.invoke('empresa:create', data),
  getAllEmpresa: () => ipcRenderer.invoke('empresa:getAll'),
  updateEmpresa: (id, data) => ipcRenderer.invoke('empresa:update', id, data),
  deleteEmpresa: (id) => ipcRenderer.invoke('empresa:delete', id),


  // CRUD Cliente
  createCliente: (data) => ipcRenderer.invoke('cliente:create', data),
  getAllCliente: () => ipcRenderer.invoke('cliente:getAll'),
  //updateCliente: (id, data) => ipcRenderer.invoke('cliente:update', id, data),
//  deleteCliente: (id) => ipcRenderer.invoke('cliente:delete', id)

})
