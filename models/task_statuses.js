'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var TaskStatus = sequelize.define('TaskStatus', model(DataTypes), {
        underscored: true,
        tableName: 'task_statuses',
    });

    return TaskStatus;
};