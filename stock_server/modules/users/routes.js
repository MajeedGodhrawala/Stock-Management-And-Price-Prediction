const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("./userController.js");
const {
  registerValidationRules,
  validateProfileUpdate,
} = require("./validators.js");
const router = express.Router();

router.post("/register", registerValidationRules, registerUser);
router.post("/login", loginUser);

router.get("/:id", getUserProfile);
router.put("/:id", validateProfileUpdate, updateUserProfile);

module.exports = router;
