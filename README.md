<<<<<<< HEAD
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

## Task 3 – Database Integration

The Developer Productivity API is integrated with MySQL for persistent data storage.

### Database

- MySQL
- Database: `developer_productivity`

### Tables

- `users`
- `projects`
- `tasks`

### Relationships

- Users → Projects
- Projects → Tasks
- Users → Tasks

### Database Features

- Primary keys
- Foreign keys
- Unique email validation
- ENUM validation for task status and priority
- Cascading deletes
- Persistent CRUD operations
- Environment-based database configuration

### API Testing

Tested:

- GET users
- GET projects
- GET tasks
- GET task by ID
- POST task
- PUT task
- PATCH task status
- DELETE task
- Invalid foreign-key validation
- Database error handling