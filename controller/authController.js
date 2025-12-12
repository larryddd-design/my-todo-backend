const authSchema = require("../validator/validator");
const { hashPassword } = require("../utility/hash");
const { findUserByEmail, createUser } = require("../validator/user");

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
    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in DB
    const user = await createUser(email, passwordHash);

    res.status(201).json({
      success: true,
      message: "User registered",
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
