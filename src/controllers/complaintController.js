const {
	User,
	Complaint,
	Comment,
	DetailComplaint,
	DetailPosting,
} = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");

const getAllComplaints = errorHandler(async (req, res) => {
	// GET PARAMS
	const { limit, page, start_id } = req.params;

	// GET ALL COMPLAINT
	const complaints = await Complaint.findAll();

	// RETURN THE RESULT
	return { complaints };
});

const getComplaint = errorHandler(async (req, res) => {
	// GET PARAMS
	const { id } = req.params;
	if (!id) throw new HttpError(401, "ID tidak ditemukan");

	// GET DATA FOR COMMENT AND COMPLAINT
	const complaint = await Complaint.findAll({
		where: {
			id: id,
		},
	});
	const comment = await Comment.findAll({
		where: {
			complaint_id: id,
		},
	});

	// RETURN THE DATA
	return { complaint, comment };
});

const searchComplaint = errorHandler(async (req, res) => {
	// GET DATA
	const { searchTerm } = req.body;
	if (!searchTerm) throw new HttpError(400, "Bad Request");

	const complaintDoc = await Complaint.findAll({
		where: {
			complaint: {
				[Op.like]: `%${searchTerm.complaint}%`,
			},
		},
	});

	return { complaints: complaintDoc };
});

const addComplaint = errorHandler(async (req, res) => {
	// GET DATA
	const { complaint, category } = req.body;
	if (!complaint && !category) throw new HttpError(400, "Bad Request");

	// INSERT DATA
	const complaintDoc = await Complaint.create({
		complaint: complaint,
		category: category,
	});
	const detailDoc = await DetailPosting.create({
		user_id: req.userId,
		complaint_id: complaintDoc.id,
	});

	// RETURN THE RESULT
	return { success: true };
});

const addComment = withTransaction(async (req, res) => {
	// GET DATA
	const { id, comment } = req.body;
	if (!id && !comment) throw new HttpError(400, "Bad Request");

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
	if (!id) throw new HttpError(400, "Bad Request");

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
	await DetailPosting.destroy({
		where: {
			complaint_id: id,
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
	if (!id) throw new HttpError(400, "Bad Request");

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
	if (!id) throw new HttpError(400, "Bad Request");

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
	if (!id) throw new HttpError(400, "Bad Request");

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
	if (!id) throw new HttpError(400, "Bad Request");

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
	if (!id) throw new HttpError(400, "Bad Request");

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
};
