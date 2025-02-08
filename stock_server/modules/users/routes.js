const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} = require("./userController.js");
const {
  registerValidationRules,
  validateProfileUpdate,
} = require("./validators.js");
const protect = require("../../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/register", registerValidationRules, registerUser);
router.post("/login", loginUser);

router.get("/", protect, getAllUsers);

router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, validateProfileUpdate, updateUserProfile);

router.delete("/:id", protect, deleteUser);

module.exports = router;
