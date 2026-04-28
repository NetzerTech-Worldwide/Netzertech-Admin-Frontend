import { useState } from "react";
import { Plus, Megaphone, Calendar, Eye, Edit, Trash2, X, Users } from "lucide-react";

const announcements: { id: number; title: string; content: string; audience: string; priority: string; date: string; author: string; status: string }[] = [];

export function Announcements() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<typeof announcements[0] | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = announcements.filter((a) => filter === "All" || a.audience === filter);

  const priorityColor = (p: string) => {
    switch (p) {
      case "High": return "bg-red-50 text-red-700";
      case "Medium": return "bg-yellow-50 text-yellow-700";
      case "Low": return "bg-green-50 text-green-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Announcements</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage school announcements and notices</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["All", "All Students", "Parents", "Teachers"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full transition-colors ${filter === f ? "bg-[#1B6B8A] text-white" : "bg-white border border-border hover:bg-[#E8F4F8]"}`}
            style={{ fontSize: "13px" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Announcement Cards */}
      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E8F4F8] flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 text-[#1B6B8A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{a.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full ${priorityColor(a.priority)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{a.priority}</span>
                    {a.status === "Draft" && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600" style={{ fontSize: "10px", fontWeight: 500 }}>Draft</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>{a.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "11px" }}>{a.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span style={{ fontSize: "11px" }}>{a.audience}</span>
                    </div>
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>By: {a.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded hover:bg-gray-100"><Eye className="w-4 h-4 text-[#1B6B8A]" /></button>
                <button onClick={() => setShowEditModal(a)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                <button className="p-1.5 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>New Announcement</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Title</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Content</label><textarea rows={4} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Target Audience</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>All Students</option><option>Parents</option><option>Teachers</option><option>All</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Priority</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>High</option><option>Medium</option><option>Low</option></select></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Save as Draft</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Publish</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Edit Announcement</h3>
              <button onClick={() => setShowEditModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Title</label><input defaultValue={showEditModal.title} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Content</label><textarea rows={4} defaultValue={showEditModal.content} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={{ fontSize: "13px" }}>Target Audience</label><select defaultValue={showEditModal.audience} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>All Students</option><option>Parents</option><option>Teachers</option><option>All</option></select></div>
                <div><label style={{ fontSize: "13px" }}>Priority</label><select defaultValue={showEditModal.priority} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>High</option><option>Medium</option><option>Low</option></select></div>
              </div>
              <div><label style={{ fontSize: "13px" }}>Status</label><select defaultValue={showEditModal.status} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option value="Published">Published</option><option value="Draft">Draft</option></select></div>
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