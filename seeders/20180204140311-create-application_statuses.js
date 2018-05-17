'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('application_statuses', [{
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'unstarted',
            description: 'Unstarted',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'running',
            description: 'Running',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'on_hold',
            description: 'On Hold',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'completed',
            description: 'Completed',
            created_at: new Date(),
            updated_at: new Date(),
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('application_statuses', null, {});
    }
};
