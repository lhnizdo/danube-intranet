'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var ApplicationStatus = sequelize.define('ApplicationStatus', model(DataTypes), {
        underscored: true,
        tableName: 'application_statuses',
    });

    return ApplicationStatus;
};