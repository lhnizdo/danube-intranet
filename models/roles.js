'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Role = sequelize.define('Role', model(DataTypes), {
        underscored: true,
        tableName: 'roles',
    });

    Role.associate = function(models) {
        Role.belongsToMany(models.User, {through: models.UserRole, as: 'users'});
    };

    return Role;
};