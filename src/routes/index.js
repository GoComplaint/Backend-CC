const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const mainRouter = require("./main");
const utilRouter = require("./util");

router.use("/auth", authRouter);
router.use("/main", mainRouter);
router.use("/util", utilRouter);

module.exports = router;
