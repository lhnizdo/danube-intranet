'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Session = sequelize.define('Session', model(DataTypes), {
        underscored: true,
        tableName: 'sessions',
    });

    Session.associate = function(models) {
        Session.belongsTo(models.User, {as: 'user'});
    };

    return Session;
};