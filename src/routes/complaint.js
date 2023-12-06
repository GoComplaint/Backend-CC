const express = require("express");
const controllers = require("../controllers");
const { verifyAccessToken } = require("../middlewares");
const router = express.Router();

router.get("/complaints", controllers.complaint.getAllComplaints);
router.get("/complaints/:id", controllers.complaint.getComplaint);
router.get("/search", controllers.complaint.searchComplaint);

router.post(
	"/complaints",
	verifyAccessToken,
	controllers.complaint.addComplaint
);
router.post("/comments", verifyAccessToken, controllers.complaint.addComment);

router.delete(
	"/complaints/:id",
	verifyAccessToken,
	controllers.complaint.deleteComplaint
);
router.delete(
	"/comments/:id",
	verifyAccessToken,
	controllers.complaint.deleteComment
);

router.put(
	"/complaints/:id/like",
	verifyAccessToken,
	controllers.complaint.likeComplaint
);
router.put(
	"/comments/:id/like",
	verifyAccessToken,
	controllers.complaint.likeComment
);

router.put(
	"/complaints/:id/dislike",
	verifyAccessToken,
	controllers.complaint.dislikeComplaint
);
router.put(
	"/comments/:id/dislike",
	verifyAccessToken,
	controllers.complaint.dislikeComment
);

module.exports = router;
