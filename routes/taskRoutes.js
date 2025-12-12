// server/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");

router.use(auth); // protect all routes below

router.get("/", getTasks); // GET /api/tasks
router.post("/", createTask); // POST /api/tasks
router.put("/:id", updateTask); // PUT /api/tasks/:id
router.delete("/:id", deleteTask); // DELETE /api/tasks/:id

module.exports = router;
