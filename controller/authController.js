

// server/controller/appController.js (or authController.js)

const authSchema = require("../validator/validator");
const { hashPassword } = require("../utility/hash");

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
  const { users, getNextUserId, User } = req.app.locals;

  const normalizedEmail = email.toLowerCase();

  // Check if user already exists
  const existingUser = users.find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  try {
    // ← This is async! Must await
    const passwordHash = await hashPassword(password);

    const newUser = new User(
      getNextUserId(),
      value.name || "",           // optional name field
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
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};