const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", authenticateToken, getTasks);
router.get("/:id", authenticateToken, getTaskById);
router.post("/", authenticateToken, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;