const users = require("../data/users");

const getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
};

const getUserById = (req, res) => {
  const user = users.find(
    (user) => user.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: "Name, email and role are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};