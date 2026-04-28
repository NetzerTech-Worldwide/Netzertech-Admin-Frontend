import { useState, useEffect } from "react";
import {
  FileText, UserPlus, CalendarOff, DollarSign, ClipboardCheck,
  Megaphone, ShoppingCart, AlertTriangle, Eye, Check, X,
  Search, Filter, Clock, ChevronDown, ChevronUp, GraduationCap,
} from "lucide-react";
import { api } from "../../utils/api";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

interface Approval {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  session: string;
  term: string;
  priority: "High" | "Medium" | "Low";
  status: ApprovalStatus;
  details: Record<string, string>;
  attachments?: string[];
}

const categories = [
  { id: "all", label: "All Requests", icon: ClipboardCheck, count: 24 },
  { id: "exam_questions", label: "Exam Questions", icon: FileText, count: 8 },
  { id: "teacher_assignment", label: "Teacher Assignments", icon: GraduationCap, count: 3 },
  { id: "leave_request", label: "Leave Requests", icon: CalendarOff, count: 4 },
  { id: "result_publication", label: "Result Publication", icon: ClipboardCheck, count: 2 },
  { id: "fee_waiver", label: "Fee Waivers", icon: DollarSign, count: 2 },
  { id: "student_transfer", label: "Student Transfers", icon: UserPlus, count: 1 },
  { id: "event_proposal", label: "Event Proposals", icon: Megaphone, count: 2 },
  { id: "procurement", label: "Procurement", icon: ShoppingCart, count: 1 },
  { id: "disciplinary", label: "Disciplinary Actions", icon: AlertTriangle, count: 1 },
];

const allApprovals: Approval[] = [];

export function Approvals() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"All" | ApprovalStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [approvals, setApprovals] = useState<Approval[]>([]);

  useEffect(() => {
    fetchApprovals();
  }, [selectedCategory]);

  const fetchApprovals = async () => {
    try {
      const endpoint = selectedCategory === 'leave_request' 
        ? `/attendance/admin/leave-requests`
        : `/attendance/admin/leave-requests`; // For now, only leave requests are live
      
      const data = await api.get(endpoint);
      setApprovals(data);
    } catch (err) {
      console.error('Error fetching approvals:', err);
    }
  };

  const handleAction = async () => {
    if (!showActionModal) return;
    try {
      await api.post(`/attendance/admin/leave-requests/${showActionModal.id}/status`, {
        status: showActionModal.action === 'approve' ? 'approved' : 'rejected',
        adminComments: actionComment
      });
      
      setShowActionModal(null);
      setActionComment("");
      fetchApprovals();
    } catch (err) {
      console.error('Error updating approval status:', err);
    }
  };

  const filtered = (Array.isArray(approvals) ? approvals : []).filter((a) => {
    const matchCategory = selectedCategory === "all" || a.type === selectedCategory;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const pendingCount = (Array.isArray(approvals) ? approvals : []).filter((a) => a.status === "Pending").length;
  const approvedCount = (Array.isArray(approvals) ? approvals : []).filter((a) => a.status === "Approved").length;
  const rejectedCount = (Array.isArray(approvals) ? approvals : []).filter((a) => a.status === "Rejected").length;

  const priorityColor = (p: string) => {
    switch (p) {
      case "High": return "bg-red-50 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Low": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  const statusBadge = (s: ApprovalStatus) => {
    switch (s) {
      case "Pending": return "bg-yellow-50 text-yellow-700";
      case "Approved": return "bg-green-50 text-green-700";
      case "Rejected": return "bg-red-50 text-red-700";
    }
  };

  const getCategoryIcon = (type: string) => {
    const cat = categories.find((c) => c.id === type);
    return cat?.icon || ClipboardCheck;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Approvals & Requests</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Review and manage all pending approvals</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-yellow-700" style={{ fontSize: "12px" }}>Pending</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700 }} className="text-yellow-700">{pendingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <p className="text-green-700" style={{ fontSize: "12px" }}>Approved</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700 }} className="text-green-700">{approvedCount}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <p className="text-red-700" style={{ fontSize: "12px" }}>Rejected</p>
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700 }} className="text-red-700">{rejectedCount}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Category Sidebar */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-3 lg:w-[220px] shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {categories.map((cat) => {
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors w-full text-left ${
                    selectedCategory === cat.id ? "bg-[#E8F4F8] text-[#1B6B8A]" : "text-[#4a5568] hover:bg-gray-50"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  <cat.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${selectedCategory === cat.id ? "bg-[#1B6B8A] text-white" : "bg-gray-100 text-gray-600"}`} style={{ fontSize: "10px" }}>
                    {cat.id === "all" ? approvals.length : approvals.filter((a) => a.type === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none flex-1"
                style={{ fontSize: "13px" }}
              />
            </div>
            <div className="flex gap-1">
              {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-[#1B6B8A] text-white" : "bg-[#F5F7FA] hover:bg-gray-200"}`}
                  style={{ fontSize: "12px" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Approval Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
              <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>No approvals found</p>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Adjust your filters to see more results</p>
            </div>
          ) : (
            filtered.map((approval) => {
              const Icon = getCategoryIcon(approval.type);
              const isExpanded = expandedId === approval.id;
              return (
                <div key={approval.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E8F4F8] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-[#1B6B8A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{approval.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full border ${priorityColor(approval.priority)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{approval.priority}</span>
                              <span className={`px-2 py-0.5 rounded-full ${statusBadge(approval.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{approval.status}</span>
                            </div>
                            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{approval.category}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {approval.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setShowActionModal({ id: approval.id, action: "approve" }); }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                  style={{ fontSize: "12px" }}
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setShowActionModal({ id: approval.id, action: "reject" }); }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  style={{ fontSize: "12px" }}
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-1.5 line-clamp-2" style={{ fontSize: "13px" }}>{approval.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Submitted by: <span style={{ fontWeight: 500 }}>{approval.submittedBy}</span></span>
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{approval.submittedDate}</span>
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>{approval.session} - {approval.term}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border bg-[#FAFBFC] p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(approval.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1.5 px-3 bg-white rounded-lg border border-border">
                            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{key}</span>
                            <span style={{ fontSize: "12px", fontWeight: 500 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                      {approval.attachments && (
                        <div className="mt-3">
                          <p style={{ fontSize: "12px", fontWeight: 600 }} className="mb-2">Attachments</p>
                          <div className="flex flex-wrap gap-2">
                            {approval.attachments.map((att) => (
                              <div key={att} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-border cursor-pointer hover:bg-gray-50">
                                <FileText className="w-3.5 h-3.5 text-[#1B6B8A]" />
                                <span style={{ fontSize: "12px" }}>{att}</span>
                                <Eye className="w-3 h-3 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                {showActionModal.action === "approve" ? "Approve Request" : "Reject Request"}
              </h3>
              <button onClick={() => setShowActionModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-3" style={{ fontSize: "13px" }}>
                {showActionModal.action === "approve"
                  ? "You are about to approve this request. Please add any comments below."
                  : "You are about to reject this request. Please provide a reason for rejection."}
              </p>
              <div>
                <label style={{ fontSize: "13px" }}>
                  {showActionModal.action === "approve" ? "Comments (optional)" : "Reason for Rejection *"}
                </label>
                <textarea
                  rows={3}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none"
                  style={{ fontSize: "13px" }}
                  placeholder={showActionModal.action === "approve" ? "Add a note..." : "Please explain why this is being rejected..."}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowActionModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 rounded-lg text-white ${showActionModal.action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                style={{ fontSize: "13px" }}
              >
                {showActionModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}