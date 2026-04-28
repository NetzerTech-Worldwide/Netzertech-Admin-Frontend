import { useState } from "react";
import { Search, CreditCard, User, Clock, CheckCircle, X, Eye, Send, Mail } from "lucide-react";

type RequestStatus = "Pending" | "In Progress" | "Completed";
type RequestType = "New Student" | "New Teacher" | "Replacement" | "Staff";

interface IDCardRequest {
  id: string;
  requesterName: string;
  requesterType: "Student" | "Teacher" | "Staff";
  requestType: RequestType;
  class?: string;
  department?: string;
  reason: string;
  submittedDate: string;
  status: RequestStatus;
  priority: "High" | "Medium" | "Low";
  contactEmail: string;
  phone: string;
  photoAttached: boolean;
  completedDate?: string;
}

const initialRequests: IDCardRequest[] = [];

export function IDCardRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RequestStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | RequestType>("All");
  const [showDetailModal, setShowDetailModal] = useState<IDCardRequest | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<IDCardRequest | null>(null);
  const [showVendorModal, setShowVendorModal] = useState(false);

  const filteredRequests = requests.filter((r) => {
    const matchSearch = r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchType = typeFilter === "All" || r.requestType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const inProgressCount = requests.filter((r) => r.status === "In Progress").length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;

  const statusColor = (status: RequestStatus) => {
    switch (status) {
      case "Pending": return "bg-gray-50 text-gray-700";
      case "In Progress": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Completed": return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700";
      case "Medium": return "bg-yellow-50 text-yellow-700";
      case "Low": return "bg-blue-50 text-blue-700";
    }
  };

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: newStatus, completedDate: newStatus === "Completed" ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined }
          : r
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>ID Card Requests</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage ID card requests from students, teachers, and staff</p>
        </div>
        <button onClick={() => setShowVendorModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Send className="w-4 h-4" /> Send to Vendor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Pending</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>In Progress</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-amber-600">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Completed</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">{completedCount}</p>
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
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none flex-1"
            style={{ fontSize: "13px" }}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | RequestStatus)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "All" | RequestType)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "12px" }}>
            <option value="All">All Types</option>
            <option value="New Student">New Student</option>
            <option value="New Teacher">New Teacher</option>
            <option value="Replacement">Replacement</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>No ID card requests found</p>
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Adjust your filters to see more results</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-[#1B6B8A]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{request.requesterName}</h4>
                      <span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "10px", fontWeight: 600 }}>{request.requesterType}</span>
                      <span className={`px-2 py-0.5 rounded ${priorityColor(request.priority)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{request.priority}</span>
                      <span className={`px-2.5 py-0.5 rounded-full border ${statusColor(request.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{request.status}</span>
                    </div>
                    <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>
                      {request.requestType} {request.class && `• ${request.class}`} {request.department && `• ${request.department}`}
                    </p>
                    <p style={{ fontSize: "13px" }} className="mb-2">{request.reason}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Submitted: {request.submittedDate}</span>
                      {request.completedDate && <span className="text-green-600" style={{ fontSize: "11px" }}>Completed: {request.completedDate}</span>}
                      <span className="text-muted-foreground" style={{ fontSize: "11px" }}>ID: {request.id}</span>
                      {request.photoAttached && <span className="text-green-600" style={{ fontSize: "11px" }}>✓ Photo Attached</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setShowDetailModal(request)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Eye className="w-4 h-4 text-[#1B6B8A]" />
                  </button>
                  <button onClick={() => setShowEmailModal(request)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </button>
                  {request.status === "Pending" && (
                    <button onClick={() => handleStatusChange(request.id, "In Progress")} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600" style={{ fontSize: "12px" }}>
                      Start Processing
                    </button>
                  )}
                  {request.status === "In Progress" && (
                    <button onClick={() => handleStatusChange(request.id, "Completed")} className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600" style={{ fontSize: "12px" }}>
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Request Details</h3>
              <button onClick={() => setShowDetailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Request ID</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{showDetailModal.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Requester</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{showDetailModal.requesterName}</p>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{showDetailModal.requesterType}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Request Type</p>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.requestType}</p>
              </div>
              {showDetailModal.class && (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Class</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.class}</p>
                </div>
              )}
              {showDetailModal.department && (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Department</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{showDetailModal.department}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Reason</p>
                <p style={{ fontSize: "14px" }}>{showDetailModal.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Email</p>
                  <p style={{ fontSize: "13px" }}>{showDetailModal.contactEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Phone</p>
                  <p style={{ fontSize: "13px" }}>{showDetailModal.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Status</p>
                <span className={`inline-block px-2.5 py-1 rounded-full border ${statusColor(showDetailModal.status)}`} style={{ fontSize: "12px", fontWeight: 500 }}>
                  {showDetailModal.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Submitted</p>
                  <p style={{ fontSize: "13px" }}>{showDetailModal.submittedDate}</p>
                </div>
                {showDetailModal.completedDate && (
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Completed</p>
                    <p style={{ fontSize: "13px" }}>{showDetailModal.completedDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Send Email</h3>
              <button onClick={() => setShowEmailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>To</label>
                <input type="email" value={showEmailModal.contactEmail} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject</label>
                <input type="text" defaultValue={`ID Card Request ${showEmailModal.id} - Update`} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Message</label>
                <textarea rows={6} defaultValue={`Dear ${showEmailModal.requesterName},\n\nThis is to inform you that your ID card request (${showEmailModal.id}) is currently ${showEmailModal.status.toLowerCase()}.\n\nBest regards,\nNetzerTech Admin`} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
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

      {/* Send to Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Send ID Card Order to Vendor</h3>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Review the list of ID cards to be ordered</p>
              </div>
              <button onClick={() => setShowVendorModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Pending Requests</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }}>{requests.filter(r => r.status === "Pending").length}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>In Progress</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-amber-600">{requests.filter(r => r.status === "In Progress").length}</p>
                </div>
                <div className="p-4 bg-[#E8F4F8] rounded-lg">
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Total to Send</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-[#1B6B8A]">{requests.filter(r => r.status !== "Completed").length}</p>
                </div>
              </div>

              {/* Request List */}
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">ID Card Requests to be Sent</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {requests.filter(r => r.status !== "Completed").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p style={{ fontSize: "13px" }}>No pending or in-progress requests to send</p>
                    </div>
                  ) : (
                    requests
                      .filter(r => r.status !== "Completed")
                      .map((request) => (
                        <div key={request.id} className="p-4 bg-[#F5F7FA] rounded-lg">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p style={{ fontSize: "13px", fontWeight: 600 }}>{request.requesterName}</p>
                                <span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "10px", fontWeight: 600 }}>
                                  {request.requesterType}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full border ${statusColor(request.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                                {request.requestType} • {request.class || request.department} • ID: {request.id}
                              </p>
                              <p style={{ fontSize: "12px" }} className="mt-1">{request.reason}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>📧 {request.contactEmail}</span>
                                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>📱 {request.phone}</span>
                                {request.photoAttached && <span className="text-green-600" style={{ fontSize: "11px" }}>✓ Photo</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Vendor Information */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p style={{ fontSize: "13px", fontWeight: 600 }} className="mb-2 text-blue-900">Vendor Information</p>
                <div className="grid grid-cols-2 gap-3 text-blue-800">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Company</p>
                    <p style={{ fontSize: "12px", fontWeight: 500 }}>SecureID Solutions Ltd.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Contact Person</p>
                    <p style={{ fontSize: "12px", fontWeight: 500 }}>Mr. Akin Balogun</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Email</p>
                    <p style={{ fontSize: "12px", fontWeight: 500 }}>orders@secureid.com.ng</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Phone</p>
                    <p style={{ fontSize: "12px", fontWeight: 500 }}>0803-XXX-4567</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowVendorModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowVendorModal(false)} disabled={requests.filter(r => r.status !== "Completed").length === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontSize: "13px" }}>
                <Send className="w-4 h-4" /> Confirm & Send to Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}