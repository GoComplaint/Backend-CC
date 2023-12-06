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
		},
		dislike: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Complaint;
