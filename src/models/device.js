var sequelize = require('../db/connection');
const Sequelize = require('sequelize');
const action = require('./action');

const Device = sequelize.define('device', {
    id_device: {
        type: Sequelize.SMALLINT, 
        primaryKey: true,
    },
    device_name: {
        type: Sequelize.STRING
    },
},{
    tableName: 'device',
    timestamps: false,
});

Device.hasMany(action, {foreignKey: 'id_device'})

module.exports = Device;