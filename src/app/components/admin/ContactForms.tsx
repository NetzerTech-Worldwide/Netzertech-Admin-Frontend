import { useState } from "react";
import { Search, Mail, Phone, User, Calendar, Eye, MessageSquare, CheckCircle, XCircle, Clock, X, Send, Trash2, Archive } from "lucide-react";

type MessageStatus = "New" | "Read" | "Responded" | "Archived";
type MessagePriority = "High" | "Medium" | "Low";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedDate: string;
  status: MessageStatus;
  priority: MessagePriority;
  category: string;
  response?: string;
  respondedBy?: string;
  respondedDate?: string;
}

const initialSubmissions: ContactSubmission[] = [];

const statusColors = {
  "New": "bg-blue-50 text-blue-700 border-blue-200",
  "Read": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Responded": "bg-green-50 text-green-700 border-green-200",
  "Archived": "bg-gray-50 text-gray-600 border-gray-200",
};

const priorityColors = {
  "High": "bg-red-50 text-red-600 border-red-200",
  "Medium": "bg-yellow-50 text-yellow-600 border-yellow-200",
  "Low": "bg-blue-50 text-blue-600 border-blue-200",
};

export function ContactForms() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<MessageStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  const categories = ["All", "Admissions", "General Inquiry", "Partnership", "Extracurricular", "Complaint", "Scholarship", "Commendation"];

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || sub.status === filterStatus;
    const matchesCategory = filterCategory === "All" || sub.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    new: submissions.filter(s => s.status === "New").length,
    read: submissions.filter(s => s.status === "Read").length,
    responded: submissions.filter(s => s.status === "Responded").length,
    archived: submissions.filter(s => s.status === "Archived").length,
  };

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    if (submission.status === "New") {
      setSubmissions(submissions.map(s => s.id === submission.id ? { ...s, status: "Read" } : s));
    }
  };

  const handleRespond = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setResponseText("");
    setShowResponseModal(true);
  };

  const handleSendResponse = () => {
    if (selectedSubmission && responseText.trim()) {
      setSubmissions(submissions.map(s =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: "Responded",
              response: responseText,
              respondedBy: "Admin Team",
              respondedDate: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
            }
          : s
      ));
      setShowResponseModal(false);
      setShowDetailModal(false);
    }
  };

  const handleArchive = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: "Archived" } : s));
  };

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter(s => s.id !== id));
    setShowDetailModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Contact Form Submissions</h1>
        <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
          View and respond to messages from the public website contact form
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>New Messages</p>
              <p className="text-blue-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.new}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Read</p>
              <p className="text-yellow-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.read}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Responded</p>
              <p className="text-green-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.responded}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Archived</p>
              <p className="text-gray-600" style={{ fontSize: "24px", fontWeight: 700 }}>{stats.archived}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Archive className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none flex-1"
              style={{ fontSize: "13px" }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MessageStatus | "All")}
            className="bg-[#F5F7FA] border-none rounded-lg px-3 py-2 outline-none"
            style={{ fontSize: "13px" }}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Responded">Responded</option>
            <option value="Archived">Archived</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#F5F7FA] border-none rounded-lg px-3 py-2 outline-none"
            style={{ fontSize: "13px" }}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                {["ID", "Name", "Email", "Subject", "Category", "Priority", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3" style={{ fontSize: "13px", fontWeight: 600 }}>{submission.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#1B6B8A]" />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{submission.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{submission.email}</td>
                  <td className="px-4 py-3 max-w-xs truncate" style={{ fontSize: "13px" }}>{submission.subject}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded-md" style={{ fontSize: "11px" }}>{submission.category}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md border ${priorityColors[submission.priority]}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                      {submission.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{submission.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md border ${statusColors[submission.status]}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(submission)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-[#1B6B8A]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Message Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>FROM</p>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>EMAIL</p>
                  <p style={{ fontSize: "14px" }}>{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>PHONE</p>
                  <p style={{ fontSize: "14px" }}>{selectedSubmission.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>SUBMITTED</p>
                  <p style={{ fontSize: "14px" }}>{selectedSubmission.submittedDate}</p>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="flex gap-4">
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>STATUS</p>
                  <span className={`px-3 py-1.5 rounded-md border ${statusColors[selectedSubmission.status]}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                    {selectedSubmission.status}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>PRIORITY</p>
                  <span className={`px-3 py-1.5 rounded-md border ${priorityColors[selectedSubmission.priority]}`} style={{ fontSize: "12px", fontWeight: 600 }}>
                    {selectedSubmission.priority}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>CATEGORY</p>
                  <span className="px-3 py-1.5 rounded-md bg-gray-100" style={{ fontSize: "12px" }}>
                    {selectedSubmission.category}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>SUBJECT</p>
                <p style={{ fontSize: "16px", fontWeight: 600 }}>{selectedSubmission.subject}</p>
              </div>

              {/* Message */}
              <div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: "11px" }}>MESSAGE</p>
                <div className="bg-[#F5F7FA] rounded-lg p-4">
                  <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Response (if exists) */}
              {selectedSubmission.response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p style={{ fontSize: "12px", fontWeight: 600 }} className="text-green-700">Response Sent</p>
                  </div>
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "11px" }}>
                    By {selectedSubmission.respondedBy} on {selectedSubmission.respondedDate}
                  </p>
                  <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{selectedSubmission.response}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedSubmission.status !== "Responded" && (
                  <button
                    onClick={() => handleRespond(selectedSubmission)}
                    className="flex-1 bg-[#1B6B8A] text-white px-4 py-2.5 rounded-lg hover:bg-[#155A73] transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <Send className="w-4 h-4" />
                    Send Response
                  </button>
                )}
                {selectedSubmission.status !== "Archived" && (
                  <button
                    onClick={() => { handleArchive(selectedSubmission.id); setShowDetailModal(false); }}
                    className="flex-1 border border-border px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Send Response</h2>
              <button onClick={() => setShowResponseModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>TO</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{selectedSubmission.name} ({selectedSubmission.email})</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>REGARDING</p>
                <p style={{ fontSize: "14px" }}>{selectedSubmission.subject}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-2" style={{ fontSize: "11px" }}>YOUR RESPONSE</p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full border border-border rounded-lg p-3 min-h-[200px] outline-none focus:ring-2 focus:ring-[#1B6B8A]"
                  style={{ fontSize: "14px" }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className="flex-1 bg-[#1B6B8A] text-white px-4 py-2.5 rounded-lg hover:bg-[#155A73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  <Send className="w-4 h-4" />
                  Send Response
                </button>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2.5 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
