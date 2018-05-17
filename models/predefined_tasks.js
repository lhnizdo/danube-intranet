'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var PredefinedTask = sequelize.define('PredefinedTask', model(DataTypes), {
        underscored: true,
        tableName: 'predefined_tasks',
    });

    PredefinedTask.associate = function(models) {
        PredefinedTask.belongsTo(models.TimeLine, {as: 'timeLine'});
    };

    return PredefinedTask;
};