const express = require("express");
const amazonRoute = require("./amazon.route");
const emailRoute = require("./email.route");

const router = express.Router();

router.use("/amazon", amazonRoute);
router.use("/email", emailRoute);

module.exports = router;
