import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create task
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // AI
  const [aiDescription, setAiDescription] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProjectId, setAiProjectId] = useState("");

  // =========================
  // FETCH DATA
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [tasksResponse, projectsResponse] =
        await Promise.all([
          api.get("/tasks"),
          api.get("/projects"),
        ]);

      setTasks(tasksResponse.data.data || []);
      setProjects(projectsResponse.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load tasks or projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      if (!user) {
        setError("Please login again.");
        return;
      }

      if (!formData.project_id) {
        setError("Please select a project.");
        return;
      }

      await api.post("/tasks", {
        title: formData.title,
        description: formData.description,
        project_id: Number(formData.project_id),
        user_id: user.id,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      });

      setFormData({
        title: "",
        description: "",
        project_id: "",
        status: "pending",
        priority: "medium",
        due_date: "",
      });

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  // =========================
  // CHANGE STATUS
  // =========================

  const handleStatusChange = async (task) => {
    try {
      setError("");

      const nextStatus =
        task.status === "completed"
          ? "pending"
          : task.status === "pending"
          ? "in-progress"
          : "completed";

      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        project_id: task.project_id,
        user_id: task.user_id,
        status: nextStatus,
        priority: task.priority,
        due_date: task.due_date,
      });

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/tasks/${taskId}`);

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // =========================
  // AI GENERATOR
  // =========================

  const generateAITasks = async () => {
    if (!aiDescription.trim()) {
      setError("Please enter a project description.");
      return;
    }

    try {
      setError("");
      setAiLoading(true);

      const response = await api.post(
        "/ai/generate-tasks",
        {
          projectDescription: aiDescription,
        }
      );

      setAiTasks(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to generate AI tasks"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // SAVE AI TASK
  // =========================

  const saveAITask = async (task) => {
    try {
      setError("");

      if (!aiProjectId) {
        setError("Please select a project first.");
        return;
      }

      await api.post("/tasks", {
        title: task.title,
        description: task.description,
        project_id: Number(aiProjectId),
        user_id: user.id,
        status: "pending",
        priority: task.priority,
        due_date: null,
      });

      await fetchData();

      alert("AI task added successfully!");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save AI task"
      );
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = (status) => {
    if (status === "in-progress") return "In Progress";

    if (status === "completed") return "Completed";

    return "Pending";
  };

  return (
    <div className="dashboard-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>
            Dev<span>Flow</span>
          </h2>
        </div>

        <nav className="sidebar-menu">

          <button
            className="sidebar-button"
            onClick={() => navigate("/dashboard")}
          >
            📊 <span>Dashboard</span>
          </button>

          <button
            className="sidebar-button"
            onClick={() => navigate("/projects")}
          >
            📁 <span>Projects</span>
          </button>

          <button className="sidebar-button active">
            ✅ <span>Tasks</span>
          </button>

        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <h1>Tasks</h1>

            <p>
              Create, organize and track your project tasks.
            </p>
          </div>

          <div className="user-profile">
            👤 <strong>{user?.name}</strong>
            <span> · {user?.role}</span>
          </div>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =========================
            CREATE TASK
        ========================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <h2>➕ Create New Task</h2>
          </div>

          {projects.length === 0 ? (
            <div>
              <p>
                You don't have any projects yet.
                Create a project before creating a task.
              </p>

              <button
                onClick={() => navigate("/projects")}
              >
                📁 Create Project
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

             <div className="task-form-grid"> 
                <div>
                  <label>
                    <strong>Task Title</strong>
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>
                    <strong>Project</strong>
                  </label>

                  <select
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Project
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className ="full-width">
                  <label>
                    <strong>Description</strong>
                  </label>

                  <textarea
                    name="description"
                    placeholder="Describe the task..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div>
                  <label>
                    <strong>Status</strong>
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div>
                  <label>
                    <strong>Priority</strong>
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>
                </div>

                <div>
                  <label>
                    <strong>Due Date</strong>
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <br />

              <button type="submit">
                Create Task
              </button>

            </form>
          )}

        </div>

        {/* =========================
            AI GENERATOR
        ========================= */}

        <div className="ai-section">

          <div className="dashboard-card-header">
            <h2>✨ AI Task Generator</h2>
          </div>

          <p>
            Describe your project and let AI generate
            actionable development tasks.
          </p>

          <select
            value={aiProjectId}
            onChange={(e) =>
              setAiProjectId(e.target.value)
            }
          >
            <option value="">
              Select Project for AI Tasks
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <textarea
            placeholder="Example: Build an e-commerce website using React, Node.js and MySQL..."
            value={aiDescription}
            onChange={(e) =>
              setAiDescription(e.target.value)
            }
            rows="5"
          />

          <br />
          <br />

          <button
            onClick={generateAITasks}
            disabled={aiLoading}
          >
            {aiLoading
              ? "🤖 Generating..."
              : "✨ Generate Tasks with AI"}
          </button>

          {aiTasks.length > 0 && (
            <div style={{ marginTop: "25px" }}>

              <h3>AI Generated Tasks</h3>

              {aiTasks.map((task, index) => (
                <div
                  key={index}
                  className="ai-task"
                >

                  <h3>{task.title}</h3>

                  <p>
                    {task.description}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}
                    {task.priority}
                  </p>

                  <button
                    onClick={() =>
                      saveAITask(task)
                    }
                  >
                    ➕ Add to Tasks
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* =========================
            TASK LIST
        ========================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <h2>📋 All Tasks</h2>

            <strong>
              {filteredTasks.length} tasks
            </strong>
          </div>

          {/* FILTERS */}

          <div className="filters">

            <input
              type="text"
              placeholder="🔎 Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="all">
                All Priorities
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear
            </button>

          </div>

          {/* TASKS */}

          {loading ? (
            <p>Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p>
              No tasks match your current filters.
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >

                  <div>
                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.description ||
                        "No description provided."}
                    </p>

                    <p>
                      📁 Project:{" "}
                      <strong>
                        {task.project_name ||
                          `#${task.project_id}`}
                      </strong>
                    </p>

                    <p>
                      📅 Due:{" "}
                      <strong>
                        {task.due_date ||
                          "Not specified"}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <strong>
                      {getStatusLabel(task.status)}
                    </strong>

                    <br />

                    <span>
                      Priority: {task.priority}
                    </span>
                  </div>

                </div>

                <br />

                <button
                  onClick={() =>
                    handleStatusChange(task)
                  }
                >
                  🔄 Change Status
                </button>

                <button
                  onClick={() =>
                    handleDelete(task.id)
                  }
                  style={{
                    marginLeft: "10px",
                    background: "#dc3545",
                  }}
                >
                  🗑 Delete
                </button>

              </div>
            ))
          )}

        </div>

      </main>
    </div>
  );
}

export default Tasks;