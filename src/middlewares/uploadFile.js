const util = require("util");
const Multer = require("multer");
const maxSize = 3 * 1024 * 1024;
const maxFile = 5;

let processFiles = Multer({
	storage: Multer.memoryStorage(),
	limits: { fileSize: maxSize },
}).array("file", maxFile);

let processFilesMiddleware = util.promisify(processFiles);
module.exports = processFilesMiddleware;
