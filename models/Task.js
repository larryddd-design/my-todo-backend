// models/Task.js (Recommended simple version)
class Task {
  constructor(
    id,
    owner,
    text,
    completed = false,
    dueDate = null,
    priority = "low"
  ) {
    this.id = id; // string or number
    this.owner = owner; // userId
    this.text = text;
    this.completed = completed;
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.priority = priority; // "low", "medium", "high"
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = Task;
