const { Sequelize } = require('sequelize')
const path = require('path')
const { app } = require('electron')

const dbPath = path.join(app.getPath('userData'), 'facturaanaloga.sqlite')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath
})

module.exports = { sequelize }
