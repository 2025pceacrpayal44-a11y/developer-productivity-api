const db = require("../db");

// GET all tasks
const getTasks = async (req, res, next) => {
  try {
    const [tasks] = await db.query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.project_id,
        p.name AS project_name,
        t.user_id,
        u.name AS assigned_to,
        t.due_date,
        t.created_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.user_id = u.id
      ORDER BY t.id
    `);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET task by ID
const getTaskById = async (req, res, next) => {
  try {
    const [tasks] = await db.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.project_id,
        p.name AS project_name,
        t.user_id,
        u.name AS assigned_to,
        t.due_date,
        t.created_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
      `,
      [req.params.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tasks[0],
    });
  } catch (error) {
    next(error);
  }
};

// CREATE task
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      project_id,
      user_id,
      due_date,
    } = req.body;

    if (!title || !project_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Title, project_id and user_id are required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO tasks
      (title, description, status, priority, project_id, user_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description || null,
        status || "todo",
        priority || "medium",
        project_id,
        user_id,
        due_date || null,
      ]
    );

    const [tasks] = await db.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.project_id,
        p.name AS project_name,
        t.user_id,
        u.name AS assigned_to,
        t.due_date,
        t.created_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: tasks[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE task
const updateTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      project_id,
      user_id,
      due_date,
    } = req.body;

    if (!title || !project_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Title, project_id and user_id are required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        status = ?,
        priority = ?,
        project_id = ?,
        user_id = ?,
        due_date = ?
      WHERE id = ?
      `,
      [
        title,
        description || null,
        status || "todo",
        priority || "medium",
        project_id,
        user_id,
        due_date || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const [tasks] = await db.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.project_id,
        p.name AS project_name,
        t.user_id,
        u.name AS assigned_to,
        t.due_date,
        t.created_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: tasks[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE task status
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be todo, in-progress or done",
      });
    }

    const [result] = await db.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const [tasks] = await db.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.project_id,
        p.name AS project_name,
        t.user_id,
        u.name AS assigned_to,
        t.due_date,
        t.created_at
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: tasks[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE task
const deleteTask = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};