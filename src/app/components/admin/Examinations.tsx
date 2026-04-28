import { useState } from "react";
import { Search, Plus, Eye, Edit, Download, X, FileText, Calendar, ChevronLeft, ChevronRight, School, Users, Trash2 } from "lucide-react";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];

const exams: { id: string; name: string; term: string; type: string; startDate: string; endDate: string; classes: string[]; status: string; totalStudents: number }[] = [];

const classResultsSummary: { class: string; students: number; avgScore: number; passRate: number; highestAvg: number; lowestAvg: number }[] = [];

const classStudentResults: Record<string, { student: string; id: string; math: number; english: number; biology: number; physics: number; chemistry: number; total: number; avg: number; position: number }[]> = {};

const tabs = ["Examinations", "Results", "Grade Settings"];

type ResultView = "classes" | "students";

interface GradeSetting {
  grade: string;
  minScore: number;
  maxScore: number;
  remark: string;
  color: string;
}

const defaultGrades: GradeSetting[] = [
  { grade: "A", minScore: 80, maxScore: 100, remark: "Excellent", color: "bg-green-50 text-green-700" },
  { grade: "B", minScore: 70, maxScore: 79, remark: "Very Good", color: "bg-blue-50 text-blue-700" },
  { grade: "C", minScore: 60, maxScore: 69, remark: "Good", color: "bg-yellow-50 text-yellow-700" },
  { grade: "D", minScore: 50, maxScore: 59, remark: "Fair", color: "bg-orange-50 text-orange-700" },
  { grade: "E", minScore: 40, maxScore: 49, remark: "Poor", color: "bg-red-50 text-red-700" },
  { grade: "F", minScore: 0, maxScore: 39, remark: "Fail", color: "bg-red-100 text-red-800" },
];

