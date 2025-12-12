const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/authRoutes");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/apply")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database not connected:", err));

// Routes
app.use("/api", router);

const taskRouter = require("./routes/taskRoutes");
app.use("/api/tasks", taskRouter);


app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start server
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
