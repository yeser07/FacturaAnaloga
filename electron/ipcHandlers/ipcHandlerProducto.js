const {ipcMain} = require('electron')
const {Producto} = require('../models/producto')
const { Op } = require('sequelize');



ipcMain.handle('producto:getAll', async () => {
    return Producto.findAll()
})

ipcMain.handle('producto:getById', async (event, id) => {
    return Producto.findByPk(id)
})

ipcMain.handle('producto:create', async (event, data) => {
    try {
        if(!data.codigo || !data.descripcion || !data.precio) {
            return { success: false, message: 'Datos incompletos' }
        }

        let codigoProducto = data.codigo
        let productoExistente = await Producto.findOne({ where: { codigo: codigoProducto } })

        if (productoExistente) {
            await productoExistente.update(data);
            return { success: true, message: 'Producto actualizado correctamente' };
        } else {
            await Producto.create(data);
            return { success: true, message: 'Producto creado correctamente' };
        }
        
    } catch (error) {
        console.error('Error al crear registro:', error)
        return { success: false, message: error.message || 'Error desconocido' }
    }
})

ipcMain.handle('producto:getProductoByCodigo', async (event, codigo) => {
  try {
    if (!codigo) return [];

    const productos = await Producto.findAll({
      where: {
        codigo: {
          [Op.like]: `%${codigo}%`
        }
      },
      limit: 10
    });

    return productos.map(p => p.toJSON());
  } catch (err) {
    console.error('Error buscando productos:', err);
    return [];
  }
});

ipcMain.handle('producto:delete', async (event, id) => {
    try {
        const record = await Producto.findByPk(id)
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

ipcMain.handle('producto:update', async (event, id, data) => {
    try {
        const record = await Producto.findByPk(id)
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
