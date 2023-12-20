const { User, Complaint, Comment } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");
const { Op } = require("sequelize");
const { processFiles } = require("../middlewares");
const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const axios = require("axios");
const logger = require("../logger");

// INIT CLOUD STORAGE
const projectId = process.env.PROJECT_ID;
const keyFilename = "key.json";

const storage = new Storage({ projectId: projectId, keyFilename: keyFilename });
const bucket = storage.bucket("go-complaint-bucket");

const getAllComplaints = errorHandler(async (req, res) => {
	// GET PARAMS
	let limit = parseInt(req.query.limit);
	let page = parseInt(req.query.page);

	let complaints;

	if (!limit) {
		complaints = await Complaint.findAll({
			order: [["createdAt", "DESC"]],
		});
	} else {
		let offsetComplaint = (page - 1) * limit;
		if (!page) offsetComplaint = 0;

		// GET ALL COMPLAINT
		complaints = await Complaint.findAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offsetComplaint,
		});

		if (!complaints[0]) throw new HttpError(400, "Data limit");
	}

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
	const complaint = req.query.complaint || "";
	const status = req.query.status || "";
	const prediction = req.query.prediction || "";
	let prediction_down_threshold = 0;
	let prediction_upper_threshold = 100;

	if (!complaint && !status && !prediction)
		throw new HttpError(400, "Incomplete Data");

	if (prediction.toUpperCase() == "URGENT") {
		prediction_down_threshold = 50;
	} else if (prediction.toUpperCase() == "NOT_URGENT") {
		prediction_upper_threshold = 50;
	}

	const complaintDoc = await Complaint.findAll({
		where: {
			complaint: {
				[Op.like]: `%${complaint}%`,
			},
			status: {
				[Op.like]: `%${status}%`,
			},
			prediction: {
				[Op.gt]: prediction_down_threshold,
				[Op.lte]: prediction_upper_threshold,
			},
		},
	});
	const complaints = await Promise.all(
		complaintDoc.map(async (c) => {
			let userComplaint = await User.findOne({
				where: {
					id: c.user_id,
				},
			});

			userComplaint = userComplaint.username;

			return { ...c.dataValues, username: userComplaint };
		})
	);

	return { complaints };
});

const addComplaint = errorHandler(async (req, res) => {
	// MULTER FORM DATA
	await processFiles(req, res);

	// GET DATA
	let { complaint, category, location } = req.body;
	if (!complaint || !category || !location)
		throw new HttpError(400, "Incomplete Data");

	// MAX COMPLAINT 255
	if (complaint.length > 255)
		throw new HttpError(400, "Complaint Text Data Size Limit Exceeded (255)");

	// IMAGE UPLOAD
	let fileUrl = null;
	if (req.files) {
		fileUrl = [];
		req.files.forEach((file) => {
			const fileExt = file.originalname.split(".").pop().toUpperCase();
			if (
				fileExt !== "PNG" &&
				fileExt !== "JPG" &&
				fileExt !== "JPEG" &&
				fileExt !== "MP4"
			)
				throw new HttpError(400, "File extension not supported");

			const blob = bucket.file(
				"complaints/" +
					Date.now() +
					file.originalname.toLowerCase().split(" ").join("-")
			);
			const blobStream = blob.createWriteStream();
			blobStream.on("finish", () => {
				const uploadUrl = format(
					`https://storage.googleapis.com/${bucket.name}/${blob.name}`
				);
			});
			blobStream.end(file.buffer);

			fileUrl.push(
				`https://storage.googleapis.com/${bucket.name}/${blob.name}`
			);
		});
	}

	// PREDICTION
	const postData = {
		complaint: complaint,
	};
	const prediction = await axios.post(
		"https://ml-dot-go-complaint.et.r.appspot.com/predict",
		postData
	);
	
	// INSERT DATA
	const complaintDoc = await Complaint.create({
		user_id: req.userId,
		complaint: complaint,
		category: category.toUpperCase(),
		location: location,
		prediction: prediction.data.percentage,
		file: fileUrl.toString(),
	});

	// RETURN THE RESULT
	return { complaint: complaintDoc };
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

const statusComplaint = errorHandler(async (req, res) => {
	const { id, status } = req.body;
	if (!id || !status) throw new HttpError(400, "Incomplete Data");

	// STATUS :
	// O = OPEN
	// P = PENDING
	// Y = COMPLETE
	// N = CLOSED

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
	searchComplaint,
	deleteComplaint,
	likeComplaint,
	dislikeComplaint,
	statusComplaint,
};
