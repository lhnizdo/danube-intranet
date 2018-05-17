'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Event = sequelize.define('Event', model(DataTypes), {
        underscored: true,
        tableName: 'events',
    });

    Event.associate = function(models) {
        Event.belongsTo(models.User, {as: 'owner'});
    };

    return Event;
};