import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
      ]);

      setProjects(projectsResponse.data.data || []);
      setTasks(tasksResponse.data.data || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const totalTasks = tasks.length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

          <button className="sidebar-button active">
            📊 <span>Dashboard</span>
          </button>

          <button
            className="sidebar-button"
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
            <h1>Dashboard</h1>
            <p>
              Here's what's happening with your projects today.
            </p>
          </div>

          <div className="user-profile">
            👤 <strong>{user?.name}</strong>
            <span> · {user?.role}</span>
          </div>

        </div>

        {loading ? (
          <div className="dashboard-card">
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>

            {/* WELCOME */}
            <div className="welcome-card">
              <h2>
                Welcome back, {user?.name} 👋
              </h2>

              <p>
                Manage your projects, track tasks and improve
                your productivity from one place.
              </p>
            </div>

            {/* STATISTICS */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>Total Projects</h3>
                  <span>📁</span>
                </div>

                <h2>{projects.length}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <h3>Total Tasks</h3>
                  <span>📋</span>
                </div>

                <h2>{totalTasks}</h2>
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

            </div>

            {/* CONTENT */}
            <div className="dashboard-grid">

              {/* LEFT */}
              <div className="dashboard-card">

                <div className="dashboard-card-header">
                  <h2>Task Progress</h2>

                  <strong>
                    {completionPercentage}%
                  </strong>
                </div>

                <div className="progress-container">

                  <div className="progress-label">
                    <span>Overall completion</span>
                    <span>
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="progress-container">

                  <div className="progress-label">
                    <span>Completed</span>
                    <strong>{completedTasks}</strong>
                  </div>

                </div>

                <div className="progress-container">

                  <div className="progress-label">
                    <span>In Progress</span>
                    <strong>{inProgressTasks}</strong>
                  </div>

                </div>

                <div className="progress-container">

                  <div className="progress-label">
                    <span>Pending</span>
                    <strong>{pendingTasks}</strong>
                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="dashboard-card">

                <div className="dashboard-card-header">
                  <h2>Quick Actions</h2>
                </div>

                <div className="quick-actions">

                  <button
                    className="action-button"
                    onClick={() => navigate("/projects")}
                  >
                    📁 Manage Projects
                  </button>

                  <button
                    className="action-button"
                    onClick={() => navigate("/tasks")}
                  >
                    ✅ Manage Tasks
                  </button>

                  <button
                    className="action-button"
                    onClick={() => navigate("/tasks")}
                  >
                    ✨ Generate AI Tasks
                  </button>

                </div>

              </div>

            </div>

            {/* RECENT ACTIVITY */}
            <div
              className="dashboard-card"
              style={{ marginTop: "20px" }}
            >

              <div className="dashboard-card-header">
                <h2>Recent Tasks</h2>

                <button
                  onClick={() => navigate("/tasks")}
                >
                  View All
                </button>
              </div>

              {tasks.length === 0 ? (
                <p>
                  No tasks available yet. Create your first task!
                </p>
              ) : (
                tasks
                  .slice(-5)
                  .reverse()
                  .map((task) => (
                    <div
                      key={task.id}
                      className="recent-task"
                    >
                      <h4>{task.title}</h4>

                      <p>
                        Status: {task.status} · Priority:{" "}
                        {task.priority}
                      </p>
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

export default Dashboard;