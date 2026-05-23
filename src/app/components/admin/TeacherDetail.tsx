import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, Calendar, Edit, BookOpen, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../utils/api";

const tabs = ["Overview", "Schedule", "Performance"];

export function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/admin/teachers/${id}`);
        setTeacher(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch teacher details:", err);
        setError(err.message || "Failed to load teacher details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const openEditModal = () => {
    if (!teacher) return;
    const cleanName = (teacher.name || "").replace(/Mr\.|Mrs\.|Ms\.|Dr\./g, "").trim();
    setEditFormData({
      title: (teacher.name || "").split(" ")[0]?.includes(".") ? (teacher.name || "").split(" ")[0] : "Mr.",
      firstName: cleanName.split(" ")[0] || "",
      lastName: cleanName.split(" ").slice(1).join(" ") || "",
      gender: teacher.gender || "Male",
      subject: teacher.subject || "",
      qualification: teacher.qualification || "B.Sc/B.A/B.Ed",
      email: teacher.email || "",
      phone: teacher.phone || "",
      experience: teacher.experience || "",
      address: teacher.address || "",
      status: teacher.status || "Active",
      classes: teacher.classes || [],
    });
    setShowEditModal(true);
  };

  const handleEditTeacher = async () => {
    if (!editFormData.firstName || !editFormData.lastName) {
      alert("First Name and Last Name are required.");
      return;
    }
    setIsSaving(true);
    try {
      await api.patch(`/admin/teachers/${id}`, editFormData);
      setShowEditModal(false);
      // Refresh teacher data
      const data = await api.get(`/admin/teachers/${id}`);
      setTeacher(data);
    } catch (err: any) {
      console.error("Failed to update teacher:", err);
      alert(err.message || "Failed to update teacher.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleClass = (cls: string) => {
    const current = editFormData.classes || [];
    if (current.includes(cls)) {
      setEditFormData({...editFormData, classes: current.filter((c: string) => c !== cls)});
    } else {
      setEditFormData({...editFormData, classes: [...current, cls]});
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-[#1B6B8A] animate-spin" />
        <p className="text-muted-foreground" style={{ fontSize: "14px" }}>Loading teacher details...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center space-y-4">
        <p className="text-red-600" style={{ fontSize: "14px" }}>{error || "Teacher not found"}</p>
        <button
          onClick={() => navigate("/teachers")}
          className="px-4 py-2 bg-[#1B6B8A] text-white rounded-lg"
          style={{ fontSize: "13px" }}
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => navigate("/teachers")} className="flex items-center gap-2 text-[#1B6B8A] hover:underline" style={{ fontSize: "13px" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Teachers
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1B6B8A] flex items-center justify-center shrink-0">
            <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>
              {teacher.name ? teacher.name.split(" ").map((n: string) => n[0]).join("") : "T"}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600 }}>{teacher.name}</h2>
                <p className="text-[#1B6B8A]" style={{ fontSize: "14px", fontWeight: 500 }}>{teacher.subject} Teacher</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full ${teacher.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} style={{ fontSize: "12px", fontWeight: 500 }}>{teacher.status}</span>
                <button onClick={openEditModal} className="flex items-center gap-2 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /><span style={{ fontSize: "13px" }}>{teacher.email}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /><span style={{ fontSize: "13px" }}>{teacher.phone}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span style={{ fontSize: "13px" }}>Joined: {teacher.joinDate}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border shadow-sm p-1">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? "bg-[#1B6B8A] text-white" : "hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>{tab}</button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Personal Information</h3>
            <div className="space-y-3">
              {[
                ["Full Name", teacher.name], ["Teacher ID", teacher.id], ["Gender", teacher.gender],
                ["Date of Birth", teacher.dob], ["Address", teacher.address],
                ["Qualification", teacher.qualification], ["Experience", teacher.experience],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Assigned Classes</h3>
              <div className="space-y-2">
                {teacher.classes.map((cls: string) => (
                  <div key={cls} className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                    <BookOpen className="w-4 h-4 text-[#1B6B8A]" />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{cls}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{teacher.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-border shadow-sm p-4 text-center">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-[#1B6B8A]">{teacher.totalStudents}</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Students</p>
              </div>
              <div className="bg-white rounded-xl border border-border shadow-sm p-4 text-center">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-green-600">{teacher.performance.passRate}%</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Pass Rate</p>
              </div>
              <div className="bg-white rounded-xl border border-border shadow-sm p-4 text-center">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-yellow-600">{teacher.performance.classesPerWeek}</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Classes/Week</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Schedule" && (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                {["Day", "Time", "Class", "Topic"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teacher.schedule.map((s: any, i: number) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{s.day}</td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{s.time}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "12px" }}>{s.class}</span></td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{s.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Performance" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center">
            <p style={{ fontSize: "36px", fontWeight: 700 }} className="text-[#1B6B8A]">{teacher.performance.avgStudentScore}%</p>
            <p className="text-muted-foreground" style={{ fontSize: "14px" }}>Avg Student Score</p>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center">
            <p style={{ fontSize: "36px", fontWeight: 700 }} className="text-green-600">{teacher.performance.passRate}%</p>
            <p className="text-muted-foreground" style={{ fontSize: "14px" }}>Pass Rate</p>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center">
            <p style={{ fontSize: "36px", fontWeight: 700 }} className="text-yellow-600">{teacher.performance.classesPerWeek}</p>
            <p className="text-muted-foreground" style={{ fontSize: "14px" }}>Weekly Classes</p>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Teacher Information</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Title</label>
                <select value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>First Name <span className="text-red-500">*</span></label>
                  <input value={editFormData.firstName} onChange={e => setEditFormData({...editFormData, firstName: e.target.value})} placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Last Name <span className="text-red-500">*</span></label>
                  <input value={editFormData.lastName} onChange={e => setEditFormData({...editFormData, lastName: e.target.value})} placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject Specialization</label>
                <select value={editFormData.subject} onChange={e => setEditFormData({...editFormData, subject: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Subject</option>
                  <option>Mathematics</option><option>English Language</option><option>Biology</option><option>Physics</option><option>Chemistry</option><option>Geography</option><option>Further Mathematics</option><option>Civic Education</option><option>Computer Science</option><option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Highest Qualification</label>
                <select value={editFormData.qualification} onChange={e => setEditFormData({...editFormData, qualification: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>B.Sc/B.A/B.Ed</option><option>M.Sc/M.A/M.Ed</option><option>Ph.D</option><option>NCE</option><option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Email Address</label>
                  <input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} placeholder="teacher@netzertech.edu.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Phone Number</label>
                  <input type="tel" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} placeholder="08012345678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Years of Experience</label>
                  <input type="text" value={editFormData.experience} onChange={e => setEditFormData({...editFormData, experience: e.target.value})} placeholder="e.g. 5 years" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Status</label>
                  <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option>Active</option><option>On Leave</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Address</label>
                <textarea rows={2} value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} placeholder="Full residential address..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Assigned Classes</label>
                <div className="mt-2 p-3 bg-[#F5F7FA] rounded-lg">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>Current: {(editFormData.classes || []).join(", ") || "None"}</p>
                  <div className="flex flex-wrap gap-2">
                    {["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"].map((cls) => (
                      <label key={cls} className="flex items-center gap-2 px-2 py-1 bg-white rounded cursor-pointer hover:bg-[#E8F4F8]">
                        <input type="checkbox" checked={(editFormData.classes || []).includes(cls)} onChange={() => toggleClass(cls)} className="rounded" />
                        <span style={{ fontSize: "11px" }}>{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button disabled={isSaving} onClick={handleEditTeacher} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50" style={{ fontSize: "13px" }}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
