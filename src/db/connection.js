const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize('smart_home',null, null,{
  host:'localhost',
  dialect: 'sqlite',
  storage: 'C:/Users/jccer/Documents/ENTREGABLES/PROYECTO/BaseDeDatos/smart_home.db',
  logging: false,
})

sequelize.authenticate()
  .then(() => {
    console.log('Conectado');
  })
  .catch(err => {
    console.log('No se conecto')
  })

module.exports = sequelize;