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
  updateCliente: (id, data) => ipcRenderer.invoke('cliente:update', id, data),
 deleteCliente: (id) => ipcRenderer.invoke('cliente:delete', id),


  // CRUD Producto
  createProducto: (data) => ipcRenderer.invoke('producto:create', data),
  getAllProducto: () => ipcRenderer.invoke('producto:getAll'),
  getProductoByCodigo: (codigo) => ipcRenderer.invoke('producto:getProductoByCodigo', codigo),
  updateProducto: (id, data) => ipcRenderer.invoke('producto:update', id, data),
  deleteProducto: (id) => ipcRenderer.invoke('producto:delete', id),

  //FACTURA
 generarFactura : (data) => ipcRenderer.invoke('factura:generarFactura', data),

})

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigateVue: (callback) => ipcRenderer.on('navegar-vue', callback)
});