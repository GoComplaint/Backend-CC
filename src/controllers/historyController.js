const { User, Complaint, Comment } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");

const historyComplaint = errorHandler(async (req, res) => {
	// GET DATA
	const { id } = req.params;
	let limit = parseInt(req.query.limit);
	let page = parseInt(req.query.page);
	let complaints;

	if (!limit) {
		complaints = await Complaint.findAll({
			where: {
				user_id: id,
			},
			order: [["createdAt", "DESC"]],
		});
	} else {
		let offsetComplaint = (page - 1) * limit;
		if (!page) offsetComplaint = 0;

		// GET ALL COMPLAINT
		complaints = await Complaint.findAll({
			where: {
				user_id: id,
			},
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offsetComplaint,
		});

		if (!complaints[0]) throw new HttpError(400, "Data limit");
	}

	const user = await User.findOne({
		where: {
			id: id,
		},
	});
	let username = user.username;

	const complaints_user = complaints.map((c) => {
		return { ...c.dataValues, username };
	});

	// RETURN THE RESULT
	return {
		complaints: complaints_user,
	};
});

module.exports = { historyComplaint };
