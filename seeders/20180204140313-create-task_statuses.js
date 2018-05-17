'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('task_statuses', [{
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'not_approved',
            description: 'Not Approved',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'approved',
            description: 'Approved',
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
        return queryInterface.bulkDelete('task_statuses', null, {});
    }
};
