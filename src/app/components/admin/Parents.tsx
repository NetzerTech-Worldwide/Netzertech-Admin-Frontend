import { useState, useEffect } from "react";
import { Search, Plus, Download, Mail, Phone, Users, Eye, X } from "lucide-react";
import api from "../../utils/api";

type ParentType = { id: string; name: string; phone: string; email: string; children: string[]; occupation: string; status: string };

const classLevels = ["JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"];

const studentsByClass: Record<string, string[]> = {};

export function Parents() {
  const [allParents, setAllParents] = useState<ParentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassForChild, setSelectedClassForChild] = useState<string>("");

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await api.get('/admin/parents');
      const mappedParents = response.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        children: p.children ? p.children.split(',').map((c: string) => c.trim()) : [],
        occupation: p.occupation,
        status: p.status
      }));
      setAllParents(mappedParents);
    } catch (error) {
      console.error("Error fetching parents:", error);
    }
  };

  const filtered = allParents.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.children.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedParent = allParents.find(p => p.id === showDetail);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Parent/Guardian Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage parent information and communication</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
            <Plus className="w-4 h-4" /> Add Parent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Parents", value: allParents.length, color: "#1B6B8A" },
          { label: "Active", value: allParents.filter(p => p.status === "Active").length, color: "#22C55E" },
          { label: "Multi-Children", value: allParents.filter(p => p.children.length > 1).length, color: "#F59E0B" },
          { label: "Inactive", value: allParents.filter(p => p.status === "Inactive").length, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm p-4">
            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.label}</p>
            <p style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search parents or children..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-border">
                {["ID", "Name", "Contact", "Children", "Occupation", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((parent) => (
                <tr key={parent.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{parent.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                        <span className="text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>
                          {parent.name.replace(/Mr\.|Mrs\.|Chief|Pastor|Alh\.|Dr\./g, "").trim().split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{parent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p style={{ fontSize: "12px" }}>{parent.phone}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{parent.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1B6B8A]" />
                      <span style={{ fontSize: "13px" }}>{parent.children.length} child{parent.children.length > 1 ? "ren" : ""}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "13px" }}>{parent.occupation}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full ${parent.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} style={{ fontSize: "11px", fontWeight: 500 }}>
                      {parent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setShowDetail(parent.id)} className="p-1.5 rounded hover:bg-gray-100">
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
      {selectedParent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Parent Details</h3>
              <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
                    {selectedParent.name.replace(/Mr\.|Mrs\.|Chief|Pastor|Alh\.|Dr\./g, "").trim().split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 600 }}>{selectedParent.name}</h4>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{selectedParent.occupation}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-[#F5F7FA] rounded-lg">
                  <Phone className="w-4 h-4 text-[#1B6B8A]" /><span style={{ fontSize: "13px" }}>{selectedParent.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-[#F5F7FA] rounded-lg">
                  <Mail className="w-4 h-4 text-[#1B6B8A]" /><span style={{ fontSize: "13px" }}>{selectedParent.email}</span>
                </div>
              </div>
              <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mt-5 mb-2">Children</h4>
              <div className="space-y-2">
                {selectedParent.children.map((child: string) => (
                  <div key={child} className="flex items-center gap-3 p-3 bg-[#E8F4F8] rounded-lg">
                    <Users className="w-4 h-4 text-[#1B6B8A]" />
                    <span style={{ fontSize: "13px" }}>{child}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add New Parent/Guardian</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Title</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                  <option>Chief</option>
                  <option>Pastor</option>
                  <option>Alhaji</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "13px" }}>First Name</label>
                  <input type="text" placeholder="e.g. John" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Last Name</label>
                  <input type="text" placeholder="e.g. Doe" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Phone Number</label>
                <input type="tel" placeholder="e.g. 08012345678" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Email Address</label>
                <input type="email" placeholder="e.g. parent@email.com" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Occupation</label>
                <input type="text" placeholder="e.g. Engineer" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Home Address</label>
                <textarea rows={3} placeholder="Enter complete address..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Select Child/Children</label>
                <div className="mt-2">
                  <select value={selectedClassForChild} onChange={(e) => setSelectedClassForChild(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-white" style={{ fontSize: "13px" }}>
                    <option value="">-- Select Class First --</option>
                    {classLevels.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
                {selectedClassForChild && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto p-2 bg-[#F5F7FA] rounded-lg">
                    {studentsByClass[selectedClassForChild]?.map((student) => (
                      <label key={student} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span style={{ fontSize: "13px" }}>{student}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Relationship to Child</label>
                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Guardian</option>
                  <option>Relative</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Add Parent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}