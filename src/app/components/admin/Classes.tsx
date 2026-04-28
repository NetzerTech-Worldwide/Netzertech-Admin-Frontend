import { useState } from "react";
import { Search, Plus, Edit, Trash2, Users, BookOpen, X } from "lucide-react";

const allClasses: { id: string; name: string; level: string; section: string; students: number; classTeacher: string; subjects: number; room: string }[] = [];

export function Classes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<typeof allClasses[0] | null>(null);
  const [levelFilter, setLevelFilter] = useState("All");

  const filtered = allClasses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.classTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const totalStudents = allClasses.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Class Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Organize and manage school classes</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: allClasses.length, color: "#1B6B8A" },
          { label: "Total Students", value: totalStudents, color: "#22C55E" },
          { label: "Avg Class Size", value: Math.round(totalStudents / allClasses.length), color: "#F59E0B" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center">
                <span className="text-[#1B6B8A]" style={{ fontSize: "16px", fontWeight: 700 }}>{cls.name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setShowEditModal(cls)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
            <h4 style={{ fontSize: "15px", fontWeight: 600 }}>Class {cls.name}</h4>
            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.room}</p>
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
              <p style={{ fontSize: "13px", fontWeight: 500 }}>{cls.classTeacher}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Class</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Class Name</label><input placeholder="e.g. JSS 1C" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Level</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>JSS 1</option><option>JSS 2</option><option>JSS 3</option><option>SS 1</option><option>SS 2</option><option>SS 3</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Section</label><input placeholder="C" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Class Teacher</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Select Teacher</option></select></div>
              <div><label style={{ fontSize: "13px" }}>Room</label><input placeholder="Block A, Room 103" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Create Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Class</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Class Name</label><input defaultValue={showEditModal.name} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Level</label><select defaultValue={showEditModal.level} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>JSS 1</option><option>JSS 2</option><option>JSS 3</option><option>SS 1</option><option>SS 2</option><option>SS 3</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Section</label><input defaultValue={showEditModal.section} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Class Teacher</label><select defaultValue={showEditModal.classTeacher} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>{showEditModal.classTeacher}</option></select></div>
              <div><label style={{ fontSize: "13px" }}>Room</label><input defaultValue={showEditModal.room} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
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