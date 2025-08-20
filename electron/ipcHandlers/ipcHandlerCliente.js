const {ipcMain} = require('electron')
const {Cliente} = require('../models/cliente')



ipcMain.handle('cliente:getAll', async () => {
    return Cliente.findAll()
})

ipcMain.handle('cliente:getById', async (event, id) => {
    return Cliente.findByPk(id)
})

ipcMain.handle('cliente:create', async (event, data) => {
    try {
        if(!data.rtn || !data.razonSocial || !data.direccion || !data.codigoCliente) {
            return { success: false, message: 'Datos incompletos' }
        }
        await Cliente.create(data)
        return { success: true, message: 'Registro creado correctamente' }
    } catch (error) {
        console.error('Error al crear registro:', error)
        return { success: false, message: error.message || 'Error desconocido' }
    }
})