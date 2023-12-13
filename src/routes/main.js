const express = require("express");
const controllers = require("../controllers");
const { verifyAccessToken } = require("../middlewares");
const router = express.Router();

// ===========> Complaint
// GET
router.get("/complaints", controllers.complaint.getAllComplaints);
router.get("/complaints/:id", controllers.complaint.getComplaint);
router.get("/search", controllers.complaint.searchComplaint);
// POST
router.post(
	"/complaints",
	verifyAccessToken,
	controllers.complaint.addComplaint
);
// PUT
router.put("/status", verifyAccessToken, controllers.complaint.statusComplaint);
router.put(
	"/complaints/:id/like",
	verifyAccessToken,
	controllers.complaint.likeComplaint
);
router.put(
	"/complaints/:id/dislike",
	verifyAccessToken,
	controllers.complaint.dislikeComplaint
);
// DELETE
router.delete(
	"/complaints/:id",
	verifyAccessToken,
	controllers.complaint.deleteComplaint
);

// ===========> Comment
// POST
router.post("/comments", verifyAccessToken, controllers.comment.addComment);
// PUT
router.put(
	"/comments/:id/like",
	verifyAccessToken,
	controllers.comment.likeComment
);

router.put(
	"/comments/:id/dislike",
	verifyAccessToken,
	controllers.comment.dislikeComment
);
// DELETE
router.delete(
	"/comments/:id",
	verifyAccessToken,
	controllers.comment.deleteComment
);

// ===========> History
// GET
router.get(
	"/history/complaints/:id",
	verifyAccessToken,
	controllers.history.historyComplaint
);

module.exports = router;
