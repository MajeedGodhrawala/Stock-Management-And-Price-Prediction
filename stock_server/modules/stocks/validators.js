const { body, validationResult } = require("express-validator");

const stockValidationRules = [
  body("name").notEmpty().withMessage("Stock name is required"),
  body("short_name").notEmpty().withMessage("Short name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { stockValidationRules };
