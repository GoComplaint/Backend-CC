const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const Profile = db.define(
	"m_profile",
	{
		full_name: {
			type: DataTypes.STRING,
		},
		first_name: {
			type: DataTypes.STRING,
		},
		last_name: {
			type: DataTypes.STRING,
		},
		img: {
			type: DataTypes.STRING,
		},
		data_setting: {
			type: DataTypes.TEXT,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Profile;
