const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const { generateTasks } = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/generate-tasks",
  authenticateToken,
  generateTasks
);

module.exports = router;