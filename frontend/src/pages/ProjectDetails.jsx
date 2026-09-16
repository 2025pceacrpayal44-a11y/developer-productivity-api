import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectResponse, tasksResponse] =
        await Promise.all([
          api.get(`/projects/${id}`),
          api.get("/tasks"),
        ]);

      setProject(projectResponse.data.data);

      const allTasks = tasksResponse.data.data || [];

      const projectTasks = allTasks.filter(
        (task) => Number(task.project_id) === Number(id)
      );

      setTasks(projectTasks);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load project details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
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
            className="sidebar-button active"
            onClick={() => navigate("/projects")}
          >
            📁 <span>Projects</span>
          </button>

          <button
            className="sidebar-button"
            onClick={() => navigate("/tasks")}
          >
            ✅ <span>Tasks</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* HEADER */}
        <div className="dashboard-header">

          <div>
            <h1>Project Details</h1>

            <p>
              View project information and track related tasks.
            </p>
          </div>

          <div className="user-profile">
            👤 <strong>{user?.name}</strong>
            <span> · {user?.role}</span>
          </div>

        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/projects")}
          style={{ marginBottom: "20px" }}
        >
          ← Back to Projects
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="dashboard-card">
            <p>Loading project details...</p>
          </div>
        ) : !project ? (
          <div className="dashboard-card">
            <h2>Project Not Found</h2>
            <p>
              The requested project could not be found.
            </p>
          </div>
        ) : (
          <>

            {/* PROJECT INFORMATION */}
            <div className="dashboard-card">

              <div className="dashboard-card-header">
                <h2>📁 {project.name}</h2>

                <span className="project-status">
                  {project.status}
                </span>
              </div>

              <p>
                <strong>Description</strong>
              </p>

              <p>
                {project.description ||
                  "No description provided."}
              </p>

              <p>
                <strong>Owner:</strong>{" "}
                {project.owner_name || "N/A"}
              </p>

              <p>
                <strong>Project ID:</strong> #{project.id}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {project.created_at
                  ? new Date(
                      project.created_at
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

            {/* TASK STATISTICS */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>Total Tasks</h3>
                  <span>📋</span>
                </div>

                <h2>{tasks.length}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>Completed</h3>
                  <span>✓</span>
                </div>

                <h2>{completedTasks}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>In Progress</h3>
                  <span>◔</span>
                </div>

                <h2>{inProgressTasks}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>Pending</h3>
                  <span>⏳</span>
                </div>

                <h2>{pendingTasks}</h2>
              </div>

            </div>

            {/* TASK LIST */}
            <div className="dashboard-card">

              <div className="dashboard-card-header">
                <h2>📋 Project Tasks</h2>

                <button
                  onClick={() => navigate("/tasks")}
                >
                  + Manage Tasks
                </button>
              </div>

              {tasks.length === 0 ? (
                <p>
                  No tasks have been created for this project yet.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        alignItems: "flex-start",
                      }}
                    >

                      <div>
                        <h3>{task.title}</h3>

                        <p>
                          {task.description ||
                            "No description provided."}
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
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status === "completed"
                            ? "Completed"
                            : "Pending"}
                        </strong>

                        <br />

                        <span>
                          Priority: {task.priority}
                        </span>
                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </>
        )}

      </main>
    </div>
  );
}

export default ProjectDetails;