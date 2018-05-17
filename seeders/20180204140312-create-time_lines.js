'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('time_lines', [{
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'SALES/ENGINEERING',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'MATERIALS',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'MANUFACTURING',
            created_at: new Date(),
            updated_at: new Date(),
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('time_lines', null, {});
    }
};
