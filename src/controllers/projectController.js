const db = require("../db");

// GET all projects
const getProjects = async (req, res, next) => {
  try {
    const [projects] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.user_id,
        u.name AS owner_name,
        p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id
    `);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// GET project by ID
const getProjectById = async (req, res, next) => {
  try {
    const [projects] = await db.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.user_id,
        u.name AS owner_name,
        p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      `,
      [req.params.id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: projects[0],
    });
  } catch (error) {
    next(error);
  }
};

// CREATE project
const createProject = async (req, res, next) => {
  try {
    const { name, description, user_id, status } = req.body;

    if (!name || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Name and user_id are required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO projects 
      (name, description, user_id, status)
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        description || null,
        user_id,
        status || "active",
      ]
    );

    const [projects] = await db.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.user_id,
        u.name AS owner_name,
        p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: projects[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE project
const updateProject = async (req, res, next) => {
  try {
    const { name, description, user_id, status } = req.body;

    if (!name || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Name and user_id are required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE projects
      SET name = ?, description = ?, user_id = ?, status = ?
      WHERE id = ?
      `,
      [
        name,
        description || null,
        user_id,
        status || "active",
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const [projects] = await db.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.user_id,
        u.name AS owner_name,
        p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: projects[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE project
const deleteProject = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "DELETE FROM projects WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};