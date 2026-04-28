import { useState } from "react";
import { Plus, X, Printer, Edit, Save } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = [
  { time: "8:00 - 8:45", label: "Period 1" },
  { time: "8:45 - 9:30", label: "Period 2" },
  { time: "9:30 - 10:00", label: "Break" },
  { time: "10:00 - 10:45", label: "Period 3" },
  { time: "10:45 - 11:30", label: "Period 4" },
  { time: "11:30 - 12:15", label: "Period 5" },
  { time: "12:15 - 1:00", label: "Lunch" },
  { time: "1:00 - 1:45", label: "Period 6" },
  { time: "1:45 - 2:30", label: "Period 7" },
];

const allClasses = ["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"];
const allSubjects = ["Mathematics", "English", "Biology", "Physics", "Chemistry", "Geography", "F. Maths", "Civic Ed", "History", "Yoruba", "Igbo", "Hausa", "Computer Science", "Fine Art", "Music", "Sports", "PHE", "Basic Tech", "Home Econ"];
const allTeachers = ["Mr. Nwosu", "Mrs. Balogun", "Dr. Okeke", "Mrs. Suleiman", "Mr. Adesanya", "Mrs. Emenike", "Mr. Yusuf", "Mrs. Adeyemi", "Mr. Adamu", "Mr. Aderibigbe", "Mrs. Okafor", "Mr. Onwueme"];

const subjectColors: Record<string, string> = {
  "Mathematics": "#1B6B8A", "English": "#8B5CF6", "Biology": "#22C55E",
  "Physics": "#F59E0B", "Chemistry": "#EF4444", "F. Maths": "#06B6D4",
  "Geography": "#EC4899", "Civic Ed": "#14B8A6", "Sports": "#F97316",
  "History": "#6366F1", "Computer Science": "#0EA5E9", "Fine Art": "#A855F7",
  "PHE": "#F97316", "Music": "#D946EF", "Yoruba": "#84CC16",
  "Basic Tech": "#64748B", "Home Econ": "#FB923C",
};

const timetableData: Record<string, Record<string, Record<string, { subject: string; teacher: string; color: string }>>> = {};

export function Timetable() {
  const [selectedClass, setSelectedClass] = useState("SS 3A");
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ day: string; period: string } | null>(null);

  const classData = timetableData[selectedClass] || {};

  const handleSlotClick = (day: string, period: string) => {
    if (isEditing) {
      setEditingSlot({ day, period });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Timetable Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage class schedules and periods</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? "bg-green-600 text-white hover:bg-green-700" : "bg-white border border-border hover:bg-gray-50"}`}
            style={{ fontSize: "13px" }}
          >
            {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit className="w-4 h-4" /> Edit Timetable</>}
          </button>
          <button onClick={() => setShowAddPeriod(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
            <Plus className="w-4 h-4" /> Add Period
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
          <Edit className="w-4 h-4 text-yellow-600" />
          <p className="text-yellow-800" style={{ fontSize: "13px" }}>Edit mode: Click on any slot to modify it. Click "Save Changes" when done.</p>
        </div>
      )}

      {/* Class Selector */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-wrap gap-2">
        {allClasses.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedClass === cls ? "bg-[#1B6B8A] text-white" : "bg-[#F5F7FA] hover:bg-[#E8F4F8] text-[#4a5568]"
            }`}
            style={{ fontSize: "13px" }}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                <th className="text-left px-3 py-3 min-w-[100px]" style={{ fontSize: "12px", fontWeight: 600 }}>Time</th>
                {days.map((day) => (
                  <th key={day} className="text-left px-3 py-3 min-w-[140px]" style={{ fontSize: "12px", fontWeight: 600 }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const isBreak = period.label === "Break" || period.label === "Lunch";
                return (
                  <tr key={period.label} className={`border-b border-border ${isBreak ? "bg-gray-50" : ""}`}>
                    <td className="px-3 py-2">
                      <p style={{ fontSize: "12px", fontWeight: 500 }}>{period.label}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{period.time}</p>
                    </td>
                    {days.map((day) => {
                      if (isBreak) {
                        return (
                          <td key={day} className="px-3 py-2 text-center text-muted-foreground" style={{ fontSize: "12px" }}>
                            {period.label}
                          </td>
                        );
                      }
                      const slot = classData[day]?.[period.label];
                      return (
                        <td key={day} className="px-2 py-2">
                          {slot ? (
                            <div
                              className={`rounded-lg p-2 ${isEditing ? "cursor-pointer ring-1 ring-transparent hover:ring-[#1B6B8A]" : ""} hover:opacity-90 transition-opacity`}
                              style={{ backgroundColor: slot.color + "15", borderLeft: `3px solid ${slot.color}` }}
                              onClick={() => handleSlotClick(day, period.label)}
                            >
                              <p style={{ fontSize: "12px", fontWeight: 600, color: slot.color }}>{slot.subject}</p>
                              <p className="text-muted-foreground" style={{ fontSize: "10px" }}>{slot.teacher}</p>
                            </div>
                          ) : (
                            <div
                              className={`rounded-lg p-2 bg-gray-50 text-center ${isEditing ? "cursor-pointer hover:bg-[#E8F4F8]" : ""}`}
                              onClick={() => handleSlotClick(day, period.label)}
                            >
                              <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{isEditing ? "+ Add" : "Free"}</p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Period Modal */}
      {showAddPeriod && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add Period to Timetable</h3>
              <button onClick={() => setShowAddPeriod(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Class</label>
                <select defaultValue={selectedClass} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Day</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Period</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    {periods.filter(p => p.label !== "Break" && p.label !== "Lunch").map(p => <option key={p.label} value={p.label}>{p.label} ({p.time})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Subject</option>
                  {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Teacher</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Teacher</option>
                  {allTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Start Time</label>
                  <input type="time" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>End Time</label>
                  <input type="time" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddPeriod(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddPeriod(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Add Period</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Slot — {editingSlot.day}, {editingSlot.period}</h3>
              <button onClick={() => setEditingSlot(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Subject</label>
                <select defaultValue={classData[editingSlot.day]?.[editingSlot.period]?.subject || ""} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">-- Clear Slot --</option>
                  {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Teacher</label>
                <select defaultValue={classData[editingSlot.day]?.[editingSlot.period]?.teacher || ""} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Teacher</option>
                  {allTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setEditingSlot(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setEditingSlot(null)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}