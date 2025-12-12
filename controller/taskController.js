// server/controller/taskController.js
const Task = require("../models/Task");

async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ owner: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createTask(req, res) {
  try {
    const { text, dueDate, priority } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ error: "Task text required" });

    const task = new Task({
      owner: req.userId,
      text: text.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || "low",
    });

    await task.save();
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });

    Object.assign(task, updates);
    await task.save();
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
