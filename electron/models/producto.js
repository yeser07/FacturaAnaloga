const { DataTypes } = require('sequelize')
const { sequelize } = require('../db')


const Producto = sequelize.define('producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    precio: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        required: true
    }
})


module.exports = { Producto }