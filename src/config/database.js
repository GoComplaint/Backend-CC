const { Sequelize } = require("sequelize");

const db_host = process.env.DB_HOST || "localhost";
const db_name = process.env.DB_NAME || "go_complaint_db";
const db_user = process.env.DB_USER || "root";
const db_pass = process.env.DB_PASS || "";
const db_port = process.env.DB_PORT || 3306;

const db = new Sequelize(db_name, db_user, db_pass, {
	host: db_host,
	port: db_port,
	dialect: "mysql",
});

module.exports = { db };
