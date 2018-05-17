'use strict';
module.exports = (DataTypes) => ({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    log: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    owner_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'uuid'
        },
    },
    application_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'applications',
            key: 'uuid'
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});