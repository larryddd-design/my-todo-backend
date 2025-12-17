// models/Task.js
class Task {
  constructor(
    id,
    owner,
    text,
    completed = false,
    dueDate = null,
    priority = "low"
  ) {
    this.id = Number(id); // ← Force ID to be a number
    this.owner = owner; // userId (from req.user.id)
    this.text = text.trim();
    this.completed = !!completed; // Ensure boolean
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.priority = ["low", "medium", "high"].includes(priority)
      ? priority
      : "low";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = Task;
