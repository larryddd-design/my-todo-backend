// server/controller/appController.js
const jwt = require("jsonwebtoken");
const authSchema = require("../validator/validator");
const { hashPassword, comparePassword } = require("../utility/hash");
const { findUserByEmail, createUser } = require("../validator/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "7d";

function validateInput(req) {
  const { error, value } = authSchema.validate(req.body, { abortEarly: false });
  return { error, value };
}

exports.register = async (req, res) => {
  const { error, value } = validateInput(req);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message),
    });
  }

  const { email, password } = value;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash);

    res
      .status(201)
      .json({ success: true, message: "User registered", email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { error, value } = authSchema.validate(req.body, { abortEarly: false });
  if (error)
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });

  const { email, password } = value;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await comparePassword(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    // Create JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ message: "Login successful", token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
