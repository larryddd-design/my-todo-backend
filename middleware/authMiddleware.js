// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// In production use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Missing authorization header" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "Malformed authorization header" });

  const token = parts[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id; // attach user id
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
