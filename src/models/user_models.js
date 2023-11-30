const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const User = db.define(
	"m_user",
	{
		username: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = User;
