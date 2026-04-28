import { useState } from "react";
import {
  Plus, Search, Edit, Trash2, Eye, X, Calendar, Clock,
  MapPin, Users, CheckCircle, AlertCircle, CalendarDays,
} from "lucide-react";

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  endDate?: string;
  venue: string;
  organizer: string;
  targetAudience: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "Draft";
  attendees?: number;
  budget?: number;
}

const initialEvents: SchoolEvent[] = [];

const eventTypes = ["All", "Sports", "Meeting", "Academic", "Cultural", "Workshop", "Ceremony", "Examination", "Training"];

const statusColor = (s: string) => {
  switch (s) {
    case "Upcoming": return "bg-blue-50 text-blue-700";
    case "Ongoing": return "bg-green-50 text-green-700";
    case "Completed": return "bg-gray-100 text-gray-600";
    case "Cancelled": return "bg-red-50 text-red-700";
    case "Draft": return "bg-yellow-50 text-yellow-700";
    default: return "bg-gray-50 text-gray-700";
  }
};

const typeColor = (t: string) => {
  switch (t) {
    case "Sports": return "bg-orange-50 text-orange-700";
    case "Meeting": return "bg-purple-50 text-purple-700";
    case "Academic": return "bg-blue-50 text-blue-700";
    case "Cultural": return "bg-pink-50 text-pink-700";
    case "Workshop": return "bg-teal-50 text-teal-700";
    case "Ceremony": return "bg-amber-50 text-amber-700";
    case "Examination": return "bg-red-50 text-red-700";
    case "Training": return "bg-cyan-50 text-cyan-700";
    default: return "bg-gray-50 text-gray-700";
  }
};

