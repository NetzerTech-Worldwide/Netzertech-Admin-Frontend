import { useState, useEffect } from "react";
import {
  Search, Download, ChevronLeft, ChevronRight, Eye, School,
  Users, CheckCircle, XCircle, Clock, AlertCircle, X,
} from "lucide-react";
import { api } from "../../utils/api";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];


interface ClassAttendance {
  class: string;
  students: number;
  avgAttendance: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  classTeacher: string;
}

const classAttendanceData: ClassAttendance[] = [];

interface StudentAttendanceRecord {
  id: string;
  name: string;
  class: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

const classStudents: Record<string, StudentAttendanceRecord[]> = {};

// Generate calendar data for a student
function generateCalendarData(studentId: string, month: number, year: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const statuses = ["present", "present", "present", "present", "present", "present", "present", "present", "absent", "late", "present", "present", "excused", "present", "present"];
  const days: { day: number; status: string | null }[] = [];

  // Empty days for alignment
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, status: null });
  }

  // Seed based on studentId for consistent results
  const seed = parseInt(studentId.replace("STU", ""), 10);
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      days.push({ day: d, status: "weekend" });
    } else {
      const today = new Date();
      if (new Date(year, month, d) > today) {
        days.push({ day: d, status: "future" });
      } else {
        const idx = (seed * 7 + d * 3) % statuses.length;
        days.push({ day: d, status: statuses[idx] });
      }
    }
  }
  return days;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type View = "classes" | "students" | "detail";

