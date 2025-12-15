const User = require("../models/user");
const Task = require("../models/Task");

let users = []; // Array of User instances
let tasks = []; // Array of Task instances

let userIdCounter = 1;
let taskIdCounter = 1;

// Helper functions (optional export if needed elsewhere)
const getNextUserId = () => userIdCounter++;
const getNextTaskId = () => taskIdCounter++;

module.exports = {
  users,
  tasks,
  getNextUserId,
  getNextTaskId,
  User,
  Task,
};
