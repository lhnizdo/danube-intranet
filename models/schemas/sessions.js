'use strict';
module.exports = (DataTypes) => ({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    access_token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
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