export function Attendance() {
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("Second Term");
  const [classLevelFilter, setClassLevelFilter] = useState("All");
  const [view, setView] = useState<View>("classes");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceRecord | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(2); // March
  const [calendarYear, setCalendarYear] = useState(2026);
  const [searchTerm, setSearchTerm] = useState("");
  const [classAttendance, setClassAttendance] = useState<ClassAttendance[]>([]);
  const [studentRecords, setStudentRecords] = useState<Record<string, StudentAttendanceRecord[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassAttendance();
  }, []);

  const fetchClassAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/admin/classes/overview');
      setClassAttendance(data || []);
    } catch (err) {
      console.error('Error fetching class attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentAttendance = async (className: string) => {
    try {
      // For now we use the overview endpoint for classes, but we might need a specific students attendance endpoint
      // Mocking student data for now as specific attendance API might not be ready
      const mockStudents = [
        { id: "STU001", name: "Ayo Balogun", class: className, totalDays: 30, present: 28, absent: 1, late: 1, excused: 0, attendanceRate: 93 },
        { id: "STU002", name: "Simi Kosoko", class: className, totalDays: 30, present: 30, absent: 0, late: 0, excused: 0, attendanceRate: 100 },
      ];
      setStudentRecords(prev => ({ ...prev, [className]: mockStudents }));
    } catch (err) {
      console.error('Error fetching student attendance:', err);
    }
  };

  const filteredClasses = classAttendance.filter((cls) => {
    if (classLevelFilter === "All") return true;
    return cls.name.startsWith(classLevelFilter);
  });

  // ... (rest of helper functions)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {view !== "classes" && (
            <button onClick={handleBack} className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
              {view === "classes" ? "Attendance Records" : view === "students" ? `${selectedClass} — Attendance` : `${selectedStudent?.name} — Attendance`}
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
              {view === "classes" ? "View attendance records by class" : view === "students" ? "View student attendance records" : "Individual attendance calendar"}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Session/Term Filter */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
          {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
          {termsOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {view === "classes" && classAttendance.length > 0 && (
          <select value={classLevelFilter} onChange={(e) => setClassLevelFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
            <option value="All">All Classes</option>
            {/* Extract unique levels from classes */}
            {Array.from(new Set(classAttendance.map(c => c.name.split(' ')[0]))).sort().map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        )}
      </div>

      {/* Classes View */}
      {view === "classes" && (
        isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1B6B8A]" />
          </div>
        ) : classAttendance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.name}
                onClick={() => handleClassClick(cls.name)}
                className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center group-hover:bg-[#1B6B8A] transition-colors">
                      <span className="text-[#1B6B8A] group-hover:text-white transition-colors" style={{ fontSize: "14px", fontWeight: 700 }}>{cls.name}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>{cls.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.classTeacher || "No Teacher"}</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-300 group-hover:text-[#1B6B8A]" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{cls.totalStudents} students</span>
                  </div>
                  <span className={`${attendanceColor(cls.active / (cls.totalStudents || 1) * 100)}`} style={{ fontSize: "20px", fontWeight: 700 }}>
                    {Math.round(cls.active / (cls.totalStudents || 1) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${cls.active / (cls.totalStudents || 1) * 100}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-1.5 bg-green-50 rounded-lg">
                    <p className="text-green-600" style={{ fontSize: "12px", fontWeight: 600 }}>{cls.active}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "9px" }}>Active</p>
                  </div>
                  <div className="text-center p-1.5 bg-red-50 rounded-lg">
                    <p className="text-red-500" style={{ fontSize: "12px", fontWeight: 600 }}>{cls.suspended}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "9px" }}>Suspended</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-border py-20 text-center">
             <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No classes found</h3>
            <p className="text-muted-foreground mb-6">Create classes first to view attendance records</p>
            <button onClick={() => navigate("/classes")} className="px-6 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]">Go to Classes</button>
          </div>
        )
      )}

      {/* Students View */}
      {view === "students" && selectedClass && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Student ID", "Name", "Total Days", "Present", "Absent", "Late", "Excused", "Attendance Rate"].map((h) => (
                      <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(studentRecords[selectedClass] || [])
                    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-border hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                            <span className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>{student.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: "13px" }}>{student.totalDays}</td>
                      <td className="px-4 py-3"><span className="text-green-600" style={{ fontSize: "13px" }}>{student.present}</span></td>
                      <td className="px-4 py-3"><span className="text-red-500" style={{ fontSize: "13px" }}>{student.absent}</span></td>
                      <td className="px-4 py-3"><span className="text-yellow-600" style={{ fontSize: "13px" }}>{student.late}</span></td>
                      <td className="px-4 py-3"><span className="text-[#1B6B8A]" style={{ fontSize: "13px" }}>{student.excused}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${student.attendanceRate}%` }} />
                          </div>
                          <span className={attendanceColor(student.attendanceRate)} style={{ fontSize: "13px", fontWeight: 600 }}>{student.attendanceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail (Calendar) View */}
      {view === "detail" && selectedStudent && (
        <div className="space-y-4">
          {/* Student Info Bar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "16px", fontWeight: 600 }}>{selectedStudent.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: 600 }}>{selectedStudent.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{selectedStudent.id} &middot; {selectedStudent.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-green-600" style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStudent.present}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Present</p>
                </div>
                <div className="text-center">
                  <p className="text-red-500" style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStudent.absent}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-600" style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStudent.late}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Late</p>
                </div>
                <div className="text-center">
                  <p className="text-[#1B6B8A]" style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStudent.excused}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Excused</p>
                </div>
                <div className={`text-center px-4 py-2 rounded-xl border ${attendanceBg(selectedStudent.attendanceRate)}`}>
                  <p className={attendanceColor(selectedStudent.attendanceRate)} style={{ fontSize: "22px", fontWeight: 700 }}>{selectedStudent.attendanceRate}%</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Attendance Calendar</h3>
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
                <span style={{ fontSize: "14px", fontWeight: 600 }} className="min-w-[140px] text-center">{monthNames[calendarMonth]} {calendarYear}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center py-2">
                  <span className="text-muted-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center ${day.day === 0 ? "" : dayStatusColor(day.status)}`}
                  title={day.status ? day.status.charAt(0).toUpperCase() + day.status.slice(1) : ""}
                >
                  {day.day > 0 && (
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{day.day}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border justify-center flex-wrap">
              {[
                { label: "Present", color: "bg-green-500" },
                { label: "Absent", color: "bg-red-500" },
                { label: "Late", color: "bg-yellow-400" },
                { label: "Excused", color: "bg-[#1B6B8A]" },
                { label: "Weekend", color: "bg-gray-100 border border-gray-200" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}