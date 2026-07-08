import React, { useState, useEffect } from "react";
import { useProjects } from "../../../hooks/useProjects";

interface IProject {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "on-hold";
}

interface ProjectsViewProps {
  hasPermission: (perm: string) => boolean;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ hasPermission }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<IProject>>({ name: "", description: "", status: "planning" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { getAllProjects, createProject, updateProject, deleteProject } = useProjects();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();
        if (res.success) {
          setProjects(res.data);
        }
      } catch (err) {
        console.warn("Backend API not resolved", err);
      }
    };
    fetchProjects();
  }, [getAllProjects]);

  const handleOpenCreate = () => {
    setCurrentProject({ name: "", description: "", status: "planning" });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (project: IProject) => {
    setCurrentProject(project);
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.warn("Failed deleting project on backend, updating local state", err);
      }
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      try {
        await updateProject(editingId, currentProject);
      } catch (err) {
        console.warn("Failed updating project on backend, updating local state", err);
      }
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...currentProject } as IProject : p));
    } else {
      const newProj = {
        id: String(Date.now()),
        name: currentProject.name || "Untitled Project",
        description: currentProject.description || "",
        status: currentProject.status || "planning"
      } as IProject;
      try {
        const res = await createProject(newProj);
        if (res && res.data) {
          setProjects([...projects, res.data]);
        } else {
          setProjects([...projects, newProj]);
        }
      } catch (err) {
        console.warn("Failed creating project on backend, updating local state", err);
        setProjects([...projects, newProj]);
      }
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex justify-between items-center bg-[#110e1a] p-6 rounded-2xl border border-neutral-800">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-[#08060d] text-white pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 text-sm outline-none focus:border-primary-main"
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {hasPermission("create:projects") ? (
          <button
            onClick={handleOpenCreate}
            className="bg-primary-main text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary-main/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </button>
        ) : (
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            Read-Only Access
          </div>
        )}
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center space-y-4 bg-[#110e1a] border border-neutral-800 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-500">
            <svg className="w-8 h-8 text-primary-main/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-base">No deliverables found</h4>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">Get started by creating your first project deliverables.</p>
          </div>
          {hasPermission("create:projects") && (
            <button
              onClick={handleOpenCreate}
              className="bg-primary-main hover:bg-primary-light text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-primary-main/10"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#110e1a] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors shadow-sm relative group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    project.status === "completed"
                      ? "bg-green-950/40 text-green-400 border-green-900/50"
                      : project.status === "active"
                      ? "bg-blue-950/40 text-blue-400 border-blue-900/50"
                      : project.status === "on-hold"
                      ? "bg-amber-950/40 text-amber-400 border-amber-900/50"
                      : "bg-primary-main/15 text-primary-main border-primary-main/25"
                  }`}>
                    {project.status}
                  </span>

                  {/* Dropdown actions */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasPermission("update:projects") && (
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-1.5 bg-[#1c1926] text-gray-400 hover:text-white rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    {hasPermission("delete:projects") && (
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 bg-red-950/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-primary-main transition-colors">
                  {project.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Team Members mockup */}
              <div className="border-t border-neutral-800/80 pt-4 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Team Allocation</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center font-bold border border-[#110e1a] text-[10px]">A</div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center font-bold border border-[#110e1a] text-[10px]">M</div>
                  <div className="w-6 h-6 rounded-full bg-primary-main text-secondary-dark flex items-center justify-center font-bold border border-[#110e1a] text-[10px]">E</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#110e1a] border border-neutral-800 rounded-2xl p-8 relative">
            <h3 className="text-xl font-black text-white tracking-tight mb-6">
              {editingId ? "Modify Deliverable" : "Launch Project"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  value={currentProject.name}
                  onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                  placeholder="e.g. Sales Pipeline Integration"
                  required
                  className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Describe project scopes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                <select
                  value={currentProject.status}
                  onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/3 py-3 rounded-lg border border-neutral-800 bg-transparent text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-lg border-none bg-primary-main hover:bg-primary-light text-secondary-dark font-black text-sm uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
