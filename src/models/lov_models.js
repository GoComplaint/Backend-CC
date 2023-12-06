const { DataTypes } = require("sequelize");
const { db } = require("../config/database");

const Lov = db.define(
	"s_lov_value",
	{
		category: {
			type: DataTypes.STRING,
		},
		value: {
			type: DataTypes.STRING,
		},
		remark: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Lov;
