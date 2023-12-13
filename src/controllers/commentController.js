const { User, Complaint, Comment } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");

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

module.exports = { addComment, deleteComment, likeComment, dislikeComment };