export function EventSetup() {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<SchoolEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState<SchoolEvent | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "All" || e.type === typeFilter;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const upcoming = events.filter(e => e.status === "Upcoming").length;
  const completed = events.filter(e => e.status === "Completed").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Event Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Create, schedule, and manage school events</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: events.length, color: "#1B6B8A", icon: CalendarDays },
          { label: "Upcoming", value: upcoming, color: "#3B82F6", icon: Clock },
          { label: "Completed", value: completed, color: "#22C55E", icon: CheckCircle },
          { label: "Draft", value: events.filter(e => e.status === "Draft").length, color: "#F59E0B", icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.label}</p>
              <p style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
          {eventTypes.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
          <option value="All">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Draft">Draft</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDetailModal(event)}>
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-0.5 rounded-full ${typeColor(event.type)}`} style={{ fontSize: "10px", fontWeight: 600 }}>{event.type}</span>
              <span className={`px-2 py-0.5 rounded-full ${statusColor(event.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{event.status}</span>
            </div>
            <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-1">{event.title}</h4>
            <p className="text-muted-foreground mb-3" style={{ fontSize: "12px", lineHeight: 1.4 }}>{event.description.length > 80 ? event.description.substring(0, 80) + "..." : event.description}</p>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span style={{ fontSize: "12px" }}>{event.date}{event.endDate && event.endDate !== event.date ? ` - ${event.endDate}` : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span style={{ fontSize: "12px" }}>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span style={{ fontSize: "12px" }}>{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span style={{ fontSize: "11px" }}>{event.targetAudience}</span>
              </div>
              {event.attendees && (
                <span className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 500 }}>{event.attendees} expected</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p style={{ fontSize: "14px", fontWeight: 500 }}>No events found</p>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Try adjusting your filters or create a new event</p>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Event Details</h3>
              <button onClick={() => setShowDetailModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full ${typeColor(showDetailModal.type)}`} style={{ fontSize: "11px", fontWeight: 600 }}>{showDetailModal.type}</span>
                <span className={`px-2.5 py-1 rounded-full ${statusColor(showDetailModal.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{showDetailModal.status}</span>
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: 600 }} className="mb-2">{showDetailModal.title}</h4>
              <p className="text-muted-foreground mb-4" style={{ fontSize: "13px", lineHeight: 1.6 }}>{showDetailModal.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                  <Calendar className="w-4 h-4 text-[#1B6B8A]" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Date</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{showDetailModal.date}{showDetailModal.endDate && showDetailModal.endDate !== showDetailModal.date ? ` — ${showDetailModal.endDate}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                  <Clock className="w-4 h-4 text-[#1B6B8A]" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Time</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{showDetailModal.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                  <MapPin className="w-4 h-4 text-[#1B6B8A]" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Venue</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{showDetailModal.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                  <Users className="w-4 h-4 text-[#1B6B8A]" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Target Audience</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{showDetailModal.targetAudience}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#E8F4F8] rounded-lg text-center">
                  <p className="text-[#1B6B8A]" style={{ fontSize: "18px", fontWeight: 700 }}>{showDetailModal.attendees || "-"}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Expected Attendees</p>
                </div>
                <div className="p-3 bg-[#E8F4F8] rounded-lg text-center">
                  <p className="text-[#1B6B8A]" style={{ fontSize: "18px", fontWeight: 700 }}>{showDetailModal.budget ? `₦${(showDetailModal.budget / 1000).toFixed(0)}K` : "-"}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Budget</p>
                </div>
              </div>

              <p className="text-muted-foreground mt-4" style={{ fontSize: "12px" }}>Organized by: {showDetailModal.organizer}</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              {showDetailModal.status === "Draft" && (
                <button className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Publish Event</button>
              )}
              {showDetailModal.status === "Upcoming" && (
                <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600" style={{ fontSize: "13px" }}>Cancel Event</button>
              )}
              <button onClick={() => { setShowEditModal(showDetailModal); setShowDetailModal(null); }} className="p-2 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Create New Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Event Title</label>
                <input placeholder="e.g. Inter-House Sports Day" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Description</label>
                <textarea placeholder="Brief description of the event..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" rows={3} style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Event Type</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    {eventTypes.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Target Audience</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option>All Students</option>
                    <option>All Students & Staff</option>
                    <option>JSS Students</option>
                    <option>SS Students</option>
                    <option>JSS & SS Students</option>
                    <option>Parents & Teachers</option>
                    <option>All Staff</option>
                    <option>Parents, Students & Staff</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Start Date</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>End Date (optional)</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Start Time</label>
                  <input type="time" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Expected Attendees</label>
                  <input type="number" placeholder="0" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Venue</label>
                <input placeholder="e.g. School Hall" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Organizer</label>
                  <input placeholder="e.g. Sports Department" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Budget (₦)</label>
                  <input type="number" placeholder="0" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Save as Draft</button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Create & Publish</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Event</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Event Title</label>
                <input defaultValue={showEditModal.title} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Description</label>
                <textarea defaultValue={showEditModal.description} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" rows={3} style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Event Type</label>
                  <select defaultValue={showEditModal.type} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    {eventTypes.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Target Audience</label>
                  <select defaultValue={showEditModal.targetAudience} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option>All Students</option>
                    <option>All Students & Staff</option>
                    <option>JSS Students</option>
                    <option>SS Students</option>
                    <option>JSS & SS Students</option>
                    <option>Parents & Teachers</option>
                    <option>All Staff</option>
                    <option>Parents, Students & Staff</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Start Date</label>
                  <input type="date" defaultValue={showEditModal.date} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>End Date (optional)</label>
                  <input type="date" defaultValue={showEditModal.endDate || ""} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Start Time</label>
                  <input type="time" defaultValue={showEditModal.time} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Expected Attendees</label>
                  <input type="number" defaultValue={showEditModal.attendees || 0} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Venue</label>
                <input defaultValue={showEditModal.venue} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>Organizer</label>
                  <input defaultValue={showEditModal.organizer} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Budget (₦)</label>
                  <input type="number" defaultValue={showEditModal.budget || 0} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Status</label>
                <select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="Draft">Draft</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEditModal(null)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
