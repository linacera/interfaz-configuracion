var sequelize = require('../db/connection');
const Sequelize = require('sequelize');


const Action = sequelize.define('action', {
    action_id: {
        type: Sequelize.SMALLINT, 
        primaryKey: true,
    },
    action_name: {
        type: Sequelize.STRING
    },
},{
    tableName: 'action',
    timestamps: false,
});

module.exports = Action;