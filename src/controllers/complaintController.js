const { User, Complaint, Comment } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");
const tf = require("@tensorflow/tfjs");

const getAllComplaints = errorHandler(async (req, res) => {
	// GET PARAMS
	let limit = parseInt(req.query.limit);
	let page = parseInt(req.query.page);

	let offsetComplaint = (page - 1) * limit;
	if (!page) offsetComplaint = 0;

	// GET ALL COMPLAINT
	const complaints = await Complaint.findAll({
		order: [["createdAt", "DESC"]],
		limit: limit,
		offset: offsetComplaint,
	});

	if (!complaints[0]) throw new HttpError(400, "Data limit");

	const complaints_user = await Promise.all(
		complaints.map(async (c) => {
			let user = await User.findOne({
				where: {
					id: c.user_id,
				},
			});

			let username = user.username;

			return { ...c.dataValues, username };
		})
	);

	// RETURN THE RESULT
	return {
		complaints: complaints_user,
	};
});

const getComplaint = errorHandler(async (req, res) => {
	// GET PARAMS
	const { id } = req.params;
	if (!id) throw new HttpError(401, "ID not found");

	// GET DATA FOR COMMENT AND COMPLAINT
	const complaint = await Complaint.findOne({
		where: {
			id: id,
		},
	});

	const user = await User.findOne({
		where: {
			id: complaint.user_id,
		},
	});
	const username = user.username;

	const comment = await Comment.findAll({
		where: {
			complaint_id: id,
		},
	});
	const comments = await Promise.all(
		comment.map(async (c) => {
			let userComment = await User.findOne({
				where: {
					id: c.user_id,
				},
			});

			userComment = userComment.username;

			return { ...c.dataValues, username: userComment };
		})
	);

	// RETURN THE DATA
	return { complaint: { ...complaint.dataValues, username }, comments };
});

const searchComplaint = errorHandler(async (req, res) => {
	// GET DATA
	const complaint = req.query.complaint;
	if (!complaint) throw new HttpError(400, "Incomplete Data");

	const complaintDoc = await Complaint.findAll({
		where: {
			complaint: {
				[Op.like]: `%${complaint}%`,
			},
		},
	});

	return { complaints: complaintDoc };
});

const addComplaint = errorHandler(async (req, res) => {
	// GET DATA
	let { complaint, category, location } = req.body;
	if (!complaint || !category || !location)
		throw new HttpError(400, "Incomplete Data");

	// MAX COMPLAINT 255
	if (complaint.length > 255)
		throw new HttpError(400, "Complaint Text Data Size Limit Exceeded (255)");

	// INSERT DATA
	const complaintDoc = await Complaint.create({
		user_id: req.userId,
		complaint: complaint,
		category: category.toUpperCase(),
		location: location,
	});

	// RETURN THE RESULT
	return { success: true };
});

const addComment = withTransaction(async (req, res) => {
	// GET DATA
	const { id, comment } = req.body;
	if (!id || !comment) throw new HttpError(400, "Incomplete Data");

	// MAX COMPLAINT 255
	if (comment.length > 255)
		throw new HttpError(400, "Comment Text Data Size Limit Exceeded (255)");

	// VERIFY FUNCTION
	const result = await Complaint.findOne({
		where: {
			id: id,
		},
	});
	if (!result) throw new HttpError(400, "ID Not Found");

	// INSERT DATA to Comment, DetailComplaint
	const commentDoc = await Comment.create({
		user_id: req.userId,
		complaint_id: id,
		comment: comment,
	});

	// RETURN THE RESULT
	return { success: true };
});

const deleteComplaint = withTransaction(async (req, res) => {
	// GET DATA
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// VERIFY FUNCTION
	const result = await Complaint.findOne({
		where: {
			id: id,
		},
	});
	if (!result) throw new HttpError(400, "ID Not Found");

	// DELETE COMPLAINT + DETAIL + COMMENT
	await Complaint.destroy({
		where: {
			id: id,
		},
	});
	await Comment.destroy({
		where: {
			complaint_id: id,
		},
	});

	return { success: true };
});

const deleteComment = errorHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// DELETE COMMENT
	await Comment.destroy({
		where: {
			id: id,
		},
	});

	return { success: true };
});

const likeComplaint = errorHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// VERIFY FUNCTION
	const complaintDoc = await Complaint.findOne({
		where: {
			id: id,
		},
	});
	if (!complaintDoc) throw new HttpError(400, "ID Not Found");

	complaintDoc.like += 1;
	await complaintDoc.save();

	return { success: true };
});

const likeComment = errorHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// VERIFY FUNCTION
	const commentDoc = await Comment.findOne({
		where: {
			id: id,
		},
	});
	if (!commentDoc) throw new HttpError(400, "ID Not Found");

	commentDoc.like += 1;
	await commentDoc.save();

	return { success: true };
});

const dislikeComplaint = errorHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// VERIFY FUNCTION
	const complaintDoc = await Complaint.findOne({
		where: {
			id: id,
		},
	});
	if (!complaintDoc) throw new HttpError(400, "ID Not Found");

	complaintDoc.like -= 1;
	await complaintDoc.save();

	return { success: true };
});

const dislikeComment = errorHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new HttpError(400, "Incomplete Data");

	// VERIFY FUNCTION
	const commentDoc = await Comment.findOne({
		where: {
			id: id,
		},
	});
	if (!commentDoc) throw new HttpError(400, "ID Not Found");

	commentDoc.like -= 1;
	await commentDoc.save();

	return { success: true };
});

const statusComplaint = errorHandler(async (req, res) => {
	const { id, status } = req.body;
	if (!id || !status) throw new HttpError(400, "Incomplete Data");

	// STATUS :
	// N = OPEN
	// P = PENDING
	// Y = COMPLETE

	const complaintDoc = await Complaint.findOne({
		where: {
			id: id,
		},
	});
	if (!complaintDoc) throw new HttpError(400, "ID Not Found");

	complaintDoc.status = status;
	await complaintDoc.save();

	return { success: true };
});

module.exports = {
	getAllComplaints,
	getComplaint,
	addComplaint,
	addComment,
	searchComplaint,
	deleteComplaint,
	deleteComment,
	likeComplaint,
	likeComment,
	dislikeComplaint,
	dislikeComment,
	statusComplaint,
};
