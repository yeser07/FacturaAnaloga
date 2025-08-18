const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')

const Empresa = sequelize.define('empresa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    rtn: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    razonSocial: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
})

module.exports = {Empresa};