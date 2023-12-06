const User = require("./user_models");
const RefreshToken = require("./refresh_token");
const Complaint = require("./complaint_models");
const Comment = require("./comment_models");
const DetailComplaint = require("./detail_complaint");
const DetailPosting = require("./detail_posting");
const Profile = require("./profile_models");
const Lov = require("./lov_models");

module.exports = {
	User,
	RefreshToken,
	Complaint,
	Comment,
	DetailComplaint,
	DetailPosting,
	Profile,
	Lov,
};
