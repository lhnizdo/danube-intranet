'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Application = sequelize.define('Application', model(DataTypes), {
        underscored: true,
        tableName: 'applications',
    });

    Application.associate = function(models) {
        Application.belongsTo(models.ApplicationStatus, {as: 'status'});
        Application.belongsTo(models.User, {as: 'owner'});
    };

    return Application;
};