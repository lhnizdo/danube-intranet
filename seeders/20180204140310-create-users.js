'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Luboš',
            last_name: 'Hnízdo',
            password: bcrypt.hashSync("password"),
            created_at: new Date(),
            updated_at: new Date(),
        },/* {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Vlastimil',
            last_name: 'Choceňský',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Petr',
            last_name: 'Bártek',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Petr',
            last_name: 'Vaško',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Oscar',
            last_name: 'Pivard',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Lukáš',
            last_name: 'Dlhopolček',
            created_at: new Date(),
            updated_at: new Date(),
        }, {
            uuid: Sequelize.Utils.toDefaultValue(new Sequelize.DataTypes.UUIDV1(), null),
            email: 'lubos.hnizdo@ideastudio.cz',
            first_name: 'Martin',
            last_name: 'Valeš',
            created_at: new Date(),
            updated_at: new Date(),
        }*/]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
