const auth = require("./authController");
const complaint = require("./complaintController");
const comment = require("./commentController");
const history = require("./historyController");
const util = require("./utilController");
const analysis = require("./analysisController");

module.exports = { auth, complaint, comment, history, util, analysis };
