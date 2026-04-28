import { useState, useEffect } from "react";
import { Search, Plus, User, Shield, Eye, Edit, Trash2, X, UserPlus, Lock } from "lucide-react";
import api from "../../utils/api";

type UserRole = "Super Admin" | "Principal" | "Vice Principal" | "HOD" | "Teacher" | "Bursar" | "Accountant" | "Librarian" | "IT Admin" | "Front Desk" | "Admin" | string;

interface Permission {
  module: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  permissions: Permission[];
  status: "Active" | "Inactive";
  lastLogin?: string;
  createdDate: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<UserAccount | null>(null);
  const [showEditModal, setShowEditModal] = useState<UserAccount | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<UserAccount | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/system-users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching system users:", error);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const inactiveCount = users.filter((u) => u.status === "Inactive").length;
  const roleDistribution = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColor = (status: string) => {
    return status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700";
  };

  const roleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      "Super Admin": "bg-purple-50 text-purple-700",
      Principal: "bg-blue-50 text-blue-700",
      "Vice Principal": "bg-indigo-50 text-indigo-700",
      HOD: "bg-teal-50 text-teal-700",
      Teacher: "bg-green-50 text-green-700",
      Bursar: "bg-orange-50 text-orange-700",
      Accountant: "bg-yellow-50 text-yellow-700",
      Librarian: "bg-pink-50 text-pink-700",
      "IT Admin": "bg-cyan-50 text-cyan-700",
      "Front Desk": "bg-gray-50 text-gray-700",
    };
    return colors[role] || "bg-gray-50 text-gray-700";
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === "Active") {
        await api.patch(`/users/${id}/deactivate`);
      } else {
        await api.patch(`/users/${id}/activate`);
      }
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>User & Role Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage system users and assign roles based on school organogram</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center">
              <User className="w-6 h-6 text-[#1B6B8A]" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Users</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Active Users</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Inactive Users</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-red-600">{inactiveCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Roles</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-purple-600">{Object.keys(roleDistribution).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none flex-1"
            style={{ fontSize: "13px" }}
          />
        </div>
        <div className="flex gap-2">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "All" | UserRole)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Principal">Principal</option>
            <option value="Vice Principal">Vice Principal</option>
            <option value="HOD">HOD</option>
            <option value="Teacher">Teacher</option>
            <option value="Bursar">Bursar</option>
            <option value="Accountant">Accountant</option>
            <option value="Librarian">Librarian</option>
            <option value="IT Admin">IT Admin</option>
            <option value="Front Desk">Front Desk</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Inactive")} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                {["User", "Email", "Role", "Department", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                        <span className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>{user.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{user.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "12px" }}>{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded ${roleColor(user.role)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "12px" }}>{user.department || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full ${statusColor(user.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "11px" }}>{user.lastLogin || "Never"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowDetailModal(user)} className="p-1.5 rounded hover:bg-gray-100">
                        <Eye className="w-4 h-4 text-[#1B6B8A]" />
                      </button>
                      <button onClick={() => setShowEditModal(user)} className="p-1.5 rounded hover:bg-gray-100">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(user)} className="p-1.5 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>User Details & Permissions</h3>
              <button onClick={() => setShowDetailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                  <span className="text-[#1B6B8A]" style={{ fontSize: "18px", fontWeight: 700 }}>{showDetailModal.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: 600 }}>{showDetailModal.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{showDetailModal.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded ${roleColor(showDetailModal.role)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{showDetailModal.role}</span>
                    <span className={`px-2 py-0.5 rounded-full ${statusColor(showDetailModal.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{showDetailModal.status}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>User ID</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.id}</p>
                </div>
                {showDetailModal.department && (
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Department</p>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.department}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Created Date</p>
                  <p style={{ fontSize: "14px" }}>{showDetailModal.createdDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Last Login</p>
                  <p style={{ fontSize: "14px" }}>{showDetailModal.lastLogin || "Never"}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Permissions</p>
                <div className="space-y-2">
                  {showDetailModal.permissions.map((perm, i) => (
                    <div key={i} className="p-3 bg-[#F5F7FA] rounded-lg">
                      <div className="flex items-center justify-between">
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{perm.module}</p>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs ${perm.canView ? "text-green-600" : "text-gray-400"}`}>View: {perm.canView ? "✓" : "✗"}</span>
                          <span className={`text-xs ${perm.canEdit ? "text-green-600" : "text-gray-400"}`}>Edit: {perm.canEdit ? "✓" : "✗"}</span>
                          <span className={`text-xs ${perm.canDelete ? "text-green-600" : "text-gray-400"}`}>Delete: {perm.canDelete ? "✓" : "✗"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => { handleToggleStatus(showDetailModal.id, showDetailModal.status); setShowDetailModal(null); }} className={`px-4 py-2 rounded-lg ${showDetailModal.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`} style={{ fontSize: "13px" }}>
                {showDetailModal.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Full Name</label>
                <input type="text" placeholder="e.g. John Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Email Address</label>
                <input type="email" placeholder="user@netzertech.edu.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Role</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Principal">Principal</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="HOD">HOD</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Bursar">Bursar</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Librarian">Librarian</option>
                  <option value="IT Admin">IT Admin</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Department (Optional)</label>
                <input type="text" placeholder="e.g. Science Department" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700" style={{ fontSize: "12px" }}>
                  Default permissions will be assigned based on the selected role. You can customize permissions after creating the user.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit User</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Full Name</label>
                <input type="text" defaultValue={showEditModal.name} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Email Address</label>
                <input type="email" defaultValue={showEditModal.email} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Role</label>
                  <select defaultValue={showEditModal.role} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="HOD">HOD</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Bursar">Bursar</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Librarian">Librarian</option>
                    <option value="IT Admin">IT Admin</option>
                    <option value="Front Desk">Front Desk</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Status</label>
                  <select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Department (Optional)</label>
                <input type="text" defaultValue={showEditModal.department || ""} placeholder="e.g. Science Department" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="border-t border-border pt-4">
                <p style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Module Permissions</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {showEditModal.permissions.map((perm, i) => (
                    <div key={i} className="p-3 bg-[#F5F7FA] rounded-lg">
                      <p style={{ fontSize: "13px", fontWeight: 500 }} className="mb-2">{perm.module}</p>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked={perm.canView} className="w-4 h-4 rounded border-gray-300" />
                          <span style={{ fontSize: "12px" }}>View</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked={perm.canEdit} className="w-4 h-4 rounded border-gray-300" />
                          <span style={{ fontSize: "12px" }}>Edit</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked={perm.canDelete} className="w-4 h-4 rounded border-gray-300" />
                          <span style={{ fontSize: "12px" }}>Delete</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="text-center mb-2">Delete User Account?</h3>
              <p className="text-muted-foreground text-center mb-4" style={{ fontSize: "13px" }}>
                Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
                <button onClick={() => handleDeleteUser(showDeleteConfirm.id)} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600" style={{ fontSize: "13px" }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}