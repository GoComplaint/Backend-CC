const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const complaintRouter = require("./complaint");

router.use("/auth", authRouter);
router.use("/main", complaintRouter);

module.exports = router;
