const express = require("express");
const { registerUser, loginUser } = require("./userController.js");
const registerValidationRules = require("./validators.js");
const router = express.Router();

router.post("/register", registerValidationRules, registerUser);
router.post("/login", loginUser);

module.exports = router;
