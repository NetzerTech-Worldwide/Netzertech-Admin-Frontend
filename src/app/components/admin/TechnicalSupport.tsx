import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle, Clock, X, Eye, MessageSquare, Mail, Send, Laptop, Wifi, Database, Monitor } from "lucide-react";
import { api } from "../../utils/api";

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketPriority = "Critical" | "High" | "Medium" | "Low";
type TicketCategory = "Hardware" | "Software" | "Network" | "Portal Access" | "Data Issue" | "Other";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  reportedBy: string;
  reporterType: "Student" | "Teacher" | "Staff" | "Parent";
  reporterEmail: string;
  reportedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
  notes: string[];
}

const initialTickets: SupportTicket[] = [];

const categoryIcons: Record<TicketCategory, any> = {
  Hardware: Monitor,
  Software: Laptop,
  Network: Wifi,
  "Portal Access": Database,
  "Data Issue": Database,
  Other: AlertCircle,
};

export function TechnicalSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TicketStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | TicketCategory>("All");
  const [showDetailModal, setShowDetailModal] = useState<any | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<any | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await api.get('/support/tickets');
      setTickets((Array.isArray(data) ? data : []).map((t: any) => ({
        ...t,
        id: t.ticketId,
        title: t.subject,
        priority: t.priority || "Medium",
        reportedBy: t.user?.fullName || "Student",
        reporterEmail: t.user?.email || "",
        reportedDate: new Date(t.createdAt).toLocaleDateString(),
        notes: []
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchCategory = categoryFilter === "All" || t.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const criticalCount = tickets.filter((t) => t.priority === "Critical" && t.status !== "Resolved" && t.status !== "Closed").length;

  const statusColor = (status: TicketStatus) => {
    switch (status) {
      case "Open": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved": return "bg-green-50 text-green-700 border-green-200";
      case "Closed": return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const priorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-red-50 text-red-700";
      case "Medium": return "bg-yellow-50 text-yellow-700";
      case "Low": return "bg-blue-50 text-blue-700";
    }
  };

  const handleStatusChange = (id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, resolvedDate: newStatus === "Resolved" ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined }
          : t
      )
    );
  };

  const handleAddNote = (id: string) => {
    if (!newNote.trim()) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, notes: [...t.notes, newNote] } : t
      )
    );
    setNewNote("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Technical Support</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage and resolve technical issues and support tickets</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Open Tickets</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{openCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>In Progress</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-blue-600">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Resolved</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">{resolvedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Critical Issues</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-red-600">{criticalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none flex-1"
            style={{ fontSize: "13px" }}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | TicketStatus)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as "All" | TicketCategory)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Portal Access">Portal Access</option>
            <option value="Data Issue">Data Issue</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>No support tickets found</p>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Adjust your filters to see more results</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const CategoryIcon = categoryIcons[ticket.category];
            return (
              <div key={ticket.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center shrink-0">
                      <CategoryIcon className="w-6 h-6 text-[#1B6B8A]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{ticket.title}</h4>
                        <span className={`px-2 py-0.5 rounded ${priorityColor(ticket.priority)}`} style={{ fontSize: "10px", fontWeight: 600 }}>{ticket.priority}</span>
                        <span className={`px-2.5 py-0.5 rounded-full border ${statusColor(ticket.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{ticket.status}</span>
                      </div>
                      <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>
                        {ticket.category} • {ticket.id}
                      </p>
                      <p style={{ fontSize: "13px" }} className="mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Reported by: {ticket.reportedBy}</span>
                        <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Date: {ticket.reportedDate}</span>
                        {ticket.assignedTo && <span className="text-[#1B6B8A]" style={{ fontSize: "11px" }}>Assigned: {ticket.assignedTo}</span>}
                        {ticket.resolvedDate && <span className="text-green-600" style={{ fontSize: "11px" }}>Resolved: {ticket.resolvedDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setShowDetailModal(ticket)} className="p-2 rounded-lg hover:bg-gray-100">
                      <Eye className="w-4 h-4 text-[#1B6B8A]" />
                    </button>
                    <button onClick={() => setShowEmailModal(ticket)} className="p-2 rounded-lg hover:bg-gray-100">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </button>
                    {ticket.status === "Open" && (
                      <button onClick={() => handleStatusChange(ticket.id, "In Progress")} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600" style={{ fontSize: "12px" }}>
                        Start Work
                      </button>
                    )}
                    {ticket.status === "In Progress" && (
                      <button onClick={() => handleStatusChange(ticket.id, "Resolved")} className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600" style={{ fontSize: "12px" }}>
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Ticket Details</h3>
              <button onClick={() => setShowDetailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full border ${statusColor(showDetailModal.status)}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                  {showDetailModal.status}
                </span>
                <span className={`px-2 py-0.5 rounded ${priorityColor(showDetailModal.priority)}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                  {showDetailModal.priority} Priority
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>
                  {showDetailModal.category}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Ticket ID</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{showDetailModal.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Title</p>
                <p style={{ fontSize: "15px", fontWeight: 600 }}>{showDetailModal.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Description</p>
                <p style={{ fontSize: "14px" }} className="mt-1">{showDetailModal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Reported By</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.reportedBy}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{showDetailModal.reporterEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Reported Date</p>
                  <p style={{ fontSize: "14px" }}>{showDetailModal.reportedDate}</p>
                </div>
              </div>
              {showDetailModal.assignedTo && (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Assigned To</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.assignedTo}</p>
                </div>
              )}
              {showDetailModal.resolvedDate && (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Resolved Date</p>
                  <p style={{ fontSize: "14px" }} className="text-green-600">{showDetailModal.resolvedDate}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>Notes & Updates</p>
                {showDetailModal.notes.length === 0 ? (
                  <p className="text-muted-foreground italic" style={{ fontSize: "13px" }}>No notes yet</p>
                ) : (
                  <div className="space-y-2">
                    {(Array.isArray(showDetailModal.notes) ? showDetailModal.notes : []).map((note, i) => (
                      <div key={i} className="p-3 bg-[#F5F7FA] rounded-lg border border-border">
                        <p style={{ fontSize: "13px" }}>{note}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-white"
                    style={{ fontSize: "13px" }}
                  />
                  <button onClick={() => handleAddNote(showDetailModal.id)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                    <MessageSquare className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              {showDetailModal.status === "Open" && (
                <button onClick={() => { handleStatusChange(showDetailModal.id, "In Progress"); setShowDetailModal(null); }} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600" style={{ fontSize: "13px" }}>
                  Start Work
                </button>
              )}
              {showDetailModal.status === "In Progress" && (
                <button onClick={() => { handleStatusChange(showDetailModal.id, "Resolved"); setShowDetailModal(null); }} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600" style={{ fontSize: "13px" }}>
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Send Email Update</h3>
              <button onClick={() => setShowEmailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>To</label>
                <input type="email" value={showEmailModal.reporterEmail} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject</label>
                <input type="text" defaultValue={`Support Ticket ${showEmailModal.id} - Update`} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Message</label>
                <textarea rows={6} defaultValue={`Dear ${showEmailModal.reportedBy.split(" ")[0]},\n\nThank you for reporting the technical issue. Your support ticket (${showEmailModal.id}) regarding "${showEmailModal.title}" is currently ${showEmailModal.status.toLowerCase()}.\n\nWe are working to resolve this as quickly as possible.\n\nBest regards,\nNetzerTech IT Support`} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEmailModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEmailModal(null)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                <Send className="w-4 h-4" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
