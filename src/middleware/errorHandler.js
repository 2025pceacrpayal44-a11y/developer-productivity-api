const errorHandler = (err, req, res, next) => {
  console.error(err);

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
  }

  // MySQL foreign key error
  if (
    err.code === "ER_NO_REFERENCED_ROW_2" ||
    err.code === "ER_ROW_IS_REFERENCED_2"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid user or project reference",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorHandler;