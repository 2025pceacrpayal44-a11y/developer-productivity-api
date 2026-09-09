const tasks = require("../data/tasks");

const validStatuses = ["todo", "in-progress", "done"];

const getTasks = (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks,
  });
};

const getTaskById = (req, res) => {
  const task = tasks.find(
    (task) => task.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
};

const createTask = (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    projectId,
    userId,
  } = req.body;

  if (!title || !description || !status || !priority || !projectId || !userId) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, status, priority, projectId and userId are required",
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be todo, in-progress or done",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    status,
    priority,
    projectId: Number(projectId),
    userId: Number(userId),
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask,
  });
};

const updateTask = (req, res) => {
  const task = tasks.find(
    (task) => task.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const {
    title,
    description,
    status,
    priority,
    projectId,
    userId,
  } = req.body;

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be todo, in-progress or done",
    });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (projectId !== undefined) task.projectId = Number(projectId);
  if (userId !== undefined) task.userId = Number(userId);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
};

const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex(
    (task) => task.id === Number(req.params.id)
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask[0],
  });
};

const updateTaskStatus = (req, res) => {
  const task = tasks.find(
    (task) => task.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { status } = req.body;

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be todo, in-progress or done",
    });
  }

  task.status = status;

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    data: task,
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};