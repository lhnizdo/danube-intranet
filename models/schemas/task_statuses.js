module.exports = (DataTypes) => ({
    uuid: {
        type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
            allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
            allowNull: false,
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