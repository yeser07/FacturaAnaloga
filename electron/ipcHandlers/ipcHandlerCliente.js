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

ipcMain.handle('cliente:update', async (event, id, data) => {
    try {
        const record = await Cliente.findByPk(id)
        if (!record) {
            return { success: false, message: 'Registro no encontrado' }
        }
        await record.update(data)
        return {
            success: true,
            message: 'Registro actualizado correctamente',
            data: record.get({ plain: true })
        }
    } catch (error) {
        console.error('Error al actualizar registro:', error)
        return { success: false, message: error.message || 'Error desconocido' }
    }
})

ipcMain.handle('cliente:delete', async (event, id) => {
    try {
        const record = await Cliente.findByPk(id)
        if (!record) {
            return { success: false, message: 'Registro no encontrado' }
        }
        await record.destroy()
        return { success: true, message: 'Registro eliminado correctamente' }
    } catch (error) {
        console.error('Error al eliminar registro:', error)
        return { success: false, message: error.message || 'Error desconocido' }
    }
})


