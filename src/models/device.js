var sequelize = require('../db/connection');
const Sequelize = require('sequelize');
const action = require('./action');

const Device = sequelize.define('device', {
    device_id: {
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

Device.hasMany(action, {foreignKey: 'device_id'})

module.exports = Device;