const User = require("./userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, first_name, last_name, gender, dob, password } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      first_name,
      last_name,
      gender,
      dob,
      password: hashedPassword,
      role: "user",
      created_at: new Date(),
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
