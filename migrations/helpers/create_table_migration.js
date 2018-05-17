module.exports = (ModelName) => {
    var model = require(__dirname + '/../../models/schemas/' + ModelName + '.js');

    return {
        up: (queryInterface, Sequelize) => {
            return queryInterface.createTable(ModelName, model(Sequelize));
        },
        down: (queryInterface, Sequelize) => {
            return queryInterface.dropTable(ModelName, {});
        }
    };
};