export function Examinations() {
  const [activeTab, setActiveTab] = useState("Examinations");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<typeof exams[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termExamFilter, setTermExamFilter] = useState("All");
  const [resultView, setResultView] = useState<ResultView>("classes");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [gradeSettings, setGradeSettings] = useState<GradeSetting[]>(defaultGrades);
  const [showEditGradeModal, setShowEditGradeModal] = useState<GradeSetting | null>(null);
  const [editingGradeIndex, setEditingGradeIndex] = useState<number | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-50 text-green-700";
      case "Upcoming": return "bg-yellow-50 text-yellow-700";
      case "Scheduled": return "bg-blue-50 text-blue-700";
      case "In Progress": return "bg-orange-50 text-orange-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {resultView === "students" && activeTab === "Results" && (
            <button onClick={() => { setResultView("classes"); setSelectedClass(null); }} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
              {resultView === "students" && activeTab === "Results" ? `${selectedClass} — Exam Results` : "Examination Management"}
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage exams, results, and grading</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Set Exam Timetable
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border shadow-sm p-1">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setResultView("classes"); setSelectedClass(null); }} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? "bg-[#1B6B8A] text-white" : "hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>{tab}</button>
        ))}
      </div>

      {activeTab === "Examinations" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Exams", value: exams.length, color: "#1B6B8A" },
              { label: "Completed", value: exams.filter(e => e.status === "Completed").length, color: "#22C55E" },
              { label: "Upcoming", value: exams.filter(e => e.status === "Upcoming").length, color: "#F59E0B" },
              { label: "Scheduled", value: exams.filter(e => e.status === "Scheduled").length, color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm p-4">
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.label}</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Exam Name", "Term", "Type", "Date", "Classes", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#E8F4F8] flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#1B6B8A]" />
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>{exam.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{exam.term}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "12px" }}>{exam.type}</span></td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{exam.startDate} - {exam.endDate}</td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{exam.classes.length} classes</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full ${statusColor(exam.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{exam.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-gray-100"><Eye className="w-4 h-4 text-[#1B6B8A]" /></button>
                          <button onClick={() => setShowEditModal(exam)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "Results" && resultView === "classes" && (
        <>
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <select className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
              <option>First Term Mid-Term</option>
              <option>First Term Final</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
              <Download className="w-4 h-4" /> Export All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classResultsSummary.map((cls) => (
              <div
                key={cls.class}
                onClick={() => { setSelectedClass(cls.class); setResultView("students"); }}
                className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center group-hover:bg-[#1B6B8A] transition-colors">
                      <span className="text-[#1B6B8A] group-hover:text-white transition-colors" style={{ fontSize: "14px", fontWeight: 700 }}>{cls.class}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 600 }}>{cls.class}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.students} students</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B6B8A]" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Class Average</span>
                    <span className="text-[#1B6B8A]" style={{ fontSize: "14px", fontWeight: 600 }}>{cls.avgScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Pass Rate</span>
                    <span className="text-green-600" style={{ fontSize: "13px", fontWeight: 500 }}>{cls.passRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Highest / Lowest</span>
                    <span style={{ fontSize: "12px" }}><span className="text-green-600">{cls.highestAvg}%</span> / <span className="text-red-500">{cls.lowestAvg}%</span></span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${cls.passRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "Results" && resultView === "students" && selectedClass && (
        <>
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Pos", "Student", "Math", "Eng", "Bio", "Phy", "Chem", "Total", "Avg", "Grade"].map((h) => (
                      <th key={h} className="text-left px-3 py-3" style={{ fontSize: "11px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(classStudentResults[selectedClass] || [])
                    .filter((r) => r.student.toLowerCase().includes(searchTerm.toLowerCase()))
                    .sort((a, b) => a.position - b.position)
                    .map((r) => (
                    <tr key={r.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-3 py-3"><span className="w-6 h-6 rounded-full bg-[#E8F4F8] text-[#1B6B8A] flex items-center justify-center" style={{ fontSize: "11px", fontWeight: 600 }}>{r.position}</span></td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 500 }}>{r.student}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.math}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.english}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.biology}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.physics}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.chemistry}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{r.total}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{r.avg}%</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full ${r.avg >= 80 ? "bg-green-50 text-green-700" : r.avg >= 70 ? "bg-blue-50 text-blue-700" : r.avg >= 60 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`} style={{ fontSize: "11px" }}>
                          {r.avg >= 80 ? "A" : r.avg >= 70 ? "B" : r.avg >= 60 ? "C" : "D"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "Grade Settings" && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Grading System</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setGradeSettings(defaultGrades)} className="px-3 py-1.5 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "12px" }}>Reset to Default</button>
              <button onClick={() => { setShowEditGradeModal({ grade: "", minScore: 0, maxScore: 0, remark: "", color: "bg-gray-50 text-gray-700" }); setEditingGradeIndex(null); }} className="flex items-center gap-1 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
                <Plus className="w-3.5 h-3.5" /> Add Grade
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {gradeSettings.map((g, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${g.color}`} style={{ fontSize: "14px", fontWeight: 700 }}>{g.grade}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{g.minScore}-{g.maxScore}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{g.remark}</span>
                  <button onClick={() => { setShowEditGradeModal(g); setEditingGradeIndex(index); }} className="p-1.5 rounded hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => setGradeSettings(gradeSettings.filter((_, i) => i !== index))} className="p-1.5 rounded hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {gradeSettings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground" style={{ fontSize: "13px" }}>
              No grades configured. Click "Add Grade" to create grading system.
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Set Exam Timetable</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700" style={{ fontSize: "12px" }}>
                  <strong>Note:</strong> This sets the exam schedule with specific times for each exam. Actual exam questions and assessments are created in the Teacher Portal and submitted for admin approval.
                </p>
              </div>
              <div><label style={{ fontSize: "13px" }}>Exam Name</label><input placeholder="e.g. Second Term Mid-Term Examination" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Session</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{sessions.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label style={{ fontSize: "13px" }}>Term</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{termsOptions.map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Type</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Mid-Term</option><option>Final</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Start Date</label><input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>End Date</label><input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>

              {/* Exam Time Settings */}
              <div className="pt-4 border-t border-border">
                <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Exam Time Settings</h4>
                <div className="space-y-3">
                  {["Mathematics", "English Language", "Biology", "Physics", "Chemistry"].map((subject) => (
                    <div key={subject} className="p-3 bg-[#F5F7FA] rounded-lg">
                      <p style={{ fontSize: "13px", fontWeight: 500 }} className="mb-2">{subject}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label style={{ fontSize: "11px" }} className="text-muted-foreground">Date</label>
                          <input type="date" className="w-full mt-1 px-2 py-1.5 rounded border border-border bg-white" style={{ fontSize: "12px" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px" }} className="text-muted-foreground">Start Time</label>
                          <input type="time" defaultValue="09:00" className="w-full mt-1 px-2 py-1.5 rounded border border-border bg-white" style={{ fontSize: "12px" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px" }} className="text-muted-foreground">Duration (mins)</label>
                          <input type="number" defaultValue="120" min="30" step="15" className="w-full mt-1 px-2 py-1.5 rounded border border-border bg-white" style={{ fontSize: "12px" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-[#1B6B8A] hover:underline" style={{ fontSize: "12px" }}>+ Add More Subjects</button>
              </div>

              {/* Default Settings */}
              <div className="pt-4 border-t border-border">
                <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Default Settings</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: "12px" }} className="text-muted-foreground">Default Start Time</label>
                    <input type="time" defaultValue="09:00" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px" }} className="text-muted-foreground">Default Duration (mins)</label>
                    <input type="number" defaultValue="120" min="30" step="15" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Set Timetable</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Exam</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Exam Name</label><input defaultValue={showEditModal.name} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Session</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{sessions.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label style={{ fontSize: "13px" }}>Term</label><select defaultValue={showEditModal.term} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{termsOptions.map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Type</label><select defaultValue={showEditModal.type} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Mid-Term</option><option>Final</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Start Date</label><input type="date" defaultValue={showEditModal.startDate} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>End Date</label><input type="date" defaultValue={showEditModal.endDate} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Status</label><select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option value="Scheduled">Scheduled</option><option value="Upcoming">Upcoming</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Grade Modal */}
      {showEditGradeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{editingGradeIndex !== null ? "Edit Grade" : "Add New Grade"}</h3>
              <button onClick={() => { setShowEditGradeModal(null); setEditingGradeIndex(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Grade Letter</label>
                <input
                  defaultValue={showEditGradeModal.grade}
                  placeholder="e.g. A, B+, C1"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
                  style={{ fontSize: "13px" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Minimum Score (%)</label>
                  <input
                    type="number"
                    defaultValue={showEditGradeModal.minScore}
                    min="0"
                    max="100"
                    placeholder="e.g. 80"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Maximum Score (%)</label>
                  <input
                    type="number"
                    defaultValue={showEditGradeModal.maxScore}
                    min="0"
                    max="100"
                    placeholder="e.g. 100"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Remark</label>
                <input
                  defaultValue={showEditGradeModal.remark}
                  placeholder="e.g. Excellent, Very Good"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
                  style={{ fontSize: "13px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Color Theme</label>
                <select defaultValue={showEditGradeModal.color} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="bg-green-50 text-green-700">Green (Excellent)</option>
                  <option value="bg-blue-50 text-blue-700">Blue (Very Good)</option>
                  <option value="bg-yellow-50 text-yellow-700">Yellow (Good)</option>
                  <option value="bg-orange-50 text-orange-700">Orange (Fair)</option>
                  <option value="bg-red-50 text-red-700">Red (Poor)</option>
                  <option value="bg-red-100 text-red-800">Dark Red (Fail)</option>
                  <option value="bg-purple-50 text-purple-700">Purple</option>
                  <option value="bg-teal-50 text-teal-700">Teal</option>
                  <option value="bg-gray-50 text-gray-700">Gray</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => { setShowEditGradeModal(null); setEditingGradeIndex(null); }} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => { setShowEditGradeModal(null); setEditingGradeIndex(null); }} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                {editingGradeIndex !== null ? "Save Changes" : "Add Grade"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}