const projects = require("../data/projects");

const getProjects = (req, res) => {
  res.status(200).json({
    success: true,
    data: projects,
  });
};

const getProjectById = (req, res) => {
  const project = projects.find(
    (project) => project.id === Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  res.status(200).json({
    success: true,
    data: project,
  });
};

const createProject = (req, res) => {
  const { name, description, status, userId } = req.body;

  if (!name || !description || !status || !userId) {
    return res.status(400).json({
      success: false,
      message: "Name, description, status and userId are required",
    });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    description,
    status,
    progress: 0,
    userId: Number(userId),
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: newProject,
  });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
};