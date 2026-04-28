import { useState, useEffect } from "react";
import {
  Download, FileText, Search, Eye, Printer, GraduationCap,
  ChevronRight, ChevronLeft, X, User, Calendar, BookOpen, School, Users, Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];

const transcriptData: Record<string, { name: string; id: string; currentClass: string; admissionDate: string; cumulativeAvg: number; terms: any[] }> = {};

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "bg-[rgba(33,99,136,0.1)] text-[#216388]";
  if (grade.startsWith("B")) return "bg-[rgba(232,108,46,0.1)] text-[#e86c2e]";
  if (grade.startsWith("C")) return "bg-yellow-50 text-yellow-700";
  return "bg-red-50 text-red-700";
};

const getGrade = (score: number) => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
};

type View = "classes" | "classResults" | "transcript";
const tabs = ["Class Records", "Transcripts"];

export function AcademicRecords() {
  const [activeTab, setActiveTab] = useState("Class Records");
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("First Term");
  const [view, setView] = useState<View>("classes");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/admin/classes/overview");
        setClasses(response || []);
      } catch (err) {
        console.error("Failed to fetch academic records dependencies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedTranscript = selectedStudentId ? transcriptData[selectedStudentId] : null;

  const handleBack = () => {
    if (view === "transcript") {
      setView("classResults");
      setSelectedStudentId(null);
    } else if (view === "classResults") {
      setView("classes");
      setSelectedClass(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B6B8A]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {(view === "classResults" || view === "transcript") && activeTab === "Class Records" && (
            <button onClick={handleBack} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
              {view === "classes" || activeTab === "Transcripts" ? "Academic Records" : view === "classResults" ? `${selectedClass} — Results` : `Transcript — ${selectedTranscript?.name || ""}`}
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>View academic records across sessions and generate transcripts</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
          <Download className="w-4 h-4" /> Export Records
        </button>
      </div>

      {/* Session/Term Filter */}
      {view !== "transcript" && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
            {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
            {termsOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      {/* Tabs */}
      {view === "classes" && (
        <div className="flex gap-1 bg-white rounded-xl border border-border shadow-sm p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? "bg-[#1B6B8A] text-white" : "hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>{tab}</button>
          ))}
        </div>
      )}

      {/* Class Records Tab */}
      {activeTab === "Class Records" && view === "classes" && (
        <div className="space-y-4">
          {classes.length > 0 ? (
            <>
              {/* Subject Performance Chart - Placeholder for now as it needs backend data */}
              <div className="bg-white rounded-xl border border-border shadow-sm p-5">
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Subject Performance Overview</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>{sessionFilter} &middot; {termFilter}</p>
                <div className="h-[280px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed border-border" style={{ fontSize: "13px" }}>
                  Select a class to view performance metrics
                </div>
              </div>

              {/* Class Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => { setSelectedClass(record.name); setView("classResults"); }}
                    className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center group-hover:bg-[#1B6B8A] transition-colors">
                          <span className="text-[#1B6B8A] group-hover:text-white transition-colors" style={{ fontSize: "14px", fontWeight: 700 }}>{record.name}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "15px", fontWeight: 600 }}>{record.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{record.teacherName || "No teacher assigned"}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B6B8A]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Students</span><span style={{ fontSize: "13px", fontWeight: 500 }}>{record.totalStudents}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Average Score</span><span style={{ fontSize: "13px", fontWeight: 600 }} className="text-[#1B6B8A]">0%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground" style={{ fontSize: "12px" }}>Pass Rate</span><span className="text-green-600" style={{ fontSize: "13px", fontWeight: 500 }}>0%</span></div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `0%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-border py-20 text-center">
              <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No classes found</h3>
              <p className="text-muted-foreground mb-6">Create classes first to view academic records</p>
              <button onClick={() => navigate("/classes")} className="px-6 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]">Go to Classes</button>
            </div>
          )}
        </div>
      )}

      {/* Class Results (Student list) */}
      {activeTab === "Class Records" && view === "classResults" && selectedClass && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
              <Download className="w-4 h-4" /> Export Results
            </button>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Pos", "Student ID", "Name", "Math", "Eng", "Bio", "Phy", "Chem", "F.Math", "Geo", "Civic", "Total", "Avg", "Grade", ""].map((h, i) => (
                      <th key={i} className="text-left px-3 py-3 whitespace-nowrap" style={{ fontSize: "11px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(classStudentResults[selectedClass] || [])
                    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((r) => (
                    <tr key={r.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-3 py-3"><span className="w-6 h-6 rounded-full bg-[#E8F4F8] text-[#1B6B8A] flex items-center justify-center" style={{ fontSize: "11px", fontWeight: 600 }}>{r.position}</span></td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.id}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 500 }}>{r.name}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.Mathematics}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.English}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.Biology}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.Physics}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.Chemistry}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects["F. Maths"]}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects.Geography}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px" }}>{r.subjects["Civic Ed"]}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{r.total}</td>
                      <td className="px-3 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{r.avg}%</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded ${gradeColor(getGrade(r.avg))}`} style={{ fontSize: "11px", fontWeight: 700 }}>{getGrade(r.avg)}</span>
                      </td>
                      <td className="px-3 py-3">
                        {transcriptData[r.id] && (
                          <button
                            onClick={() => { setSelectedStudentId(r.id); setView("transcript"); }}
                            className="flex items-center gap-1 px-2 py-1 text-[#1B6B8A] hover:bg-[#E8F4F8] rounded"
                            style={{ fontSize: "11px" }}
                          >
                            <FileText className="w-3.5 h-3.5" /> Transcript
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transcript View - Figma Style */}
      {activeTab === "Class Records" && view === "transcript" && selectedTranscript && (
        <div className="space-y-0">
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F4F8] text-[#1B6B8A] rounded-lg" style={{ fontSize: "12px" }}>
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg" style={{ fontSize: "12px" }}>
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>

          {/* Sub Navigation (Figma-style tabs) */}
          <div className="bg-white flex gap-2 items-end rounded-tl-[24px] rounded-tr-[24px] border border-border border-b-0">
            {["Overview", "Academic History", "Transcript", "Report Cards", "Documents"].map((tab, i) => (
              <div key={tab} className={`flex items-center px-6 py-8 relative shrink-0 ${tab === "Transcript" ? "" : "cursor-pointer"}`}>
                {tab === "Transcript" && <div className="absolute inset-0 border-b-3 border-[#216388]" />}
                <p className={`whitespace-nowrap relative ${tab === "Transcript" ? "text-[#216388]" : "text-[#5d5c5c]"}`}
                  style={{ fontSize: "16px", fontWeight: tab === "Transcript" ? 600 : 500 }}>
                  {tab}
                </p>
              </div>
            ))}
          </div>

          {/* Student Info Bar */}
          <div className="bg-white border border-border border-t-0 border-b px-6 py-5">
            <div className="flex gap-12 lg:gap-24 items-center flex-wrap">
              <div className="flex flex-col gap-1.5">
                <p className="text-[#666668]" style={{ fontSize: "14px" }}>Student Name</p>
                <p className="text-black" style={{ fontSize: "18px", fontWeight: 600 }}>{selectedTranscript.name}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[#666668]" style={{ fontSize: "14px" }}>Student ID</p>
                <p className="text-black" style={{ fontSize: "18px", fontWeight: 600 }}>{selectedTranscript.id}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[#666668]" style={{ fontSize: "14px" }}>Current Class</p>
                <p className="text-black" style={{ fontSize: "18px", fontWeight: 600 }}>{selectedTranscript.currentClass}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[#666668]" style={{ fontSize: "14px" }}>Cumulative Average</p>
                <p className="text-[#216388]" style={{ fontSize: "18px", fontWeight: 600 }}>{selectedTranscript.cumulativeAvg}%</p>
              </div>
            </div>
          </div>

          {/* Official Transcript header */}
          <div className="bg-white border-l border-r border-b border-[#dcdee1] px-6 py-5">
            <p style={{ fontSize: "20px", fontWeight: 500 }}>Official Transcript</p>
            <p className="text-[#5d5c5c]" style={{ fontSize: "14px" }}>Cumulative academic record</p>
          </div>

          {/* Term Tables */}
          {selectedTranscript.terms.map((term, termIdx) => (
            <div key={termIdx} className="flex flex-col">
              {/* Table Header */}
              <div className="bg-white border-l border-r border-b border-[#dcdee1] px-6 py-4">
                <p className="text-[#666668] uppercase" style={{ fontSize: "12px", fontWeight: 700 }}>{term.session} &mdash; {term.class} ({term.term})</p>
                <div className="flex items-center mt-3">
                  <p className="text-[#666668] uppercase w-[220px]" style={{ fontSize: "14px", fontWeight: 500 }}>Subject</p>
                  <p className="text-[#666668] uppercase w-[220px]" style={{ fontSize: "14px", fontWeight: 500 }}>Teacher</p>
                  <p className="text-[#666668] uppercase w-[180px]" style={{ fontSize: "14px", fontWeight: 500 }}>Score</p>
                  <p className="text-[#666668] uppercase" style={{ fontSize: "14px", fontWeight: 500 }}>Grade</p>
                </div>
              </div>

              {/* Subject Rows */}
              {term.subjects.map((subj, si) => (
                <div key={si} className="bg-white border-l border-r border-[#dcdee1] px-6 py-5 border-t border-t-[#dcdee1]">
                  <div className="flex items-center">
                    <p className="w-[220px] text-black" style={{ fontSize: "15px", fontWeight: 500 }}>{subj.name}</p>
                    <p className="w-[220px] text-[#666668]" style={{ fontSize: "15px" }}>{subj.teacher}</p>
                    <p className="w-[180px] text-[#666668]" style={{ fontSize: "15px" }}>{subj.score}%</p>
                    <div className={`w-10 h-[31px] rounded-[5px] flex items-center justify-center ${gradeColor(subj.grade)}`}>
                      <span style={{ fontSize: "16px", fontWeight: 700 }}>{subj.grade}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Term Summary */}
              <div className="bg-white border border-[#dcdee1] px-6 py-3.5 flex items-center justify-between">
                <p className="text-[#666668]" style={{ fontSize: "14px", fontWeight: 500 }}>Term Average</p>
                <p className="text-[#216388]" style={{ fontSize: "14px", fontWeight: 600 }}>{term.avgScore}%  |  Position: {term.position}  |  Pass Rate: {term.passRate}%</p>
              </div>
            </div>
          ))}

          {/* Cumulative Summary */}
          <div className="bg-[rgba(33,99,136,0.05)] border border-[#dcdee1] rounded-bl-[24px] rounded-br-[24px] px-6 py-5 flex items-center justify-between">
            <p className="text-[#216388]" style={{ fontSize: "16px", fontWeight: 500 }}>Cumulative Average</p>
            <p className="text-[#216388]" style={{ fontSize: "20px", fontWeight: 600 }}>{selectedTranscript.cumulativeAvg}%</p>
          </div>
        </div>
      )}

      {/* Transcripts Tab - Student Search */}
      {activeTab === "Transcripts" && view === "classes" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-3">Generate Student Transcript</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>Search for a student to generate their academic transcript across all sessions.</p>
            <div className="flex gap-3">
              <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input type="text" value={transcriptSearch} onChange={(e) => setTranscriptSearch(e.target.value)} placeholder="Enter student name or ID..." className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-3">Available Transcripts</h3>
            <div className="space-y-2">
              {Object.values(transcriptData)
                .filter((s) => s.name.toLowerCase().includes(transcriptSearch.toLowerCase()) || s.id.toLowerCase().includes(transcriptSearch.toLowerCase()))
                .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg hover:bg-[#E8F4F8] cursor-pointer transition-colors"
                  onClick={() => { setSelectedStudentId(student.id); setView("transcript"); setActiveTab("Class Records"); }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                      <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{student.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500 }}>{student.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{student.id} &middot; {student.currentClass} &middot; {student.terms.length} terms on record</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[#216388]" style={{ fontSize: "16px", fontWeight: 700 }}>{student.cumulativeAvg}%</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Cumulative Avg</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
