const { User, Complaint, Comment } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");
const { db } = require("../config/database");

const analysisComplaint = errorHandler(async (req, res) => {
	const year = req.query.year;
	const next_year = parseInt(req.query.year) + 1;
	if (!year) throw new HttpError(400, "Incomplete Data");
	// GET TOTAL
	const tot_complaint = await Complaint.count({
		where: {
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});
	const tot_urgent = await Complaint.count({
		where: {
			prediction: {
				[Op.gt]: 50,
			},
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});
	const tot_not_urgent = await Complaint.count({
		where: {
			prediction: {
				[Op.lte]: 50,
			},
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});

	const tot_open = await Complaint.count({
		where: {
			status: "O",
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});
	const tot_on_working = await Complaint.count({
		where: {
			status: "P",
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});
	const tot_success = await Complaint.count({
		where: {
			status: "Y",
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});
	const tot_closed = await Complaint.count({
		where: {
			status: "N",
			createdAt: {
				[Op.gte]: db.cast(`${year}-01-01`, "date"),
				[Op.lt]: db.cast(`${next_year}-01-01`, "date"),
			},
		},
	});

	return {
		tot_complaint,
		tot_urgent,
		tot_not_urgent,
		tot_open,
		tot_on_working,
		tot_success,
		tot_closed,
	};
});

module.exports = { analysisComplaint };
