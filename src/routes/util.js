const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router.get("/lov/:category", controllers.util.getLov);

module.exports = router;
