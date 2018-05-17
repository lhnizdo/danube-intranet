'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(__filename);
var queries   = {
    queries: {},
    mutations: {},
};

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var modelQueries = require(path.join(__dirname, file));

        Object.keys(queries).forEach(key => {
            if (modelQueries[key]) {
                Object.assign(queries[key], modelQueries[key]);
            }
        });
    });

module.exports = queries;