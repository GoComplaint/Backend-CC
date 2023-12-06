const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const DetailComplaint = db.define(
	"m_detail_complaint",
	{
		complaint_id: {
			type: DataTypes.INTEGER,
		},
		comment_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = DetailComplaint;
