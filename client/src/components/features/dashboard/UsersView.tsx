import React, { useState, useEffect } from "react";
import { useUsers } from "../../../hooks/useUsers";
import { useRoles } from "../../../hooks/useRoles";

interface IUserRecord {
  id: string;
  name: string;
  email: string;
  roles: string[];
  customPermissions: string[];
}

interface CreateUserPayload {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
  customPermissions: string[];
}

interface UsersViewProps {
  hasPermission: (perm: string) => boolean;
}

const AVAILABLE_PERMISSIONS = [
  "create:projects", "read:projects", "update:projects", "delete:projects",
  "create:users", "read:users", "update:users", "delete:users",
  "create:roles", "read:roles", "update:roles", "delete:roles",
  "read:permissions"
];

const UsersView: React.FC<UsersViewProps> = ({ hasPermission }) => {
  const [users, setUsers] = useState<IUserRecord[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ id: string; name: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Employee" });
  const [selectedUser, setSelectedUser] = useState<IUserRecord | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { getAllUsers, createUser, updateUserPermissions, updateUserRole } = useUsers();
  const { getAllRoles } = useRoles();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res && res.data) {
          setUsers(res.data);
        }
      } catch (err) {
        console.warn("Backend API not resolved", err);
      }
    };
    const fetchRoles = async () => {
      try {
        const res = await getAllRoles();
        const rolesList = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        setAvailableRoles(rolesList);
        if (rolesList.length > 0) {
          setNewUser(prev => ({ ...prev, role: rolesList[0].name }));
        }
      } catch (err) {
        console.warn("Failed fetching roles", err);
      }
    };
    fetchUsers();
    fetchRoles();
  }, [getAllUsers, getAllRoles]);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "add") {
      const createdUser: CreateUserPayload = {
        id: String(Date.now()),
        name: newUser.name,
        password: newUser.password,
        email: newUser.email,
        roles: [newUser.role],
        customPermissions: []
      };
      try {
        const res = await createUser(createdUser);
        if (res && res.data) {
          setUsers([...users, res.data]);
        } else {
          setUsers([...users, createdUser]);
        }
      } catch (err) {
        console.warn("Failed creating user on backend, updating local state", err);
        setUsers([...users, createdUser]);
      }
    } else if (modalMode === "edit" && editingUserId) {
      const existing = users.find(u => u.id === editingUserId);
      if (existing) {
        const updated = {
          ...existing,
          name: newUser.name,
          email: newUser.email,
          roles: [newUser.role]
        };
        setUsers(users.map(u => u.id === editingUserId ? updated : u));
        try {
          await updateUserRole(editingUserId, [newUser.role]);
        } catch (err) {
          console.warn("Failed updating user role on backend", err);
        }
      }
    }
    setShowModal(false);
    setNewUser({ name: "", email: "", password: "", role: "Employee" });
    setEditingUserId(null);
  };

  const handleEditClick = (user: IUserRecord) => {
    setModalMode("edit");
    setEditingUserId(user.id);
    const roleVal = user.roles[0];
    const roleName = roleVal && typeof roleVal === "object" ? (roleVal as any).name : roleVal;
    setNewUser({
      name: user.name,
      email: user.email,
      password: "", // Password typically isn't updated here
      role: roleName || "Employee"
    });
    setShowModal(true);
  };

  const handleOpenPermissions = (user: IUserRecord) => {
    setSelectedUser(user);
    setShowOverrideModal(true);
  };

  const handleTogglePermission = async (perm: string) => {
    if (!selectedUser) return;
    
    const isGranted = selectedUser.customPermissions.includes(perm);
    const updatedPerms = isGranted
      ? selectedUser.customPermissions.filter(p => p !== perm)
      : [...selectedUser.customPermissions, perm];

    const updatedUser = { ...selectedUser, customPermissions: updatedPerms };
    setSelectedUser(updatedUser);
    
    try {
      await updateUserPermissions(selectedUser.id, updatedPerms);
    } catch (err) {
      console.warn("Failed updating user permissions on backend, updating local state", err);
    }
    setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
  };


  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-[#110e1a] p-6 rounded-2xl border border-neutral-800">
        <div className="text-sm text-gray-400">
          Displaying <span className="text-white font-bold">{users.length}</span> members in your tenant workspace.
        </div>

        {hasPermission("create:users") ? (
          <button
            onClick={() => {
              setModalMode("add");
              setEditingUserId(null);
              setNewUser({ name: "", email: "", password: "", role: "Employee" });
              setShowModal(true);
            }}
            className="bg-primary-main text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary-main/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Team Member
          </button>
        ) : (
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            Read-Only Directory
          </div>
        )}
      </div>

      {/* Directory Table or Empty State */}
      <div className="bg-[#110e1a] border border-neutral-800 rounded-2xl overflow-hidden shadow-md">
        {users.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-4 bg-[#110e1a]">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-500">
              <svg className="w-8 h-8 text-primary-main/70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-base">No team members found</h4>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Get started by inviting your first team member to this tenant workspace.</p>
            </div>
            {hasPermission("create:users") && (
              <button
                onClick={() => {
                  setModalMode("add");
                  setEditingUserId(null);
                  setNewUser({ name: "", email: "", password: "", role: "Employee" });
                  setShowModal(true);
                }}
                className="bg-primary-main hover:bg-primary-light text-secondary-dark px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-primary-main/10"
              >
                Invite Member
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider bg-[#1a1726]/40">
                  <th className="p-5">Name</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5">Assigned Roles</th>
                  <th className="p-5">Permission Overrides</th>
                  <th className="p-5 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1c1926]/20 transition-colors text-sm">
                    <td className="p-5 font-semibold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-main/15 text-primary-main flex items-center justify-center font-bold border border-primary-main/25">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-5 text-gray-400">{u.email}</td>
                    <td className="p-5">
                      {u.roles.map((r: any, i) => {
                        const roleName = r && typeof r === "object" ? r.name : r;
                        return (
                          <span key={i} className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                            roleName === "Admin"
                              ? "bg-red-950/40 text-red-400 border-red-950/50"
                              : roleName === "Manager"
                              ? "bg-blue-950/40 text-blue-400 border-blue-950/50"
                              : "bg-neutral-800 text-gray-400 border-neutral-700"
                          }`}>
                            {roleName}
                          </span>
                        );
                      })}
                    </td>
                    <td className="p-5">
                      {u.customPermissions.length > 0 ? (
                        <span className="text-[10px] font-bold bg-primary-main/10 text-primary-main border border-primary-main/20 px-2 py-0.5 rounded">
                          +{u.customPermissions.length} custom permissions
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600 font-medium">None</span>
                      )}
                    </td>
                    <td className="p-5 text-right flex items-center justify-end gap-3 h-full">
                      {hasPermission("update:users") && (
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                        >
                          Edit Member
                        </button>
                      )}
                      {hasPermission("update:users") && (
                        <button
                          onClick={() => handleOpenPermissions(u)}
                          className="text-xs font-bold text-primary-main hover:text-primary-light transition-colors"
                        >
                          Adjust Overrides
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#110e1a] border border-neutral-800 rounded-2xl p-8 relative">
            <h3 className="text-xl font-black text-white tracking-tight mb-6">
              {modalMode === "add" ? "Invite Member" : "Edit Member"}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Alice Smith"
                  className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={modalMode === "edit"}
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="alice@company.com"
                  className={`w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main ${
                    modalMode === "edit" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {modalMode === "add" && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">System Role</label>
                {availableRoles.length > 0 ? (
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[#08060d] text-white rounded-lg border border-neutral-800 text-sm outline-none focus:border-primary-main"
                  >
                    {availableRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-red-400 font-bold bg-red-990/10 border border-red-900/35 px-4 py-3 rounded-lg">
                    No roles found in this tenant. Please create a role first.
                  </div>
                )}
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
                  disabled={modalMode === "add" && availableRoles.length === 0}
                  className={`w-2/3 py-3 rounded-lg border-none font-black text-sm uppercase tracking-wide cursor-pointer transition-all ${
                    modalMode === "add" && availableRoles.length === 0
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                      : "bg-primary-main hover:bg-primary-light text-secondary-dark"
                  }`}
                >
                  {modalMode === "add" ? "Create Account" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overrides Modal */}
      {showOverrideModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#110e1a] border border-neutral-800 rounded-2xl p-8 relative max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-black text-white tracking-tight mb-2">Adjust Access Rules</h3>
            <p className="text-xs text-gray-400 mb-6">
              Grant custom system permissions to <span className="text-white font-semibold">{selectedUser.name}</span> overriding standard system roles.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {AVAILABLE_PERMISSIONS.map(perm => {
                const checked = selectedUser.customPermissions.includes(perm);
                return (
                  <label
                    key={perm}
                    onClick={() => handleTogglePermission(perm)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      checked
                        ? "bg-primary-main/10 border-primary-main text-white"
                        : "bg-[#08060d]/50 border-neutral-800 text-gray-500 hover:border-neutral-700 hover:text-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked ? "bg-primary-main border-primary-main text-secondary-dark" : "border-neutral-700"
                    }`}>
                      {checked && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-bold font-mono">{perm}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="bg-primary-main hover:bg-primary-light text-secondary-dark px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-colors"
              >
                Close & Sync Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
