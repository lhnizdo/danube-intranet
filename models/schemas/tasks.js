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
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'task_statuses',
            key: 'uuid'
        },
    },
    assigned_uuid: {
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