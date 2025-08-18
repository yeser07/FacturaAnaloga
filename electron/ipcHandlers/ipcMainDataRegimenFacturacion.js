const { ipcMain } = require('electron')
const { DataRegimenFacturacion } = require('../models/dataRegimenFacturacion')


// Crear
ipcMain.handle('dataRegimen:create', async (event, data) => {
  try {
    if (!data.cai || !data.fechaLimiteEmision || !data.rangoAutorizado || !data.folioInicial || !data.folioFinal) {
      return { success: false, message: 'Datos incompletos' }
    }
    await DataRegimenFacturacion.create({ ...data })

    return { success: true, message: 'Registro creado correctamente' }

  } catch (error) {
    console.error('Error al crear registro:', error)
    return { success: false, message: error.message || 'Error desconocido' }
  }
})

// Leer todos
ipcMain.handle('dataRegimen:getAll', async () => {
  return DataRegimenFacturacion.findAll()
})

// Actualizar

ipcMain.handle('dataRegimen:update', async (event, id, data) => {
  try {
    const record = await DataRegimenFacturacion.findByPk(id)

    if (!record) {
      return { success: false, message: 'Registro no encontrado' }
    }

    if (data.estado === "activo") {
      console.log('id que viene', id)
      const otroActivo = await DataRegimenFacturacion.findOne({
            where: {
              estado: 'activo'
            }
      });

      if (otroActivo) {
        console.log('otroActivo', otroActivo)
        return { success: false, message: 'Ya existe un régimen activo' }
      }
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



// Eliminar
ipcMain.handle('dataRegimen:delete', async (event, id) => {

  try {

    const record = await DataRegimenFacturacion.findByPk(id);
    if (!record) {
      return {
        success: false, message: 'Registro no encontrado'
      }
    }
    await record.destroy();
    return { success: true, message: 'Registro eliminado correctamente' }

  } catch (error) {
    console.error('Error al eliminar registro:', error)
    return { success: false, message: error.message || 'Error desconocido' }
  }

})


ipcMain.handle('dataRegimen:getCaiActivo', async () => {
  return DataRegimenFacturacion.findOne({
    where: {
      estado: 'activo'
    }
  })
})


    