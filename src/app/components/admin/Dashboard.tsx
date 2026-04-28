import { useState } from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Clock,
  FileCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { generateAcademicSessions, terms } from "../../utils/academicSessions";

const stats = [
  { label: "Total Students", value: "0", change: "0%", icon: Users, color: "#1B6B8A", bg: "#E8F4F8", up: false },
  { label: "Total Teachers", value: "0", change: "0%", icon: GraduationCap, color: "#22C55E", bg: "#ECFDF5", up: false },
  { label: "Total Parents", value: "0", change: "0%", icon: UserCheck, color: "#F59E0B", bg: "#FEF9C3", up: false },
  { label: "Total Classes", value: "0", change: "0%", icon: BookOpen, color: "#8B5CF6", bg: "#F3E8FF", up: false },
];

const enrollmentData: { id: string; month: string; students: number }[] = [];

const attendanceData: { id: string; name: string; value: number; color: string }[] = [];

const performanceData: { id: string; subject: string; avg: number }[] = [];

const pendingApprovals: { type: string; subject: string; teacher: string; date: string; priority: string }[] = [];

const recentActivities: { action: string; name: string; time: string }[] = [];

const upcomingEvents: { title: string; date: string; time: string }[] = [];

export function Dashboard() {
  const [session, setSession] = useState("2025/2026");
  const [term, setTerm] = useState("Second Term");

  return (
    <div className="space-y-6">
      {/* Session/Term Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl border border-border shadow-sm px-5 py-3">
        <div>
          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Current Academic Session</p>
          <p style={{ fontSize: "15px", fontWeight: 600 }} className="text-[#1B6B8A]">{session} &middot; {term}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
            style={{ fontSize: "13px" }}
          >
            {generateAcademicSessions().map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]"
            style={{ fontSize: "13px" }}
          >
            {terms.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{stat.label}</p>
                <h2 className="mt-1" style={{ fontSize: "28px", fontWeight: 700 }}>{stat.value}</h2>
                <div className="flex items-center gap-1 mt-2">
                  {stat.up ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span className={stat.up ? "text-green-500" : "text-gray-400"} style={{ fontSize: "12px" }}>
                    {stat.change} from last session
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals Banner */}
      <div className="bg-gradient-to-r from-[#1B6B8A] to-[#2A8BAD] rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5" />
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Pending Approvals</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white" style={{ fontSize: "12px" }}>{pendingApprovals.length} pending</span>
          </div>
          <a href="/approvals" className="text-white/80 hover:text-white underline" style={{ fontSize: "13px" }}>View All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pendingApprovals.slice(0, 3).map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded bg-white/20" style={{ fontSize: "10px" }}>{item.type}</span>
                <span className={`px-2 py-0.5 rounded-full ${item.priority === "High" ? "bg-red-400/30" : item.priority === "Medium" ? "bg-yellow-400/30" : "bg-green-400/30"}`} style={{ fontSize: "10px" }}>{item.priority}</span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: 500 }}>{item.subject}</p>
              <p className="text-white/70" style={{ fontSize: "11px" }}>{item.teacher}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Student Enrollment Trend</h3>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Monthly enrollment for {session}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#1B6B8A" strokeWidth={2.5} dot={{ r: 4, fill: "#1B6B8A" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Today's Attendance</h3>
          <p className="text-muted-foreground mb-2" style={{ fontSize: "13px" }}>Overall attendance rate</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {attendanceData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span style={{ fontSize: "12px" }}>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance + Events + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-border shadow-sm">
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Average Subject Performance</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>Class average for {term} - {session}</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avg" fill="#1B6B8A" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Upcoming Events</h3>
            <ArrowUpRight className="w-4 h-4 text-[#1B6B8A] cursor-pointer" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-lg bg-[#E8F4F8] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#1B6B8A]" />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{event.date}</span>
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>&middot; {event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Recent Activity</h3>
          <button className="text-[#1B6B8A]" style={{ fontSize: "13px" }}>View All</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#1B6B8A]" />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>{activity.action}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{activity.name}</p>
                </div>
              </div>
              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}