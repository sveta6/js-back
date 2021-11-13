const Sequelize = require("sequelize");
const { sequelize } = require("..");
const ToDo = require('./ToDo.model');
const Token = require('./Token.model');

class User extends Sequelize.Model { }

User.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        // userId: {
        //     type: Sequelize.DataTypes.UUID,
        //     defaultValue: Sequelize.DataTypes.UUIDV4,
        // },
        login: {
            type: Sequelize.STRING,
            allowNull: null,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'seva@puk.com' ,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    { sequelize: sequelize, underscored: true, modelName: "user" }
);

User.hasMany(Token);
ToDo.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ToDo);
ToDo.belongsTo(User, { foreignKey: "userId" });

module.exports = User;