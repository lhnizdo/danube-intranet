'use strict';

const sequelize = require('../models/').sequelize;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const salesEngineering = await sequelize.model('TimeLine').findOne({
            where: {
                name: 'SALES/ENGINEERING'
            }
        });
        const materials = await sequelize.model('TimeLine').findOne({
            where: {
                name: 'MATERIALS'
            }
        });
        const manufacturing = await sequelize.model('TimeLine').findOne({
            where: {
                name: 'MANUFACTURING'
            }
        });

        return queryInterface.bulkInsert('predefined_tasks', [
            {
                uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
                name: 'Design',
                time_line_uuid: salesEngineering.uuid,
                created_at: new Date(),
                updated_at: new Date(),
            }, {
                uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
                name: 'Testing',
                time_line_uuid: salesEngineering.uuid,
                created_at: new Date(),
                updated_at: new Date(),
            }, {
                uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
                name: 'Material Order',
                time_line_uuid: materials.uuid,
                created_at: new Date(),
                updated_at: new Date(),
            }, {
                uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
                name: 'Tooling / manufacturing',
                time_line_uuid: manufacturing.uuid,
                created_at: new Date(),
                updated_at: new Date(),
            },
/*        {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Application opened',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Waiting for data',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Waiting for info',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Data received',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design started',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design finished',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design interrupted',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design cancelled',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Re-design started',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design review',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Design approved',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Send to manufacturing',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Tooling assembly finished',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'USA order',
            time_line_uuid: materials.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Manufacturing started',
            time_line_uuid: manufacturing.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Manufacturing cancelled',
            time_line_uuid: manufacturing.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Manufacturing complete',
            time_line_uuid: manufacturing.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Test/Assembly started',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Test/Assembly finished',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Test/Assembly problem',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Dukane trials',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Customer trials',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Trials approved',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Trials failed',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'FAT',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Shipped',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            name: 'Installed',
            time_line_uuid: salesEngineering.uuid,
            created_at: new Date(),
            updated_at: new Date(),
        },*/
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('predefined_tasks', null, {});
    }
};
