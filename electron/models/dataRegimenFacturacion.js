const { DataTypes } = require('sequelize')
const { sequelize } = require('../db')

const DataRegimenFacturacion = sequelize.define('dataRegimenFacturacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cai: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaLimiteEmision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  rangoAutorizado: {
    type: DataTypes.STRING,
    allowNull: false
  },

  folioInicial: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  folioFinal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },  

  estado: {
    type: DataTypes.STRING,
    defaultValue: 'inactivo',
    allowNull: false
  }

})

module.exports = { DataRegimenFacturacion }
