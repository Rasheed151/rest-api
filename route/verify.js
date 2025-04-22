const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/verify-email", userController.verifyEmail);

module.exports = router;
