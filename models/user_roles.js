'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var UserRole = sequelize.define('UserRole', model(DataTypes), {
        underscored: true,
        tableName: 'user_roles',
    });

    return UserRole;
};