const {ipcMain} = require('electron')
 const { Empresa } = require('../models/empresa')



ipcMain.handle('empresa:create', async (event, data) => {

    console.log('Data recibida:', data);
  try {
    if(!data.rtn || !data.razonSocial || !data.direccion || !data.telefono || !data.correo || !data.logo) {
      return { success: false, message: 'Datos incompletos' }
    }

    // Guardar logo en disco
    const base64Data = data.logo.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, 'base64')
    const fs = require('fs')
    const path = require('path')

    const logoPath = path.join(__dirname, 'uploads', `logo_${Date.now()}.png`)
    fs.writeFileSync(logoPath, buffer)

    // Guardar en BD la ruta, no el base64
    await Empresa.create({
      ...data,
      logo: logoPath
    })

    return { success: true, message: 'Registro creado correctamente' }
  } catch (error) {
    console.error('Error al crear registro:', error)
    return { success: false, message: error.message || 'Error desconocido' }
  }
})


ipcMain.handle('empresa:getAll', async () => {
    return Empresa.findAll()
})

ipcMain.handle('empresa:update', async (event, id, data) => {
    try {
        const record = await Empresa.findByPk(id)
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

ipcMain.handle('empresa:delete', async (event, id) => {
    try {
        const record = await Empresa.findByPk(id)
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

ipcMain.handle('empresa:getById', async (event, id) => {
    return Empresa.findByPk(id)
})