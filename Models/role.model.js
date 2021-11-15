module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define('roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT(255),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'updated_at'
        },
    }, {
        tableName: 'roles',
    });

    Role.associate = function (models) {
        // In Sequelize through is required
        // now we can call : getUsers, setUsers, addUser, addUsers
        Role.belongsToMany(models.User, {
            through: 'users_roles',
            foreignKey: 'roleId',
            otherKey: 'userId',
        });
    };

    return Role;
};