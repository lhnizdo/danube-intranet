'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', model(DataTypes), {
        underscored: true,
        tableName: 'users',
    });

    User.associate = function(models) {
        User.belongsToMany(models.Role, {through: models.UserRole, as: 'roles'});
        User.belongsToMany(models.TimeLine, {through: models.UserTimeLine, as: 'timeLines'});
    };

    return User;
};