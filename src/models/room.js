
var sequelize = require('../db/connection');
const Sequelize = require('sequelize');
const device = require('./device');

const Room = sequelize.define('room', {
    room_id: {
        type: Sequelize.SMALLINT, 
        primaryKey: true,
    },
    room_name: {
        type: Sequelize.STRING
    },
},{
    tableName: 'room',
    timestamps: false,
});

Room.hasMany(device, {foreignKey: 'room_id'})

module.exports = Room;