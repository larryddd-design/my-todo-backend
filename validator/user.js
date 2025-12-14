const User = require("../models/user");

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function createUser(email, passwordHash) {
  const user = new User({ email, passwordHash });
  return await user.save();
}

module.exports = { findUserByEmail, createUser };
