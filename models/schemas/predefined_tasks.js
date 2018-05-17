'use strict';
module.exports = (DataTypes) => ({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    time_line_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'time_lines',
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