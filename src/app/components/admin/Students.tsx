import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search, Plus, Download, Upload, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, X, School, Users, UserCheck,
} from "lucide-react";
import api from "../../utils/api";

type StudentType = { id: string; name: string; class: string; gender: string; age: number; parent: string; status: string; email: string; phone: string; admission: string };
type ClassOverviewType = { name: string; classTeacher: string; totalStudents: number; males: number; females: number; active: number; suspended: number };

type View = "classes" | "students";

export function Students() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("classes");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<StudentType[]>([]);
  const [classInfo, setClassInfo] = useState<ClassOverviewType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<StudentType | null>(null);
  
  // Add Student Form State
  const [formData, setFormData] = useState({
    studentId: '', studentFirstName: '', studentLastName: '', gender: 'Male', dateOfBirth: '', class: 'JSS 1A', studentEmail: '',
    parentTitle: 'Mr.', parentFirstName: '', parentLastName: '', parentPhone: '', parentEmail: '', parentOccupation: '', parentAddress: '', relationship: 'Father'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/classes/overview')
      ]);
      
      const studentsData = Array.isArray(studentsRes?.data) ? studentsRes.data : (Array.isArray(studentsRes) ? studentsRes : []);
      const classesData = Array.isArray(classesRes?.data) ? classesRes.data : (Array.isArray(classesRes) ? classesRes : []);
      
      setAllStudents(studentsData);
      setClassInfo(classesData);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleAddStudent = async () => {
    try {
      setIsLoading(true);
      // Remove empty studentId and studentEmail so backend auto-generates or handles optionality
      const dataToSend = { ...formData };
      if (!dataToSend.studentId) delete dataToSend.studentId;
      if (!dataToSend.studentEmail) delete dataToSend.studentEmail;

      await api.post('/admin/students', dataToSend);
      setShowAddModal(false);
      setFormData({
        studentId: '', studentFirstName: '', studentLastName: '', gender: 'Male', dateOfBirth: '', class: 'JSS 1A', studentEmail: '',
        parentTitle: 'Mr.', parentFirstName: '', parentLastName: '', parentPhone: '', parentEmail: '', parentOccupation: '', parentAddress: '', relationship: 'Father'
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please check the form data.");
    } finally {
      setIsLoading(false);
    }
  };

  const studentsInClass = selectedClass
    ? (Array.isArray(allStudents) ? allStudents : []).filter((s) => s.class === selectedClass)
    : (Array.isArray(allStudents) ? allStudents : []);

  const filtered = studentsInClass.filter((s) => {
    const studentName = s.name || "";
    const studentId = s.id || "";
    const matchSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalStudents = Array.isArray(classInfo) ? classInfo.reduce((s, c) => s + (c.totalStudents || 0), 0) : 0;

  const statusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700";
      case "Suspended": return "bg-red-50 text-red-700";
      case "Graduated": return "bg-blue-50 text-blue-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {view === "students" && (
            <button onClick={() => { setView("classes"); setSelectedClass(null); }} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
              {view === "classes" ? "Student Management" : `${selectedClass} — Students`}
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
              {view === "classes" 
                ? `${totalStudents} students across ${(classInfo || []).length} classes` 
                : `${(studentsInClass || []).length} students enrolled`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Classes Grid View */}
      {view === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(classInfo) ? classInfo : []).map((cls) => (
            <div
              key={cls.name}
              onClick={() => { setSelectedClass(cls.name); setView("students"); }}
              className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center group-hover:bg-[#1B6B8A] transition-colors">
                    <School className="w-5 h-5 text-[#1B6B8A] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>{cls.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.classTeacher}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B6B8A]" />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Students</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{cls.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Males / Females</span>
                  <span style={{ fontSize: "13px" }}>{cls.males} / {cls.females}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Active</span>
                  <span className="text-green-600" style={{ fontSize: "13px", fontWeight: 500 }}>{cls.active}</span>
                </div>
                {cls.suspended > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Suspended</span>
                    <span className="text-red-500" style={{ fontSize: "13px", fontWeight: 500 }}>{cls.suspended}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Students List View */}
      {view === "students" && (
        <>
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search students by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Student ID", "Name", "Gender", "Age", "Parent/Guardian", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                            <span className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>{student.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.gender}</td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.age}</td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.parent}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full ${statusColor(student.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{student.status}</span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-gray-100" onClick={() => navigate(`/students/${student.id}`)}><Eye className="w-4 h-4 text-[#1B6B8A]" /></button>
                          <button onClick={() => setShowEditModal(student)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Showing {(filtered || []).length} students</p>
            </div>
          </div>
        </>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Student Information Section */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3 text-[#1B6B8A]">Student Information</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-blue-700" style={{ fontSize: "12px" }}>
                      <strong>ID Assignment:</strong> If you leave Student ID blank, the system will automatically assign one (e.g. STU2026001).
                    </p>
                  </div>
                  <div><label style={{ fontSize: "13px" }}>Student ID (Optional)</label><input value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="Leave blank to auto-generate" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "13px" }}>First Name</label><input value={formData.studentFirstName} onChange={e => setFormData({...formData, studentFirstName: e.target.value})} placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                    <div><label style={{ fontSize: "13px" }}>Last Name</label><input value={formData.studentLastName} onChange={e => setFormData({...formData, studentLastName: e.target.value})} placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "13px" }}>Gender</label><select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Male</option><option>Female</option></select></div>
                    <div><label style={{ fontSize: "13px" }}>Date of Birth</label><input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  </div>
                  <div>
                    <label style={{ fontSize: "13px" }}>Class</label>
                    {(Array.isArray(classInfo) && classInfo.length > 0) ? (
                      <select 
                        value={formData.class} 
                        onChange={e => setFormData({...formData, class: e.target.value})} 
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" 
                        style={{ fontSize: "13px" }}
                      >
                        <option value="">Select a class</option>
                        {classInfo.map(cls => (
                          <option key={cls.name} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-1 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-red-700 mb-2" style={{ fontSize: "12px" }}>
                          No classes found. You must create at least one class before adding students.
                        </p>
                        <button 
                          onClick={() => navigate("/classes")}
                          className="text-[#1B6B8A] font-semibold hover:underline"
                          style={{ fontSize: "12px" }}
                        >
                          Go to Class Management →
                        </button>
                      </div>
                    )}
                  </div>
                  <div><label style={{ fontSize: "13px" }}>Student Email (Optional)</label><input type="email" value={formData.studentEmail} onChange={e => setFormData({...formData, studentEmail: e.target.value})} placeholder="student@school.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
              </div>

              {/* Parent/Guardian Information Section */}
              <div className="pt-4 border-t border-border">
                <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3 text-[#1B6B8A]">Parent/Guardian Information</h4>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                  <p className="text-blue-700" style={{ fontSize: "12px" }}>
                    <strong>Note:</strong> This information will automatically create a parent record in the Parents section.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label style={{ fontSize: "13px" }}>Title</label>
                    <select value={formData.parentTitle} onChange={e => setFormData({...formData, parentTitle: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                      <option>Chief</option>
                      <option>Pastor</option>
                      <option>Alhaji</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "13px" }}>First Name</label><input value={formData.parentFirstName} onChange={e => setFormData({...formData, parentFirstName: e.target.value})} placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                    <div><label style={{ fontSize: "13px" }}>Last Name</label><input value={formData.parentLastName} onChange={e => setFormData({...formData, parentLastName: e.target.value})} placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "13px" }}>Phone Number</label><input type="tel" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} placeholder="e.g. 08012345678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                    <div><label style={{ fontSize: "13px" }}>Email Address</label><input type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} placeholder="parent@email.com" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  </div>
                  <div><label style={{ fontSize: "13px" }}>Occupation</label><input value={formData.parentOccupation} onChange={e => setFormData({...formData, parentOccupation: e.target.value})} placeholder="e.g. Engineer" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Home Address</label><textarea value={formData.parentAddress} onChange={e => setFormData({...formData, parentAddress: e.target.value})} rows={2} placeholder="Enter complete address..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Relationship to Child</label><select value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Father</option><option>Mother</option><option>Guardian</option><option>Relative</option><option>Other</option></select></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button 
                disabled={isLoading || !classInfo?.length || !formData.class} 
                onClick={handleAddStudent} 
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ fontSize: "13px" }}
              >
                {isLoading ? 'Adding...' : 'Add Student & Create Parent'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Student</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>First Name</label><input defaultValue={showEditModal.name.split(" ")[0]} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <div><label style={{ fontSize: "13px" }}>Last Name</label><input defaultValue={showEditModal.name.split(" ").slice(1).join(" ")} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Gender</label><select defaultValue={showEditModal.gender} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Male</option><option>Female</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Age</label><input type="number" defaultValue={showEditModal.age} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Class</label><select defaultValue={showEditModal.class} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>JSS 1A</option><option>JSS 1B</option><option>JSS 2A</option><option>JSS 2B</option><option>JSS 3A</option><option>JSS 3B</option><option>SS 1A</option><option>SS 1B</option><option>SS 2A</option><option>SS 2B</option><option>SS 3A</option><option>SS 3B</option></select></div>
              <div><label style={{ fontSize: "13px" }}>Parent/Guardian Name</label><input defaultValue={showEditModal.parent} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Phone Number</label><input defaultValue={showEditModal.phone} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Email Address</label><input type="email" defaultValue={showEditModal.email} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Status</label><select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option value="Active">Active</option><option value="Suspended">Suspended</option><option value="Graduated">Graduated</option></select></div>
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