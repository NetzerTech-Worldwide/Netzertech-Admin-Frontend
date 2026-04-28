import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, Calendar, Edit, BookOpen, X } from "lucide-react";
import { useState } from "react";

const teacherData: Record<string, any> = {};

const tabs = ["Overview", "Schedule", "Performance"];

export function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const teacher = teacherData[id || "TCH001"] || teacherData["TCH001"];

  return (
    <div className="space-y-4">
      <button onClick={() => navigate("/teachers")} className="flex items-center gap-2 text-[#1B6B8A] hover:underline" style={{ fontSize: "13px" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Teachers
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1B6B8A] flex items-center justify-center shrink-0">
            <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>EN</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600 }}>{teacher.name}</h2>
                <p className="text-[#1B6B8A]" style={{ fontSize: "14px", fontWeight: 500 }}>{teacher.subject} Teacher</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700" style={{ fontSize: "12px", fontWeight: 500 }}>{teacher.status}</span>
                <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
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
                <select defaultValue={teacher.name.split(" ")[0]} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>First Name</label>
                  <input defaultValue={teacher.name.replace(/Mr\.|Mrs\.|Ms\.|Dr\./g, "").trim().split(" ")[0]} placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Last Name</label>
                  <input defaultValue={teacher.name.replace(/Mr\.|Mrs\.|Ms\.|Dr\./g, "").trim().split(" ")[1] || ""} placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Gender</label>
                <select defaultValue={teacher.gender} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Date of Birth</label>
                <input type="date" defaultValue={teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : ""} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject Specialization</label>
                <select defaultValue={teacher.subject} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
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
                <select defaultValue={teacher.qualification} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
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
                  <input type="email" defaultValue={teacher.email} placeholder="teacher@netzertech.edu.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Phone Number</label>
                  <input type="tel" defaultValue={teacher.phone} placeholder="08012345678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Years of Experience</label>
                  <input type="text" defaultValue={teacher.experience} placeholder="e.g. 5 years" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Join Date</label>
                  <input type="date" defaultValue={teacher.joinDate ? new Date(teacher.joinDate).toISOString().split('T')[0] : ""} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Address</label>
                <textarea rows={2} defaultValue={teacher.address} placeholder="Full residential address..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Status</label>
                <select defaultValue={teacher.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Assigned Classes</label>
                <div className="mt-2 p-3 bg-[#F5F7FA] rounded-lg">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>Current: {teacher.classes.join(", ")}</p>
                  <div className="flex flex-wrap gap-2">
                    {["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"].map((cls) => (
                      <label key={cls} className="flex items-center gap-2 px-2 py-1 bg-white rounded cursor-pointer hover:bg-[#E8F4F8]">
                        <input type="checkbox" defaultChecked={teacher.classes.includes(cls)} className="rounded" />
                        <span style={{ fontSize: "11px" }}>{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
