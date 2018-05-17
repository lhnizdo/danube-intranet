const routes = module.exports = require('next-routes')();

routes
    .add('edit-application', '/edit-application/:uuid')
    .add('index', '/');