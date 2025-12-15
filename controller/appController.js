// server/controller/appController.js

const jwt = require("jsonwebtoken");
const authSchema = require("../validator/validator");
const { hashPassword, comparePassword } = require("../utility/hash");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "7d";

function validateInput(req) {
  const { error, value } = authSchema.validate(req.body, { abortEarly: false });
  return { error, value };
}

// REGISTER - async with proper await
exports.register = async (req, res) => {
  const { error, value } = validateInput(req);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message),
    });
  }

  const { email, password } = value;
  const { users, getNextUserId, User } = req.app.locals;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = users.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  try {
    const passwordHash = await hashPassword(password); // ← awaited

    const newUser = new User(
      getNextUserId(),
      value.name || "",
      normalizedEmail,
      passwordHash
    );
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: "User registered",
      email: newUser.email,
    });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

// LOGIN - async with proper await and try/catch
exports.login = async (req, res) => {
  const { error, value } = validateInput(req);

  if (error) {
    return res.status(400).json({
      errors: error.details.map((d) => d.message),
    });
  }

  const { email, password } = value;
  const { users } = req.app.locals;

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  try {
    const match = await comparePassword(password, user.password); // ← awaited!

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Login successful",
      token,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { register: exports.register, login: exports.login };
