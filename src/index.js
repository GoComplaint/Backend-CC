const express = require("express");
const logger = require("./logger");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const { db } = require("./config/database");
const {
	User,
	RefreshToken,
	Complaint,
	Comment,
	Profile,
	Lov,
} = require("./models/index.js");

async function startServer() {
	// Connect Database
	try {
		await db.authenticate();
		logger.info("Database connected ...");

		// Create Table
		await User.sync();
		await RefreshToken.sync();
		await Complaint.sync();
		await Comment.sync();
		await Profile.sync();
		await Lov.sync();
	} catch (error) {
		logger.error(error);
	}

	// REST API
	app.use(express.json());
	app.use(cors());

	app.use("/api", routes);

	app.get("/", (req, res) => {
		logger.info("Backend 1 finally deployed");
		res.send("Backend 1 finally deployed");
	});

	app.use((err, req, res, next) => {
		logger.error(err.stack);
		res.status(err.statusCode || 500).send({ error: err.message });
	});

	app.listen(port, () => {
		logger.info(`Server listening at http://localhost:${port}`);
	});
}

module.exports = startServer;
