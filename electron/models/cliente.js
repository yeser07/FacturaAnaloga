const { DataTypes } = require('sequelize')
const { sequelize } = require('../db')



const Cliente = sequelize.define('cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    rtn: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    codigoCliente: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
});

module.exports = { Cliente };