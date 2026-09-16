import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Projects() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      setProjects(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // OPEN NEW PROJECT FORM
  const openCreateForm = () => {
    setEditingProject(null);

    setFormData({
      name: "",
      description: "",
      status: "active",
    });

    setShowForm(true);
  };

  // OPEN EDIT FORM
  const openEditForm = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
    });

    setShowForm(true);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!user) {
        setError("Please login again.");
        return;
      }

      const projectData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        user_id: user.id,
      };

      if (editingProject) {
        await api.put(
          `/projects/${editingProject.id}`,
          projectData
        );
      } else {
        await api.post("/projects", projectData);
      }

      setShowForm(false);
      setEditingProject(null);

      setFormData({
        name: "",
        description: "",
        status: "active",
      });

      await fetchProjects();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save project"
      );
    }
  };

  // DELETE
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/projects/${projectId}`);

      await fetchProjects();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed"
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

          <button className="sidebar-button active">
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

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <div className="dashboard-header">

          <div>
            <h1>Projects</h1>

            <p>
              Create and manage your development projects.
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

        {/* PROJECT STATS */}
        <div
          className="stats-grid"
          style={{
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
          }}
        >

          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Total Projects</h3>
              <span>📁</span>
            </div>

            <h2>{projects.length}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Active</h3>
              <span>🚀</span>
            </div>

            <h2>{activeProjects}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Completed</h3>
              <span>✓</span>
            </div>

            <h2>{completedProjects}</h2>
          </div>

        </div>

        {/* CREATE PROJECT BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <button onClick={openCreateForm}>
            ➕ New Project
          </button>
        </div>

        {/* CREATE / EDIT FORM */}
        {showForm && (
          <div className="dashboard-card">

            <div className="dashboard-card-header">
              <h2>
                {editingProject
                  ? "✏️ Edit Project"
                  : "➕ Create New Project"}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="project-form-grid">

                <div>
                  <label>
                    <strong>Project Name</strong>
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    <option value="active">
                      Active
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="on-hold">
                      On Hold
                    </option>
                  </select>
                </div>

                <div className="full-width">
                  <label>
                    <strong>Description</strong>
                  </label>

                  <textarea
                    name="description"
                    placeholder="Describe your project..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

              </div>

              <br />

              <button type="submit">
                {editingProject
                  ? "Save Changes"
                  : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                style={{
                  marginLeft: "10px",
                  background: "#667085",
                }}
              >
                Cancel
              </button>

            </form>

          </div>
        )}

        {/* PROJECT LIST */}
        <div
          className="dashboard-card"
          style={{ marginTop: "20px" }}
        >

          <div className="dashboard-card-header">
            <h2>📁 Your Projects</h2>

            <strong>
              {projects.length} projects
            </strong>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>
              No projects yet. Create your first project.
            </p>
          ) : (
            <div className="projects-grid">

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                >

                  <div className="project-card-top">

                    <div>
                      <h3>{project.name}</h3>

                      <span className="project-status">
                        {project.status}
                      </span>
                    </div>

                    <span className="project-icon">
                      📁
                    </span>

                  </div>

                  <p className="project-description">
                    {project.description ||
                      "No description provided."}
                  </p>

                  <p>
                    <strong>Owner:</strong>{" "}
                    {project.owner_name ||
                      user?.name}
                  </p>

                  <div className="project-actions">

                    <button
                      onClick={() =>
                        navigate(
                          `/projects/${project.id}`
                        )
                      }
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        openEditForm(project)
                      }
                      className="secondary-button"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(project.id)
                      }
                      className="danger-button"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Projects;