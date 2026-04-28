import { useState } from "react";
import { School, User, Bell, Shield, Palette, Database, Globe, Save } from "lucide-react";

const tabs = [
  { id: "school", label: "School Profile", icon: School },
  { id: "admin", label: "Admin Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "academic", label: "Academic", icon: Database },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="space-y-4">
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Settings</h2>
        <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage school and admin settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar Tabs */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-3 lg:w-[240px] shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-[#E8F4F8] text-[#1B6B8A]" : "text-[#4a5568] hover:bg-gray-50"
                }`}
                style={{ fontSize: "13px" }}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "school" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-6">School Profile</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-xl bg-[#1B6B8A] flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>N</span>
                  </div>
                  <div>
                    <button className="px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg" style={{ fontSize: "12px" }}>Change Logo</button>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>PNG, JPG up to 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>School Name</label><input defaultValue="NetzerTech Secondary School" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>School Code</label><input defaultValue="NTS-2025" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
                <div><label style={{ fontSize: "13px" }}>Address</label><input defaultValue="15 Education Avenue, Lekki Phase 2, Lagos" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Phone</label><input defaultValue="+234 801 234 5678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Email</label><input defaultValue="admin@netzertech.school.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
                <div><label style={{ fontSize: "13px" }}>Website</label><input defaultValue="https://netzertech.school.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <div><label style={{ fontSize: "13px" }}>School Motto</label><input defaultValue="Versacore Providex" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-6">Admin Account</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>AD</span>
                  </div>
                  <div>
                    <button className="px-3 py-1.5 bg-[#E8F4F8] text-[#1B6B8A] rounded-lg" style={{ fontSize: "12px" }}>Change Photo</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Full Name</label><input defaultValue="Admin User" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Role</label><input defaultValue="Super Admin" disabled className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-gray-100" style={{ fontSize: "13px" }} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Email</label><input defaultValue="admin@netzertech.school.ng" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Phone</label><input defaultValue="+234 801 234 5678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                  <Save className="w-4 h-4" /> Update Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "New student enrollment", desc: "Notify when a new student is enrolled", default: true },
                  { label: "Fee payment received", desc: "Notify when a fee payment is received", default: true },
                  { label: "Attendance alerts", desc: "Notify for low attendance rates", default: true },
                  { label: "Exam results published", desc: "Notify when exam results are published", default: false },
                  { label: "Teacher leave requests", desc: "Notify for teacher leave applications", default: true },
                  { label: "System updates", desc: "Notify about system maintenance and updates", default: false },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{pref.label}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1B6B8A]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-6">Security Settings</h3>
              <div className="space-y-5">
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Change Password</h4>
                  <div className="space-y-3">
                    <div><label style={{ fontSize: "13px" }}>Current Password</label><input type="password" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                    <div><label style={{ fontSize: "13px" }}>New Password</label><input type="password" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                    <div><label style={{ fontSize: "13px" }}>Confirm Password</label><input type="password" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Update Password</button>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Two-Factor Authentication</h4>
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "13px" }}>Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-[#E8F4F8] text-[#1B6B8A] rounded-lg hover:bg-[#d0e8ef]" style={{ fontSize: "13px" }}>Enable 2FA</button>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Active Sessions</h4>
                  <div className="space-y-2">
                    {[
                      { device: "Chrome on Windows", location: "Lagos, Nigeria", time: "Active now", current: true },
                      { device: "Safari on iPhone", location: "Lagos, Nigeria", time: "2 hours ago", current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500 }}>
                            {session.device} {session.current && <span className="text-green-600">(Current)</span>}
                          </p>
                          <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{session.location} &middot; {session.time}</p>
                        </div>
                        {!session.current && (
                          <button className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg" style={{ fontSize: "12px" }}>Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-6">Academic Settings</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Current Academic Session</label><input defaultValue="2025/2026" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Current Term</label><select defaultValue="Second Term" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>First Term</option><option>Second Term</option><option>Third Term</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Term Start Date</label><input type="date" defaultValue="2026-01-06" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Term End Date</label><input type="date" defaultValue="2026-04-10" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label style={{ fontSize: "13px" }}>Number of Periods/Day</label><input type="number" defaultValue="7" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                  <div><label style={{ fontSize: "13px" }}>Period Duration (mins)</label><input type="number" defaultValue="45" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
                </div>
                <div><label style={{ fontSize: "13px" }}>Grading System</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>WAEC Standard (A-F)</option><option>Custom</option></select></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}