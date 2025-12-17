// server/controller/taskController.js

function getTasks(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id;

  const userTasks = tasks
    .filter((task) => task.owner === userId)
    .sort((a, b) => b.createdAt - a.createdAt); // newest first

  res.json({ tasks: userTasks });
}

function createTask(req, res) {
  const { text, dueDate, priority } = req.body;
  const userId = req.user.id;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Task text required" });
  }

  const { tasks, getNextTaskId, Task } = req.app.locals;

  const newTask = new Task(
    getNextTaskId(),
    userId,
    text.trim(),
    false,
    dueDate ? new Date(dueDate) : null,
    priority && ["low", "medium", "high"].includes(priority) ? priority : "low"
  );

  newTask.updatedAt = newTask.createdAt;

  tasks.push(newTask);

  res.status(201).json({ task: newTask });
}

function updateTask(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id;
  const taskId = Number(req.params.id); // ← FIXED: Convert string to number

  const taskIndex = tasks.findIndex(
    (task) => task.id === taskId && task.owner === userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updates = req.body;
  delete updates.owner;
  delete updates.id;

  Object.assign(tasks[taskIndex], updates);
  tasks[taskIndex].updatedAt = new Date();

  res.json({ task: tasks[taskIndex] });
}

function deleteTask(req, res) {
  const { tasks } = req.app.locals;
  const userId = req.user.id;
  const taskId = Number(req.params.id); // ← FIXED: Convert string to number

  const taskIndex = tasks.findIndex(
    (task) => task.id === taskId && task.owner === userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  res.json({ message: "Task deleted" });
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
