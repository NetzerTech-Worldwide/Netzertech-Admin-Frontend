import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Users, BookOpen, X, Loader2 } from "lucide-react";
import api from "../../utils/api";

type ClassType = { 
  id: string; 
  name: string; 
  level: string; 
  section: string; 
  students: number; 
  classTeacher: string; 
  subjects: number; 
  room: string 
};

type TeacherType = {
  id: string;
  name: string;
};

export function Classes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<ClassType | null>(null);
  const [levelFilter, setLevelFilter] = useState("All");
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "JSS 1",
    level: "JSS 1",
    section: "",
    classTeacherId: "",
    room: ""
  });

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-compute name from level + section
      if (field === "level" || field === "section") {
        const level = field === "level" ? value : prev.level;
        const section = field === "section" ? value.toUpperCase().trim() : prev.section;
        updated.section = field === "section" ? value.toUpperCase().trim() : prev.section;
        updated.name = section ? `${level} ${section}` : level;
      }
      return updated;
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classesRes, teachersRes] = await Promise.all([
        api.get("/admin/classes/overview"),
        api.get("/admin/teachers")
      ]);
      setClasses(classesRes);
      setTeachers(teachersRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = async () => {
    if (!formData.level) {
      alert("Please select a level.");
      return;
    }
    if (!formData.section || !formData.section.trim()) {
      alert("Please enter a section (e.g. A, B, C). Section is required.");
      return;
    }

    setIsCreating(true);
    try {
      await api.post("/admin/classes", formData);
      setShowAddModal(false);
      setFormData({ name: "JSS 1", level: "JSS 1", section: "", classTeacherId: "", room: "" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to create class.");
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = (classes || []).filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.classTeacher?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const totalStudents = classes.reduce((sum, c) => sum + (c.students || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Class Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Organize and manage school classes</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74] transition-colors" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: classes.length, color: "#1B6B8A" },
          { label: "Total Students", value: totalStudents, color: "#22C55E" },
          { label: "Avg Class Size", value: classes.length ? Math.round(totalStudents / classes.length) : 0, color: "#F59E0B" },
          { label: "Levels", value: 6, color: "#8B5CF6" },
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
          <input type="text" placeholder="Search classes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
          <option value="All">All Levels</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>
      </div>

      {/* Class Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B6B8A]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center">
                  <span className="text-[#1B6B8A]" style={{ fontSize: "14px", fontWeight: 700 }}>{cls.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setShowEditModal(cls)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: 600 }}>Class {cls.name}</h4>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.room || "No room assigned"}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /><span style={{ fontSize: "12px" }}>Students</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{cls.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" /><span style={{ fontSize: "12px" }}>Subjects</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{cls.subjects}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Class Teacher</p>
                <p style={{ fontSize: "13px", fontWeight: 500 }}>{cls.classTeacher || "Not assigned"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-border py-20 text-center">
          <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No classes found</h3>
          <p className="text-muted-foreground mb-6">Create your first class to start managing students</p>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]">Add Class</button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Class</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Class Name <span className="text-muted-foreground">(auto-generated)</span></label>
                <input 
                  placeholder="Select level and enter section below" 
                  value={formData.name}
                  disabled
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-gray-100 text-gray-600 cursor-not-allowed" 
                  style={{ fontSize: "13px" }} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Level <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.level}
                    onChange={e => updateFormField("level", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" 
                    style={{ fontSize: "13px" }}
                  >
                    <option>JSS 1</option>
                    <option>JSS 2</option>
                    <option>JSS 3</option>
                    <option>SS 1</option>
                    <option>SS 2</option>
                    <option>SS 3</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Section <span className="text-red-500">*</span></label>
                  <input 
                    placeholder="e.g. A, B, C" 
                    value={formData.section}
                    onChange={e => updateFormField("section", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" 
                    style={{ fontSize: "13px" }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Class Teacher</label>
                <select 
                  value={formData.classTeacherId}
                  onChange={e => setFormData({...formData, classTeacherId: e.target.value})}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" 
                  style={{ fontSize: "13px" }}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Room</label>
                <input 
                  placeholder="Block A, Room 103" 
                  value={formData.room}
                  onChange={e => setFormData({...formData, room: e.target.value})}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" 
                  style={{ fontSize: "13px" }} 
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button 
                disabled={isCreating}
                onClick={handleCreateClass} 
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50" 
                style={{ fontSize: "13px" }}
              >
                {isCreating ? "Creating..." : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Mockup) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Class</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Class Name</label><input defaultValue={showEditModal.name} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              {/* ... other edit fields ... */}
              <p className="text-xs text-muted-foreground italic">Edit functionality coming soon</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}