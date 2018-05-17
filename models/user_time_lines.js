'use strict';

var path = require('path');
var model = require(__dirname + '/schemas/' + path.basename(__filename));

module.exports = (sequelize, DataTypes) => {
    var UserTimeLine = sequelize.define('UserTimeLine', model(DataTypes), {
        underscored: true,
        tableName: 'user_time_lines',
    });

    return UserTimeLine;
};