// server/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
