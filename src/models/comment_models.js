const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const Comment = db.define(
	"m_comment",
	{
		user_id: {
			type: DataTypes.INTEGER,
		},
		complaint_id: {
			type: DataTypes.INTEGER,
		},
		comment: {
			type: DataTypes.STRING,
		},
		like: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Comment;
