require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "https://ttaskdaiily.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database not connected:", err));

// Routes
app.use("/api", router);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
