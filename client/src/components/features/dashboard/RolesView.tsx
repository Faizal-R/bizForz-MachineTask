import React, { useState, useEffect } from "react";
import { useRoles } from "../../../hooks/useRoles";

interface IRoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolesViewProps {
  hasPermission: (perm: string) => boolean;
}

const AVAILABLE_PERMISSIONS = [
  "create:projects", "read:projects", "update:projects", "delete:projects",
  "create:users", "read:users", "update:users", "delete:users",
  "create:roles", "read:roles", "update:roles", "delete:roles",
  "read:permissions"
];

const isReservedAdminRoleName = (roleName: string) => roleName.trim().toLowerCase() === "admin";
const isReservedAdminRole = (role: IRoleRecord) => isReservedAdminRoleName(role.name);

const RolesView: React.FC<RolesViewProps> = ({ hasPermission }) => {
  const [roles, setRoles] = useState<IRoleRecord[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<IRoleRecord | null>(null);
  const [formState, setFormState] = useState({ name: "", description: "", permissions: [] as string[] });
  const { getAllRoles, createRole, updateRole, deleteRole } = useRoles();
  const visibleRoles = roles.filter((role) => !isReservedAdminRole(role));

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRoles();
        if (res && res.data) {
          setRoles(res.data);
        }
      } catch (err) {
        console.warn("Backend API not resolved", err);
      }
    };
    fetchRoles();
  }, [getAllRoles]);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormState({ name: "", description: "", permissions: [] });
    setShowModal(true);
  };

  const handleOpenEdit = (role: IRoleRecord) => {
    if (isReservedAdminRole(role)) return;
    setEditingRole(role);
    setFormState({ name: role.name, description: role.description, permissions: [...role.permissions] });
    setShowModal(true);
  };

  const handleTogglePermission = (perm: string) => {
    const updated = formState.permissions.includes(perm)
      ? formState.permissions.filter(p => p !== perm)
      : [...formState.permissions, perm];
    setFormState({ ...formState, permissions: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReservedAdminRoleName(formState.name)) {
      return;
    }
    if (editingRole) {
      try {
        await updateRole(editingRole.id, {
          name: formState.name,
          description: formState.description,
          permissions: formState.permissions,
        });
      } catch (err) {
        console.warn("Failed updating role on backend, updating local state", err);
      }
      const updated = roles.map(r =>
        r.id === editingRole.id
          ? { ...r, name: formState.name, description: formState.description, permissions: formState.permissions }
          : r
      );
      setRoles(updated);
    } else {
      const newRole: IRoleRecord = {
        id: String(Date.now()),
        name: formState.name,
        description: formState.description,
        permissions: formState.permissions
      };
      try {
        const res = await createRole(newRole);
        if (res && res.data) {
          setRoles([...roles, res.data]);
        } else {
          setRoles([...roles, newRole]);
        }
      } catch (err) {
        console.warn("Failed creating role on backend, updating local state", err);
        setRoles([...roles, newRole]);
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this role? Any users with this role will lose their default permissions.")) {
      try {
        await deleteRole(id);
      } catch (err) {
        console.warn("Failed deleting role on backend, updating local state", err);
      }
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-[#110e1a] p-6 rounded-2xl border border-neutral-800">
        <div className="text-sm text-gray-400">
          Displaying <span className="text-white font-bold">{visibleRoles.length}</span> workspace roles.
        </div>

        {hasPermission("create:roles") ? (
          <button
            onClick={handleOpenCreate}
            className="bg-primary-main text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary-main/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New Role
          </button>
        ) : (
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            Read-Only Settings
          </div>
        )}
      </div>

      {/* Grid of Roles or Empty State */}
      {visibleRoles.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center space-y-4 bg-[#110e1a] border border-neutral-800 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-500">
            <svg className="w-8 h-8 text-primary-main/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-base">No workspace roles found</h4>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">Get started by creating your first custom workspace role with custom access controls.</p>
          </div>
          {hasPermission("create:roles") && (
            <button
              onClick={handleOpenCreate}
              className="bg-primary-main hover:bg-primary-light text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-primary-main/10"
            >
              Create New Role
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRoles.map((role) => (
            <div
              key={role.id}
              className="bg-[#110e1a]/60 hover:bg-[#110e1a] p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{role.name}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasPermission("update:roles") && (
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg transition-colors"
                        title="Edit Role"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    {hasPermission("delete:roles") && (
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                        title="Delete Role"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed min-h-[3rem]">{role.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Mapped Permissions</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-gray-300 text-[10px] font-bold rounded-md"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">No permissions assigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#110e1a] w-full max-w-xl rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl animate-fade-in">
            <header className="px-8 py-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingRole ? "Modify Role Details" : "Create Workspace Role"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Developer"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-main focus:ring-1 focus:ring-primary-main text-white px-4 py-3 rounded-xl outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Summarize the authorization level of this role..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-main focus:ring-1 focus:ring-primary-main text-white px-4 py-3 rounded-xl outline-none text-sm h-20 resize-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">System Permissions Mapping</label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-neutral-950 rounded-xl border border-neutral-800 custom-scrollbar">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const active = formState.permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => handleTogglePermission(perm)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                          active
                            ? "bg-primary-main/10 border-primary-main/30 text-white"
                            : "bg-neutral-900/50 border-neutral-800/80 text-gray-400 hover:border-neutral-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            active
                              ? "bg-primary-main border-primary-main text-secondary-dark"
                              : "border-neutral-700"
                          }`}
                        >
                          {active && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[11px] font-bold font-mono">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-800 text-gray-400 hover:text-white font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-main text-secondary-dark px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingRole ? "Apply Modifications" : "Register Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesView;
