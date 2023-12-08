const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const complaintRouter = require("./complaint");
const utilRouter = require("./util");

router.use("/auth", authRouter);
router.use("/main", complaintRouter);
router.use("/util", utilRouter);

module.exports = router;
