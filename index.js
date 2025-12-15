// server.js or index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Import the store ONCE
const {
  users,
  tasks,
  User,
  Task,
  getNextUserId,
  getNextTaskId,
} = require("./data/store"); // ← Only once!

// Attach to app.locals (also only once)
app.locals.users = users;
app.locals.tasks = tasks;
app.locals.User = User;
app.locals.Task = Task;
app.locals.getNextUserId = getNextUserId;
app.locals.getNextTaskId = getNextTaskId;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "https://ttaskdaiily.netlify.app",
    credentials: true,
  })
);

// Routes
const router = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");

app.use("/api", router);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
