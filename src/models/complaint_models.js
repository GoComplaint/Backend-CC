const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const Complaint = db.define(
	"m_complaint",
	{
		user_id: {
			type: DataTypes.INTEGER,
		},
		complaint: {
			type: DataTypes.STRING,
		},
		location: {
			type: DataTypes.STRING,
		},
		file: {
			type: DataTypes.STRING,
		},
		category: {
			type: DataTypes.STRING,
		},
		prediction: {
			type: DataTypes.STRING,
		},
		like: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Complaint;
