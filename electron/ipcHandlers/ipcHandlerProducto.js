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
             productoExistente.update(data)
        }

        await Producto.create(data)

        return { success: true, message: 'Registro creado correctamente' }
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
