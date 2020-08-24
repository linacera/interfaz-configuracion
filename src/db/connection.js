const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize('smart_home',null, null,{
  host:'localhost',
  dialect: 'sqlite',
  storage: '/home/johanna/Documentos/Universidad/Titulacion/smart_home.db',
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