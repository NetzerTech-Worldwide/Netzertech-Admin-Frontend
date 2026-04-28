import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Users, Clock, X } from "lucide-react";
import { api } from "../../utils/api";

export function Subjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<typeof allSubjects[0] | null>(null);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState({ name: "", code: "", duration: "", teacherId: "" });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await api.get('/academic/subjects');
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    try {
      await api.post('/academic/subjects', newSubject);
      setShowAddModal(false);
      setNewSubject({ name: "", code: "", duration: "", teacherId: "" });
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = subjects.filter((s) =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Subject Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage curriculum subjects</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search subjects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                {["Code", "Subject", "Teacher", "Classes", "Duration", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((subject) => (
                <tr key={subject.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "12px", fontWeight: 600 }}>{subject.code}</span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "13px", fontWeight: 500 }}>{subject.name}</td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{subject.teacherName || "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1B6B8A]" />
                      <span style={{ fontSize: "12px" }}>{subject.classes?.length || 0} classes</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span style={{ fontSize: "12px" }}>{subject.duration || "24 Weeks"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full ${subject.status !== "Inactive" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                      {subject.status || "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowEditModal(subject)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Subject</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Subject Name</label><input value={newSubject.name} onChange={(e) => setNewSubject({...newSubject, name: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Subject Code</label><input value={newSubject.code} onChange={(e) => setNewSubject({...newSubject, code: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <div><label style={{ fontSize: "13px" }}>Duration</label><input value={newSubject.duration} onChange={(e) => setNewSubject({...newSubject, duration: e.target.value})} placeholder="24 Weeks" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Assigned Teacher</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Select Teacher</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={handleAddSubject} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Add Subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Subject</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Subject Name</label><input defaultValue={showEditModal.name} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Subject Code</label><input defaultValue={showEditModal.code} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <div><label style={{ fontSize: "13px" }}>Duration</label><input defaultValue={showEditModal.duration} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Assigned Teacher</label><select defaultValue={showEditModal.teacher} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>{showEditModal.teacher}</option></select></div>
              <div><label style={{ fontSize: "13px" }}>Status</label><select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
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