import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Projects() {
  const navigate = useNavigate();

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

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");

      setProjects(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        user_id: user.id,
        status: formData.status,
      };

      if (editingProject) {
        await api.put(
          `/projects/${editingProject.id}`,
          payload
        );
      } else {
        await api.post("/projects", payload);
      }

      setFormData({
        name: "",
        description: "",
        status: "active",
      });

      setEditingProject(null);
      setShowForm(false);

      fetchProjects();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save project."
      );
    }
  };

  // Edit
  const handleEdit = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status || "active",
    });

    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      fetchProjects();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);

    setFormData({
      name: "",
      description: "",
      status: "active",
    });
  };

  return (
    <div className="projects-page">

      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your projects and track progress.</p>
        </div>

        <div className="header-actions">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
          >
            + New Project
          </button>
        </div>
      </header>

      {showForm && (
        <div className="project-form-card">
          <h2>
            {editingProject
              ? "Edit Project"
              : "Create New Project"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit">
                {editingProject
                  ? "Update Project"
                  : "Create Project"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          Loading projects...
        </div>
      )}

      {!loading && error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="empty-state">
          <h2>No projects yet</h2>

          <p>
            Create your first project to get started.
          </p>

          <button onClick={() => setShowForm(true)}>
            Create Project
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="projects-grid">

          {projects.map((project) => (
            <div
              className="project-card"
              key={project.id}
            >
              <div className="project-card-header">
                <h2>{project.name}</h2>

                <span className="status-badge">
                  {project.status}
                </span>
              </div>

              <p>
                {project.description ||
                  "No description provided."}
              </p>

              <div className="project-info">
                <span>
                  Owner: {project.owner_name}
                </span>

                <span>
                  Project ID: #{project.id}
                </span>
              </div>

              <div className="project-actions">

                <button
                  onClick={() =>
                    navigate(`/projects/${project.id}`)
                  }
                >
                  View
                </button>

                <button
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(project.id)
                  }
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Projects;