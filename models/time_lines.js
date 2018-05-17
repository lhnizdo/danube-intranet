'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var TimeLine = sequelize.define('TimeLine', model(DataTypes), {
        underscored: true,
        tableName: 'time_lines',
    });

    TimeLine.associate = function(models) {
        TimeLine.hasMany(models.Task, {as: 'tasks'});
        TimeLine.hasMany(models.Event, {as: 'events'});
        TimeLine.belongsToMany(models.User, {through: models.UserTimeLine, as: 'users'});
    };

    return TimeLine;
};