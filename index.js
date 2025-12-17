// server.js or index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ===== IMPORT YOUR IN-MEMORY STORE ONCE =====
const {
  users,
  tasks,
  User,
  Task,
  getNextUserId,
  getNextTaskId,
} = require("./data/store"); // ← Adjust path if needed

// ===== ATTACH TO app.locals =====
app.locals.users = users;
app.locals.tasks = tasks;
app.locals.User = User;
app.locals.Task = Task;
app.locals.getNextUserId = getNextUserId;
app.locals.getNextTaskId = getNextTaskId;

// Middleware
app.use(express.json({ limit: "10mb" }));

// CORS fix for local development
const allowedOrigins = [
  "https://ttaskdaiily.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
const authRouter = require("./routes/authRoutes"); // or however you import
const taskRouter = require("./routes/taskRoutes");

app.use("/api", authRouter);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
