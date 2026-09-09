# Developer Productivity API

A REST API for managing users, projects, and tasks for the Developer Productivity Dashboard.

## 🚀 Tech Stack

- Node.js
- Express.js
- JavaScript
- CORS
- dotenv
- Nodemon

## 📁 Project Structure

```text
developer-productivity-api/
│
├── src/
│   ├── controllers/
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── data/
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md