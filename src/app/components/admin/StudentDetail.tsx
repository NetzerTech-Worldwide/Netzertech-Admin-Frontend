import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Download,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const studentData: Record<string, any> = {};

const tabs = ["Overview", "Academics", "Attendance", "Fee History"];

export function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const student = studentData[id || "STU001"] || studentData["STU001"];

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/students")}
        className="flex items-center gap-2 text-[#1B6B8A] hover:underline"
        style={{ fontSize: "13px" }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1B6B8A] flex items-center justify-center shrink-0">
            <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>
              {student.name.split(" ").map((n: string) => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 600 }}>{student.name}</h2>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                  {student.id} &middot; {student.class} &middot; {student.gender}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700" style={{ fontSize: "12px", fontWeight: 500 }}>
                  {student.status}
                </span>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg" style={{ fontSize: "12px" }}>
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span style={{ fontSize: "13px" }}>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span style={{ fontSize: "13px" }}>DOB: {student.dob}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span style={{ fontSize: "13px" }}>Admitted: {student.admission}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border shadow-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab ? "bg-[#1B6B8A] text-white" : "hover:bg-gray-50"
            }`}
            style={{ fontSize: "13px" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Personal Information</h3>
            <div className="space-y-3">
              {[
                ["Full Name", student.name],
                ["Student ID", student.id],
                ["Class", student.class],
                ["Gender", student.gender],
                ["Age", `${student.age} years`],
                ["Date of Birth", student.dob],
                ["Address", student.address],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Parent/Guardian</h3>
            <div className="space-y-3">
              {[
                ["Name", student.parent],
                ["Phone", student.parentPhone],
                ["Email", student.parentEmail],
                ["Relationship", "Father"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mt-6 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#E8F4F8] rounded-lg">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-[#1B6B8A]">{student.attendance.present}%</p>
                <p style={{ fontSize: "11px" }} className="text-muted-foreground">Attendance</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-green-600">B+</p>
                <p style={{ fontSize: "11px" }} className="text-muted-foreground">Avg Grade</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-yellow-600">78%</p>
                <p style={{ fontSize: "11px" }} className="text-muted-foreground">Fees Paid</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Academics" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={student.subjects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#1B6B8A" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-border">
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Subject</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Score</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Grade</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Remark</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((sub: any) => (
                  <tr key={sub.name} className="border-b border-border">
                    <td className="px-4 py-3" style={{ fontSize: "13px" }}>{sub.name}</td>
                    <td className="px-4 py-3" style={{ fontSize: "13px" }}>{sub.score}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full ${sub.grade === "A" ? "bg-green-50 text-green-700" : sub.grade === "B" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"}`} style={{ fontSize: "12px" }}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: "13px" }}>
                      {sub.score >= 80 ? "Excellent" : sub.score >= 70 ? "Good" : "Average"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[
            { label: "Present", value: student.attendance.present, color: "#22C55E", bg: "#ECFDF5" },
            { label: "Absent", value: student.attendance.absent, color: "#EF4444", bg: "#FEF2F2" },
            { label: "Late", value: student.attendance.late, color: "#F59E0B", bg: "#FEF9C3" },
            { label: "Total Days", value: student.attendance.total, color: "#1B6B8A", bg: "#E8F4F8" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-border shadow-sm p-5 text-center">
              <p style={{ fontSize: "28px", fontWeight: 700, color: item.color }}>{item.value}{item.label !== "Total Days" ? "%" : ""}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Fee History" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Total Fees</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>&#8358;{student.fees.total.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Amount Paid</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">&#8358;{student.fees.paid.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Balance</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-red-500">&#8358;{student.fees.balance.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-border">
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Date</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Description</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Amount</th>
                  <th className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "Jan 15, 2026", desc: "Tuition Fee - 2nd Term", amount: 200000, status: "Paid" },
                  { date: "Sep 10, 2025", desc: "Tuition Fee - 1st Term", amount: 150000, status: "Paid" },
                  { date: "Mar 01, 2026", desc: "Tuition Fee - 3rd Term", amount: 100000, status: "Pending" },
                ].map((fee, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3" style={{ fontSize: "13px" }}>{fee.date}</td>
                    <td className="px-4 py-3" style={{ fontSize: "13px" }}>{fee.desc}</td>
                    <td className="px-4 py-3" style={{ fontSize: "13px" }}>&#8358;{fee.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full ${fee.status === "Paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
