'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Task = sequelize.define('Task', model(DataTypes), {
        underscored: true,
        tableName: 'tasks',
    });

    Task.associate = function(models) {
        Task.belongsTo(models.TaskStatus, {as: 'status'});
        Task.belongsTo(models.User, {as: 'assigned'});
    };

    return Task;
};