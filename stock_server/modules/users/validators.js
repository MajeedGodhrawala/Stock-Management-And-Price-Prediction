const { body, validationResult } = require("express-validator");
const User = require("./userModel.js");

const registerValidationRules = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) throw new Error("Username already exists");
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) throw new Error("Email already exists");
      return true;
    }),

  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("gender").isIn(["0", "1"]).withMessage("Invalid gender value"),
  body("dob").notEmpty().withMessage("Date of birth is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const validateProfileUpdate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 to 20 characters"),
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  body("gender").isIn(["0", "1"]).withMessage("Invalid gender selection"),
  body("dob").trim().notEmpty().withMessage("Date of birth is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { registerValidationRules, validateProfileUpdate };
