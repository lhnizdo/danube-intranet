'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var Log = sequelize.define('Log', model(DataTypes), {
        underscored: true,
        tableName: 'logs',
    });

    Log.associate = function(models) {
        Log.belongsTo(models.User, {as: 'owner'});
    };

    return Log;
};