const auth = require("./authController");
const complaint = require("./complaintController");
const comment = require("./commentController");
const history = require("./historyController");
const util = require("./utilController");

module.exports = { auth, complaint, comment, history, util };
