// server/controller/taskController.js

function getTasks(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id; // or req.userId, depending on your auth middleware

  const userTasks = tasks
    .filter((task) => task.owner === userId)
    .sort((a, b) => b.createdAt - a.createdAt); // newest first

  res.json({ tasks: userTasks });
}

function createTask(req, res) {
  const { text, dueDate, priority } = req.body;
  const userId = req.user.id; // adjust if you use req.userId

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Task text required" });
  }

  const { tasks, getNextTaskId, Task } = req.app.locals;

  const newTask = new Task(
    getNextTaskId(),
    userId,
    text.trim(),
    false, // completed defaults to false
    dueDate ? new Date(dueDate) : null,
    priority && ["low", "medium", "high"].includes(priority) ? priority : "low"
  );

  newTask.updatedAt = newTask.createdAt; // initial update timestamp

  tasks.push(newTask);

  res.status(201).json({ task: newTask });
}

function updateTask(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id;
  const { id } = req.params;
  const updates = req.body;

  const taskIndex = tasks.findIndex(
    (task) => task.id === id && task.owner === userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Prevent owner change
  delete updates.owner;
  delete updates._id;
  delete updates.id;

  Object.assign(tasks[taskIndex], updates);
  tasks[taskIndex].updatedAt = new Date();

  res.json({ task: tasks[taskIndex] });
}

function deleteTask(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id;
  const { id } = req.params;

  const taskIndex = tasks.findIndex(
    (task) => task.id === id && task.owner === userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  res.json({ message: "Task deleted" });
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
