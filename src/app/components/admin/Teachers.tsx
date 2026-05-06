import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search, Plus, Download, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, X, Mail, Phone, RefreshCw,
} from "lucide-react";
import api from "../../utils/api";

type TeacherType = { id: string; name: string; subject: string; classes: string[]; qualification: string; experience: string; gender: string; status: string; email: string; phone: string; joinDate: string };

export function Teachers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/teachers');
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : []);
      // Map API response to component state shape
      const mappedTeachers = data.map((t: any) => ({
        id: t.id,
        name: t.name,
        subject: t.subjects || "Various",
        classes: t.classes ? t.classes.split(',').map((c:string) => c.trim()) : [],
        qualification: "B.Sc / B.Ed", // default since backend might not have this
        experience: "5 years",
        gender: "Not specified",
        status: t.status || "Active",
        email: t.email,
        phone: t.phone,
        joinDate: t.joined
      }));
      setTeachers(mappedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    }
  };

  const filtered = (Array.isArray(teachers) ? teachers : []).filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReactivate = (id: string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: "Active" } : t));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700";
      case "On Leave": return "bg-yellow-50 text-yellow-700";
      case "Inactive": return "bg-red-50 text-red-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Teacher Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage teaching staff</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
            <Plus className="w-4 h-4" /> Add Teacher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Teachers", value: (Array.isArray(teachers) ? teachers : []).length, color: "#1B6B8A" },
          { label: "Active", value: (Array.isArray(teachers) ? teachers : []).filter(t => t.status === "Active").length, color: "#22C55E" },
          { label: "On Leave", value: (Array.isArray(teachers) ? teachers : []).filter(t => t.status === "On Leave").length, color: "#F59E0B" },
          { label: "Inactive", value: (Array.isArray(teachers) ? teachers : []).filter(t => t.status === "Inactive").length, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm p-4">
            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.label}</p>
            <p style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search teachers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/teachers/${teacher.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                <span className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>
                  {teacher.name.replace(/Mr\.|Mrs\.|Dr\./g, "").trim().split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full ${statusColor(teacher.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                {teacher.status}
              </span>
            </div>
            {teacher.status === "Inactive" && (
              <button
                onClick={(e) => { e.stopPropagation(); handleReactivate(teacher.id); }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors mt-1"
                style={{ fontSize: "11px", fontWeight: 500 }}
                title="Reactivate Teacher"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reactivate
              </button>
            )}
            <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{teacher.name}</h4>
            <p className="text-[#1B6B8A]" style={{ fontSize: "12px", fontWeight: 500 }}>{teacher.subject}</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "12px" }}>{teacher.qualification}</p>
            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span style={{ fontSize: "11px" }}>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              <span style={{ fontSize: "11px" }}>{teacher.phone}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {teacher.classes.map((cls) => (
                <span key={cls} className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "10px", fontWeight: 500 }}>
                  {cls}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Teacher</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Title</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>First Name</label>
                  <input placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Last Name</label>
                  <input placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Gender</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject Specialization</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Subject</option>
                  <option>Mathematics</option>
                  <option>English Language</option>
                  <option>Biology</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Geography</option>
                  <option>Further Mathematics</option>
                  <option>Civic Education</option>
                  <option>Computer Science</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Highest Qualification</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>B.Sc/B.A/B.Ed</option>
                  <option>M.Sc/M.A/M.Ed</option>
                  <option>Ph.D</option>
                  <option>NCE</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Email Address</label>
                  <input type="email" placeholder="teacher@netzertech.edu.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Phone Number</label>
                  <input type="tel" placeholder="08012345678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Years of Experience</label>
                  <input type="number" min="0" placeholder="e.g. 5" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Join Date</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Address</label>
                <textarea rows={2} placeholder="Full residential address..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Add Teacher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}