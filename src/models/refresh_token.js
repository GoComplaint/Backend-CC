const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const RefreshToken = db.define(
	"m_refresh_token",
	{
		user_id: {
			type: DataTypes.STRING,
		},
		token: {
			type: DataTypes.TEXT,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = RefreshToken;
