import { useState, useEffect } from "react";
import { Search, Plus, Users, Calendar, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, X, Award, TrendingUp, Heart, MapPin, UserPlus, CalendarPlus, Megaphone } from "lucide-react";
import { api } from "../../utils/api";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];

type ClubStatus = "approved" | "pending" | "rejected";
type EventStatus = "Upcoming" | "Completed" | "Cancelled";

const categories = ["All", "Academic", "Arts", "Technology", "Service", "Language", "Sports"];

const statusColors: Record<string, string> = {
  "approved": "bg-green-50 text-green-700 border-green-200",
  "pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "rejected": "bg-red-50 text-red-600 border-red-200",
};

export function Clubs() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [view, setView] = useState<"clubs" | "events">("clubs");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState<ClubStatus | "All">("All");
  const [selectedSession, setSelectedSession] = useState("2025/2026");
  const [selectedTerm, setSelectedTerm] = useState("Second Term");
  const [selectedClub, setSelectedClub] = useState<any | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Form States
  const [newClubForm, setNewClubForm] = useState({ name: "", description: "", meetingDay: "", teacherAdvisor: "" });

  useEffect(() => {
    fetchClubs();
    fetchEvents();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await api.get('/student-life/clubs');
      setClubs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await api.get('/student-life/clubs/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClub = async () => {
    try {
      await api.post('/student-life/clubs', newClubForm);
      setShowAddClubModal(false);
      setNewClubForm({ name: "", description: "", meetingDay: "", teacherAdvisor: "" });
      fetchClubs(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveClub = async (id: string) => {
    // In a real implementation, you'd add an endpoint in backend like PATCH /student-life/clubs/:id/approve
    // For now, we mock the UI update since backend doesn't have an explicit approve endpoint yet
    setClubs(clubs.map(c => c.id === id ? { ...c, status: "approved" } : c));
    setShowClubModal(false);
  };

  const handleRejectClub = async (id: string) => {
    setClubs(clubs.map(c => c.id === id ? { ...c, status: "rejected" } : c));
    setShowClubModal(false);
  };

  const handleDeleteClub = async (id: string) => {
    setClubs(clubs.filter(c => c.id !== id));
    setShowClubModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setShowEventModal(false);
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || club.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalClubs: clubs.filter(c => c.status === "approved").length,
    totalMembers: clubs.reduce((sum, c) => sum + (c.memberCount || 0), 0),
    pendingApprovals: clubs.filter(c => c.status === "pending").length,
    upcomingEvents: events.length,
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Clubs & Activities</h1>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            Manage student clubs, approve proposals, and organize events
          </p>
        </div>
        <button
          onClick={() => view === "clubs" ? setShowAddClubModal(true) : setShowAddEventModal(true)}
          className="bg-[#1B6B8A] text-white px-4 py-2 rounded-lg hover:bg-[#155A73] transition-colors flex items-center gap-2"
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          {view === "clubs" ? "Add Club" : "Add Event"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Active Clubs</p>
              <p className="text-[#1B6B8A]" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.totalClubs}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#1B6B8A]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Total Members</p>
              <p className="text-green-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.totalMembers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Pending Approvals</p>
              <p className="text-yellow-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Upcoming Events</p>
              <p className="text-blue-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl border border-border p-1 shadow-sm inline-flex gap-1">
        <button
          onClick={() => setView("clubs")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            view === "clubs" ? "bg-[#1B6B8A] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          Clubs
        </button>
        <button
          onClick={() => setView("events")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            view === "events" ? "bg-[#1B6B8A] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          Events
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={view === "clubs" ? "Search clubs..." : "Search events..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none flex-1"
              style={{ fontSize: "13px" }}
            />
          </div>
          {view === "clubs" && (
            <>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ClubStatus | "All")}
                className="bg-[#F5F7FA] border-none rounded-lg px-3 py-2 outline-none"
                style={{ fontSize: "13px" }}
              >
                <option value="All">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Clubs View */}
      {view === "clubs" && (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-border">
                  {["Club Name", "Members", "Meeting Day", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredClubs.map((club) => (
                  <tr key={club.id} className="border-b border-border hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{club.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{club.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "13px" }}>{club.memberCount} members</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ fontSize: "13px" }}>{club.meetingDay}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md border ${statusColors[club.status]}`} style={{ fontSize: "11px", fontWeight: 600, textTransform: 'capitalize' }}>
                        {club.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelectedClub(club); setShowClubModal(true); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-[#1B6B8A]" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClubs.length === 0 && (
                   <tr>
                     <td colSpan={5} className="text-center py-6 text-gray-500">No clubs found</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events View */}
      {view === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{event.title}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{event.clubName}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span style={{ fontSize: "12px" }}>{event.date} ({event.startTime} - {event.endTime})</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span style={{ fontSize: "12px" }}>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
             <p className="text-center py-6 text-gray-500 col-span-2">No upcoming events found.</p>
          )}
        </div>
      )}

      {/* Add Club Modal */}
      {showAddClubModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
             <div className="flex items-center justify-between border-b pb-3">
               <h2 className="text-lg font-semibold">Create New Club</h2>
               <button onClick={() => setShowAddClubModal(false)}><X className="w-5 h-5" /></button>
             </div>
             
             <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">CLUB NAME</label>
                  <input type="text" className="w-full border rounded p-2 text-sm" value={newClubForm.name} onChange={e => setNewClubForm({...newClubForm, name: e.target.value})} placeholder="e.g. Robotics Club" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">DESCRIPTION</label>
                  <textarea className="w-full border rounded p-2 text-sm" value={newClubForm.description} onChange={e => setNewClubForm({...newClubForm, description: e.target.value})} placeholder="What does this club do?" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">MEETING DAY</label>
                  <input type="text" className="w-full border rounded p-2 text-sm" value={newClubForm.meetingDay} onChange={e => setNewClubForm({...newClubForm, meetingDay: e.target.value})} placeholder="e.g. Mondays" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">TEACHER ADVISOR (Optional)</label>
                  <input type="text" className="w-full border rounded p-2 text-sm" value={newClubForm.teacherAdvisor} onChange={e => setNewClubForm({...newClubForm, teacherAdvisor: e.target.value})} placeholder="e.g. Dr. Sarah Wilson" />
                </div>
             </div>

             <div className="pt-4 flex gap-2">
                <button onClick={handleCreateClub} className="bg-[#1B6B8A] text-white px-4 py-2 rounded-lg flex-1 font-semibold text-sm">Save Club</button>
             </div>
          </div>
        </div>
      )}

      {/* Club Detail Modal */}
      {showClubModal && selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Club Details</h2>
              <button onClick={() => setShowClubModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 700 }}>{selectedClub.name}</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selectedClub.id}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: "11px" }}>DESCRIPTION</p>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{selectedClub.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>STATUS</p>
                  <span className={`inline-block px-2 py-1 rounded-md border ${statusColors[selectedClub.status]}`} style={{ fontSize: "11px", fontWeight: 600, textTransform: 'capitalize' }}>
                    {selectedClub.status}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>MEMBERS</p>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{selectedClub.memberCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>MEETING DAY</p>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{selectedClub.meetingDay}</p>
                </div>
              </div>

              {selectedClub.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveClub(selectedClub.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Club
                  </button>
                  <button
                    onClick={() => handleRejectClub(selectedClub.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}

              {selectedClub.status !== "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteClub(selectedClub.id)}
                    className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Club
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
