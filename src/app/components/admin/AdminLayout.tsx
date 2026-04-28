import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  School,
  CalendarCheck,
  ClipboardList,
  Calendar,
  DollarSign,
  Megaphone,
  FileCheck,
  FolderArchive,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  CalendarDays,
  CreditCard,
  HeadphonesIcon,
  UserCog,
  ChevronRight,
  BookMarked,
  Mail,
  Heart,
} from "lucide-react";
import { generateAcademicSessions, terms } from "../../utils/academicSessions";
import api from "../../utils/api";

const navSections = [
  {
    title: "",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    ]
  },
  {
    title: "User Management",
    items: [
      { to: "/students", icon: Users, label: "Students" },
      { to: "/teachers", icon: GraduationCap, label: "Teachers" },
      { to: "/parents", icon: UserCheck, label: "Parents" },
      { to: "/users", icon: UserCog, label: "User Accounts" },
    ]
  },
  {
    title: "Academics Management",
    items: [
      { to: "/classes", icon: School, label: "Classes" },
      { to: "/subjects", icon: BookOpen, label: "Subjects" },
      { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
      { to: "/examinations", icon: ClipboardList, label: "Examinations" },
      { to: "/timetable", icon: Calendar, label: "Timetable" },
      { to: "/records", icon: FolderArchive, label: "Academic Records" },
    ]
  },
  {
    title: "Financial Management",
    items: [
      { to: "/finance", icon: DollarSign, label: "Finance" },
    ]
  },
  {
    title: "Operations",
    items: [
      { to: "/approvals", icon: FileCheck, label: "Approvals" },
      { to: "/events", icon: CalendarDays, label: "Events" },
      { to: "/clubs", icon: Heart, label: "Clubs & Activities" },
      { to: "/id-cards", icon: CreditCard, label: "ID Cards" },
      { to: "/library", icon: BookMarked, label: "Library" },
      { to: "/announcements", icon: Megaphone, label: "Announcements" },
      { to: "/support", icon: HeadphonesIcon, label: "Technical Support" },
      { to: "/contact-forms", icon: Mail, label: "Contact Forms" },
    ]
  },
  {
    title: "Settings",
    items: [
      { to: "/settings", icon: Settings, label: "Settings" },
    ]
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState("2025/2026");
  const [currentTerm, setCurrentTerm] = useState("Second Term");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showSessionBanner, setShowSessionBanner] = useState(false);
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>([
    "User Management",
    "Academics Management",
    "Financial Management",
    "Operations",
    "Settings",
  ]);
  const [profile, setProfile] = useState<any>(() => {
    const cached = localStorage.getItem("admin_profile");
    return cached ? JSON.parse(cached) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setProfile(response);
        localStorage.setItem("admin_profile", JSON.stringify(response));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    navigate("/login");
  };

  // Extract school name from address if present (it's stored as "School Name (Size: Size)")
  const schoolDisplay = profile?.address ? profile.address.split(" (Size:")[0] : (profile ? "NetzerTech" : "");
  const adminName = profile?.fullName || (profile ? "Admin User" : "");
  const adminRole = profile?.department || (profile ? "Super Admin" : "");
  const logoLetter = schoolDisplay ? schoolDisplay.charAt(0).toUpperCase() : "N";

  // Regenerate available sessions when component mounts or session/term changes
  useEffect(() => {
    setAvailableSessions(generateAcademicSessions());
  }, [currentSession, currentTerm]);

  // Check if 3 months have passed since last session/term update
  useEffect(() => {
    const lastUpdateDate = localStorage.getItem("sessionTermLastUpdate");

    if (!lastUpdateDate) {
      // First time - show banner and set initial date
      setShowSessionBanner(true);
      localStorage.setItem("sessionTermLastUpdate", new Date().toISOString());
    } else {
      // Check if 3 months (90 days) have passed
      const lastUpdate = new Date(lastUpdateDate);
      const now = new Date();
      const daysPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysPassed >= 90) {
        setShowSessionBanner(true);
      }
    }

    // Load saved session/term if available
    const savedSession = localStorage.getItem("currentSession");
    const savedTerm = localStorage.getItem("currentTerm");
    if (savedSession) setCurrentSession(savedSession);
    if (savedTerm) setCurrentTerm(savedTerm);
  }, []);

  const handleUpdateSessionTerm = () => {
    // Save the new session/term
    localStorage.setItem("currentSession", currentSession);
    localStorage.setItem("currentTerm", currentTerm);
    // Update the last update date to now
    localStorage.setItem("sessionTermLastUpdate", new Date().toISOString());
    // Hide the banner
    setShowSessionBanner(false);
    // Close the modal
    setShowSessionModal(false);
    // Trigger session list regeneration
    setAvailableSessions(generateAcademicSessions());
  };

  const getLastUpdateInfo = () => {
    const lastUpdateDate = localStorage.getItem("sessionTermLastUpdate");
    if (!lastUpdateDate) return "Never updated";

    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    const monthsPassed = Math.floor(daysPassed / 30);

    if (daysPassed < 30) {
      return `Updated ${daysPassed} day${daysPassed !== 1 ? 's' : ''} ago`;
    } else if (monthsPassed < 3) {
      return `Updated ${monthsPassed} month${monthsPassed !== 1 ? 's' : ''} ago`;
    } else {
      return `Updated ${monthsPassed} months ago - Time to review!`;
    }
  };

  const getPageTitle = () => {
    const current = navSections.flatMap(section => section.items).find((item) => {
      if (item.to === "/") return location.pathname === "/";
      return location.pathname.startsWith(item.to);
    });
    return current?.label || "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
          <div className={`w-9 h-9 bg-[#1B6B8A] rounded-full flex items-center justify-center ${!profile ? 'animate-pulse' : ''}`}>
            <span className="text-white" style={{ fontSize: "14px", fontWeight: 700 }}>{logoLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            {profile ? (
              <>
                <h3 className="text-[#1B6B8A] truncate" style={{ fontSize: "15px", fontWeight: 700, lineHeight: "1.2" }}>{schoolDisplay}</h3>
                <p className="text-[#1B6B8A]/60" style={{ fontSize: "8px", fontWeight: 500, letterSpacing: "1px" }}>VERSACORE PROVIDEX</p>
              </>
            ) : (
              <div className="space-y-1 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-100 rounded w-16"></div>
              </div>
            )}
          </div>
          <button
            className="lg:hidden ml-auto p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {navSections.map((section, index) => (
            <div key={section.title || "dashboard"} className={index > 0 ? "mt-4" : ""}>
              {section.title ? (
                <>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-4 py-2 mb-1 text-[#666668] uppercase tracking-wide hover:bg-gray-50 rounded-lg transition-colors"
                    style={{ fontSize: "11px", fontWeight: 700 }}
                  >
                    <span>{section.title}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openSections.includes(section.title) ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openSections.includes(section.title) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {section.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-colors ${
                            isActive
                              ? "bg-[#E8F4F8] text-[#1B6B8A] border-l-3 border-[#1B6B8A]"
                              : "text-[#4a5568] hover:bg-gray-50"
                          }`
                        }
                      >
                        <item.icon className="w-[18px] h-[18px]" />
                        <span style={{ fontSize: "14px" }}>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : (
                // Dashboard - no collapsible header
                section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-colors ${
                        isActive
                          ? "bg-[#E8F4F8] text-[#1B6B8A] border-l-3 border-[#1B6B8A]"
                          : "text-[#4a5568] hover:bg-gray-50"
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span style={{ fontSize: "14px" }}>{item.label}</span>
                  </NavLink>
                ))
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#E8F4F8] text-[#1B6B8A] hover:bg-[#d0e8ef] transition-colors">
            <LogOut className="w-[18px] h-[18px]" />
            <span style={{ fontSize: "14px" }}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 600 }}>{getPageTitle()}</h1>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                School Admin Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Session/Term Selector */}
            <button
              onClick={() => setShowSessionModal(true)}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 bg-[#E8F4F8] border border-[#1B6B8A]/20 rounded-lg hover:bg-[#d0e8ef] transition-colors"
            >
              <CalendarDays className="w-3.5 md:w-4 h-3.5 md:h-4 text-[#1B6B8A]" />
              <div className="text-left hidden sm:block">
                <p className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>{currentSession}</p>
                <p className="text-[#1B6B8A]/70" style={{ fontSize: "10px" }}>{currentTerm}</p>
              </div>
              <div className="text-left sm:hidden">
                <p className="text-[#1B6B8A]" style={{ fontSize: "10px", fontWeight: 600 }}>{currentSession.split("/")[0]}</p>
              </div>
              <ChevronDown className="w-3 md:w-3.5 h-3 md:h-3.5 text-[#1B6B8A]" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-[#F5F7FA] rounded-full px-4 py-2 gap-2 w-[280px]">
              <input
                type="text"
                placeholder="Search anything here"
                className="bg-transparent border-none outline-none flex-1"
                style={{ fontSize: "13px" }}
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-[#4a5568]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className={`w-9 h-9 rounded-full bg-[#1B6B8A] flex items-center justify-center ${!profile ? 'animate-pulse' : ''}`}>
                <span className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>{adminName ? adminName.substring(0, 2).toUpperCase() : "??"}</span>
              </div>
              <div className="hidden sm:block min-w-[80px]">
                {profile ? (
                  <>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{adminName}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>
                      {adminRole}
                    </p>
                  </>
                ) : (
                  <div className="space-y-1 animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-2 bg-gray-100 rounded w-16"></div>
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Session/Term Reminder Banner */}
        {showSessionBanner && (
          <div className="bg-gradient-to-r from-[#1B6B8A] to-[#2c8aaf] text-white px-4 md:px-6 py-3 flex items-center justify-between gap-3 md:gap-4 shrink-0">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <CalendarDays className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
              <div className="min-w-0">
                <p style={{ fontSize: "12px", fontWeight: 600 }} className="md:text-[13px]">
                  <span className="hidden sm:inline">Current Academic Period: </span>
                  {currentSession} - {currentTerm}
                </p>
                <p style={{ fontSize: "10px", opacity: 0.9 }} className="hidden md:block md:text-[11px]">
                  {getLastUpdateInfo()} • New term starting? Click "Update" to change the session or term
                </p>
                <p style={{ fontSize: "10px", opacity: 0.9 }} className="md:hidden">
                  {getLastUpdateInfo()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-2 md:px-3 py-1.5 bg-white text-[#1B6B8A] rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                Update
              </button>
              <button
                onClick={() => setShowSessionBanner(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-3.5 md:w-4 h-3.5 md:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Session/Term Change Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Academic Session & Term</h3>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Update current session and term</p>
              </div>
              <button onClick={() => setShowSessionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-800" style={{ fontSize: "12px" }}>
                  <strong>Important:</strong> Changing the session/term will update it across all modules including Finance, Examinations, Timetable, and Attendance.
                </p>
                <p className="text-blue-700 mt-2" style={{ fontSize: "11px" }}>
                  ℹ️ {getLastUpdateInfo()}
                </p>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Current Session</label>
                <div className="mt-2 space-y-2">
                  {availableSessions.map((session) => (
                    <label
                      key={session}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentSession === session
                          ? "border-[#1B6B8A] bg-[#E8F4F8]"
                          : "border-border hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="session"
                        value={session}
                        checked={currentSession === session}
                        onChange={(e) => setCurrentSession(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{session}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Current Term</label>
                <div className="mt-2 space-y-2">
                  {terms.map((term) => (
                    <label
                      key={term}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentTerm === term
                          ? "border-[#1B6B8A] bg-[#E8F4F8]"
                          : "border-border hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="term"
                        value={term}
                        checked={currentTerm === term}
                        onChange={(e) => setCurrentTerm(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{term}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowSessionModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>
                Cancel
              </button>
              <button onClick={handleUpdateSessionTerm} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                Update Session & Term
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}