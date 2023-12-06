const { DataTypes} = require("sequelize");
const { db } = require("../config/database");

const DetailPosting = db.define(
	"m_detail_posting",
	{
		user_id: {
			type: DataTypes.INTEGER,
		},
		complaint_id: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = DetailPosting;
