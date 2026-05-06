import { useState, useEffect } from "react";
import {
  Search, Plus, Download, Eye, Edit, Trash2, DollarSign,
  TrendingUp, AlertCircle, CheckCircle, X, FileText, Send,
  Globe, Users, GraduationCap, Percent, Building, Mail,
  Printer, Bell, Tag, PieChart, TrendingDown, Calendar, Loader2, School,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "../../utils/api";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];

interface BillItem {
  name: string;
  amount: number;
}

interface Bill {
  id: string;
  title: string;
  session: string;
  term: string;
  targetClass: string;
  targetType: "student" | "teacher";
  isUniversal: boolean;
  items: BillItem[];
  total: number;
  bankCharges: number;
  vat: number;
  grandTotal: number;
  status: "Draft" | "Published" | "Archived";
  createdDate: string;
  publishedDate?: string;
  studentsCount: number;
  paidCount: number;
  partialCount: number;
}

interface PaymentBreakdown {
  component: string;
  amount: number;
}

interface PaymentRecord {
  id: string;
  student: string;
  class: string;
  billTitle: string;
  amountPaid: number;
  billTotal: number;
  balance: number;
  status: string;
  date: string;
  method: string;
  reference: string;
  breakdown: PaymentBreakdown[];
}

const monthlyRevenue: { month: string; amount: number }[] = [];
const revenueBreakdown: { source: string; amount: number; percentage: number; color: string }[] = [];
const tabs = ["Bill Management", "Payment Tracking", "Fee History", "Revenue", "Reminders", "Discounts", "Receipts"];

export function Finance() {
  const [activeTab, setActiveTab] = useState("Bill Management");
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("Second Term");
  const [classFilter, setClassFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [showBillDetail, setShowBillDetail] = useState<Bill | null>(null);
  const [showEditBill, setShowEditBill] = useState<Bill | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeeDetail, setShowFeeDetail] = useState<PaymentRecord | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [allStudentsList, setAllStudentsList] = useState<{ name: string; class: string }[]>([]);
  const [newBillItems, setNewBillItems] = useState<BillItem[]>([{ name: "", amount: 0 }]);
  const [newBillClass, setNewBillClass] = useState("");
  const [newBillTitle, setNewBillTitle] = useState("");
  const [newBillTargetType, setNewBillTargetType] = useState<"student" | "teacher">("student");
  const [newBillIsUniversal, setNewBillIsUniversal] = useState(false);
  const [includeBankCharges, setIncludeBankCharges] = useState(true);
  const [bankChargesAmount, setBankChargesAmount] = useState(1500);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [vatPercent, setVatPercent] = useState(7.5);
  const [paymentSessionFilter, setPaymentSessionFilter] = useState("2025/2026");
  const [paymentClassFilter, setPaymentClassFilter] = useState("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
  const [feeTypeFilter, setFeeTypeFilter] = useState("All");
  const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState<PaymentRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<PaymentRecord | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  
  // Payment Form State
  const [paymentStudent, setPaymentStudent] = useState("");
  const [paymentBillId, setPaymentBillId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentRef, setPaymentRef] = useState("");

  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const classLevels = Array.isArray(classes) ? Array.from(new Set(classes.map(c => c.name))).sort() : [];

  useEffect(() => {
    const fetchDependencies = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/admin/classes/overview");
        setClasses(response || []);
        if (response && response.length > 0) {
          setNewBillClass(response[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch finance dependencies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchBills();
    fetchPayments();
    fetchStudents();
  }, [sessionFilter, termFilter]);

  const fetchBills = async () => {
    try {
      const params = new URLSearchParams({ session: sessionFilter, term: termFilter }).toString();
      const data = await api.get(`/admin/finance/bills?${params}`);
      setBills(data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await api.get('/admin/finance/payments');
      setPaymentRecords(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.get('/admin/students');
      setAllStudentsList(data?.map((s: any) => ({ name: s.name, class: s.class })) || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCreateBill = async (publish: boolean) => {
    try {
      await api.post('/admin/finance/bills', {
        title: newBillTitle,
        session: sessionFilter,
        term: termFilter,
        targetClass: newBillTargetType === 'teacher' ? null : newBillClass,
        targetType: newBillTargetType,
        isUniversal: newBillIsUniversal,
        bankCharges: includeBankCharges ? bankChargesAmount : 0,
        vatPercent: includeVAT ? vatPercent : 0,
        items: newBillItems,
      });
      
      await fetchBills();
      setShowCreateBill(false);
      resetBillForm();
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  const resetBillForm = () => {
    setNewBillTitle("");
    setNewBillItems([{ name: "", amount: 0 }]);
    setNewBillIsUniversal(false);
  };

  const handlePublishBill = async (id: string) => {
    try {
      await api.patch(`/admin/finance/bills/${id}/publish`);
      fetchBills();
    } catch (error) {
      console.error("Error publishing bill:", error);
    }
  };

  const submitPayment = async () => {
    try {
      const selectedBill = bills.find(b => b.id === paymentBillId);
      await api.post('/admin/finance/payments', {
        studentName: paymentStudent,
        billTitle: selectedBill?.title,
        amount: paymentAmount,
        method: paymentMethod,
        date: paymentDate,
        reference: paymentRef,
      });
      fetchPayments();
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error recording payment:", error);
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchSession = b.session === sessionFilter;
    const matchTerm = b.term === termFilter;
    const matchClass = classFilter === "All" || b.targetClass === classFilter || b.isUniversal;
    return matchSession && matchTerm && matchClass;
  });

  const filteredPayments = paymentRecords.filter((p) => {
    const matchSearch = p.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = paymentStatus === "All" || p.status === paymentStatus;
    const matchClass = classFilter === "All" || p.class === classFilter;
    const matchMethod = paymentMethodFilter === "All" || p.method === paymentMethodFilter;
    const matchFeeType = feeTypeFilter === "All" || p.billTitle.includes(feeTypeFilter);
    const matchOutstanding = !showOutstandingOnly || p.balance > 0;
    return matchSearch && matchStatus && matchClass && matchMethod && matchFeeType && matchOutstanding;
  });

  const filteredStudents = allStudentsList.filter(s =>
    (paymentClassFilter === "All" || s.class === paymentClassFilter)
  );

  const totalExpected = filteredBills.reduce((s, b) => s + b.grandTotal * b.studentsCount, 0);
  const totalCollected = filteredPayments.reduce((s, p) => s + p.amountPaid, 0);
  const totalOutstanding = filteredPayments.reduce((s, p) => s + p.balance, 0);

  const addBillItem = () => setNewBillItems([...newBillItems, { name: "", amount: 0 }]);
  const removeBillItem = (index: number) => setNewBillItems(newBillItems.filter((_, i) => i !== index));
  const updateBillItem = (index: number, field: "name" | "amount", value: string | number) => {
    setNewBillItems(newBillItems.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const subtotal = newBillItems.reduce((s, i) => s + (i.amount || 0), 0);
  const computedVAT = includeVAT ? Math.round(subtotal * vatPercent / 100) : 0;
  const computedCharges = includeBankCharges ? bankChargesAmount : 0;
  const grandTotal = subtotal + computedVAT + computedCharges;

  const statusColor = (s: string) => {
    switch (s) { case "Paid": return "bg-green-50 text-green-700"; case "Partial": return "bg-yellow-50 text-yellow-700"; case "Unpaid": return "bg-red-50 text-red-700"; case "Published": return "bg-green-50 text-green-700"; case "Draft": return "bg-gray-100 text-gray-700"; case "Archived": return "bg-blue-50 text-blue-700"; default: return "bg-gray-50 text-gray-700"; }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B6B8A]" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-border py-20 text-center">
        <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
          <School className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No classes found</h3>
        <p className="text-muted-foreground mb-6">Create classes first to manage financial records and bills</p>
        <button onClick={() => navigate("/classes")} className="px-6 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]">Go to Classes</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Financial Management</h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Manage bills, fees, and track payments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowCreateBill(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
            <Plus className="w-4 h-4" /> Create Bill
          </button>
        </div>
      </div>

      {/* Session/Term Filter */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
          {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
          {termsOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
          <option value="All">All Classes</option>
          {(Array.isArray(classes) ? classes : []).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expected", value: `\u20A6${(totalExpected / 1000000).toFixed(1)}M`, icon: DollarSign, color: "#1B6B8A", bg: "#E8F4F8" },
          { label: "Total Collected", value: `\u20A6${(totalCollected / 1000000).toFixed(1)}M`, icon: CheckCircle, color: "#22C55E", bg: "#ECFDF5" },
          { label: "Outstanding", value: `\u20A6${(totalOutstanding / 1000000).toFixed(1)}M`, icon: AlertCircle, color: "#EF4444", bg: "#FEF2F2" },
          { label: "Bills Created", value: filteredBills.length.toString(), icon: FileText, color: "#F59E0B", bg: "#FEF9C3" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{s.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 700 }} className="mt-1">{s.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border shadow-sm p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab ? "bg-[#1B6B8A] text-white" : "hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>{tab}</button>
        ))}
      </div>

      {/* Bill Management Tab */}
      {activeTab === "Bill Management" && (
        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>No bills found for this session/term</p>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Create a new bill to get started</p>
            </div>
          ) : (
            (Array.isArray(filteredBills) ? filteredBills : []).map((bill) => (
              <div key={bill.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bill.targetType === "teacher" ? "bg-purple-50" : "bg-[#E8F4F8]"}`}>
                      {bill.targetType === "teacher" ? <GraduationCap className="w-6 h-6 text-purple-600" /> : <FileText className="w-6 h-6 text-[#1B6B8A]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{bill.title}</h4>
                        {bill.isUniversal && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700" style={{ fontSize: "10px", fontWeight: 600 }}>
                            <Globe className="w-3 h-3" /> Universal
                          </span>
                        )}
                        {bill.targetType === "teacher" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700" style={{ fontSize: "10px", fontWeight: 600 }}>
                            <GraduationCap className="w-3 h-3" /> Teacher Bill
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "11px", fontWeight: 600 }}>{bill.targetClass}</span>
                        <span className={`px-2 py-0.5 rounded-full ${statusColor(bill.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{bill.status}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{bill.session} &middot; {bill.term}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span style={{ fontSize: "18px", fontWeight: 700 }} className="text-[#1B6B8A]">{"\u20A6"}{bill.grandTotal.toLocaleString()}</span>
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{bill.items.length} fee items</span>
                        {(bill.bankCharges > 0 || bill.vat > 0) && (
                          <span className="text-muted-foreground" style={{ fontSize: "11px" }}>
                            {bill.bankCharges > 0 && `+₦${bill.bankCharges.toLocaleString()} charges`}
                            {bill.vat > 0 && ` +₦${bill.vat.toLocaleString()} VAT`}
                          </span>
                        )}
                      </div>
                      {bill.status === "Published" && (
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-green-600" style={{ fontSize: "12px" }}>{bill.paidCount} fully paid</span>
                          <span className="text-yellow-600" style={{ fontSize: "12px" }}>{bill.partialCount} partial</span>
                          <span className="text-red-500" style={{ fontSize: "12px" }}>{bill.studentsCount - bill.paidCount - bill.partialCount} unpaid</span>
                        </div>
                      )}
                      {bill.status === "Published" && (
                        <div className="w-full max-w-[300px] mt-2">
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${(bill.paidCount / bill.studentsCount) * 100}%` }} />
                            <div className="h-full bg-yellow-400" style={{ width: `${(bill.partialCount / bill.studentsCount) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setShowBillDetail(bill)} className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-[#1B6B8A]" /></button>
                    <button onClick={() => setShowEditBill(bill)} className="p-2 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
                    {bill.status === "Draft" && (
                      <button onClick={() => handlePublishBill(bill.id)} className="flex items-center gap-1 px-3 py-1.5 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
                        <Send className="w-3.5 h-3.5" /> Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Tracking Tab */}
      {activeTab === "Payment Tracking" && (
        <div className="space-y-3">
          {/* Filter Catalogue */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Filter Catalogue</h4>
              <button onClick={() => { setPaymentMethodFilter("All"); setFeeTypeFilter("All"); setClassFilter("All"); setPaymentStatus("All"); setShowOutstandingOnly(false); }} className="text-[#1B6B8A] hover:underline" style={{ fontSize: "12px" }}>Clear All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label style={{ fontSize: "12px" }} className="text-muted-foreground">Payment Method</label>
                <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="All">All Methods</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px" }} className="text-muted-foreground">Fee Type</label>
                <select value={feeTypeFilter} onChange={(e) => setFeeTypeFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="All">All Fees</option>
                  <option value="School Fees">School Fees</option>
                  <option value="PTA Levy">PTA Levy</option>
                  <option value="Excursion">Excursion</option>
                  <option value="Laboratory">Laboratory</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px" }} className="text-muted-foreground">Class</label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="All">All Classes</option>
                  {classLevels.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px" }} className="text-muted-foreground">Payment Status</label>
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as any)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="All">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showOutstandingOnly} onChange={(e) => setShowOutstandingOnly(e.target.checked)} className="rounded" />
                <span style={{ fontSize: "13px" }}>Show outstanding bills only</span>
              </label>
              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>•</span>
              <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{filteredPayments.length} records found</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-3 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
              <Plus className="w-4 h-4" /> Record Payment
            </button>
            <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "12px" }}>
              <Mail className="w-4 h-4" /> Send Email
            </button>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-border">
                    {["Student", "Class", "Bill", "Total", "Paid", "Balance", "Status", "Method", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3" style={{ fontSize: "12px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(filteredPayments) ? filteredPayments : []).map((rec) => (
                    <tr key={rec.id} className={`border-b border-border hover:bg-gray-50 ${rec.balance > 0 ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                            <span className="text-[#1B6B8A]" style={{ fontSize: "10px", fontWeight: 600 }}>{rec.student.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>{rec.student}</span>
                            {rec.balance > 0 && <div><AlertCircle className="w-3 h-3 text-red-500 inline mr-1" /><span className="text-red-600" style={{ fontSize: "10px" }}>Outstanding</span></div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{rec.class}</td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{rec.billTitle}</td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{"\u20A6"}{rec.billTotal.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-600" style={{ fontSize: "12px" }}>{"\u20A6"}{rec.amountPaid.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-500" style={{ fontSize: "12px", fontWeight: rec.balance > 0 ? 600 : 400 }}>{"\u20A6"}{rec.balance.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full ${statusColor(rec.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{rec.status}</span></td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{rec.method}</td>
                      <td className="px-4 py-3" style={{ fontSize: "12px" }}>{rec.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setShowFeeDetail(rec)} className="p-1.5 rounded hover:bg-gray-100" title="View Details"><Eye className="w-3.5 h-3.5 text-[#1B6B8A]" /></button>
                          {rec.status !== "Unpaid" && <button onClick={() => setShowReceiptModal(rec)} className="p-1.5 rounded hover:bg-gray-100" title="Print Receipt"><Printer className="w-3.5 h-3.5 text-gray-500" /></button>}
                          {rec.balance > 0 && <button onClick={() => setShowReminderModal(rec)} className="p-1.5 rounded hover:bg-gray-100" title="Send Reminder"><Bell className="w-3.5 h-3.5 text-orange-500" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fee History Tab */}
      {activeTab === "Fee History" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search student payment history..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
          </div>
          <div className="space-y-3">
            {(Array.isArray(paymentRecords) ? paymentRecords : [])
              .filter(r => r.status !== "Unpaid" && r.student.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-border shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                      <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{rec.student.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>{rec.student}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{rec.class} &middot; {rec.billTitle} &middot; Ref: {rec.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600" style={{ fontSize: "16px", fontWeight: 700 }}>{"\u20A6"}{rec.amountPaid.toLocaleString()}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{rec.date} &middot; {rec.method}</p>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>Payment Breakdown</p>
                  <div className="space-y-1">
                    {(Array.isArray(rec.breakdown) ? rec.breakdown : []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-[#F5F7FA] rounded-lg">
                        <span style={{ fontSize: "12px" }}>{item.component}</span>
                        <span style={{ fontSize: "12px", fontWeight: 500 }}>{"\u20A6"}{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg border border-green-100">
                      <span className="text-green-700" style={{ fontSize: "12px", fontWeight: 600 }}>Total Paid</span>
                      <span className="text-green-700" style={{ fontSize: "13px", fontWeight: 700 }}>{"\u20A6"}{rec.amountPaid.toLocaleString()}</span>
                    </div>
                    {rec.balance > 0 && (
                      <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-red-600" style={{ fontSize: "12px", fontWeight: 600 }}>Outstanding Balance</span>
                        <span className="text-red-600" style={{ fontSize: "13px", fontWeight: 700 }}>{"\u20A6"}{rec.balance.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "Revenue" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-1">Monthly Revenue Trend</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>{sessionFilter} &middot; {termFilter}</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => [`\u20A6${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="amount" fill="#1B6B8A" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Breakdown by Source */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Revenue Breakdown by Source</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Detailed insight into how revenue was generated</p>
              </div>
              <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "12px" }}>
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                {revenueBreakdown.map((item) => (
                  <div key={item.source} className="p-4 bg-[#F5F7FA] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.source}</span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600 }} className="text-[#1B6B8A]">{item.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-full mr-3">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{"\u20A6"}{(item.amount / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 rounded-full border-8 border-[#1B6B8A]/20 flex items-center justify-center mb-4 mx-auto relative">
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `conic-gradient(
                        ${revenueBreakdown.map((item, i) => {
                          const prevPercentage = revenueBreakdown.slice(0, i).reduce((sum, r) => sum + r.percentage, 0);
                          return `${item.color} ${prevPercentage}% ${prevPercentage + item.percentage}%`;
                        }).join(", ")}
                      )`
                    }} />
                    <div className="relative z-10 bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center">
                      <PieChart className="w-8 h-8 text-[#1B6B8A] mb-1" />
                      <p style={{ fontSize: "18px", fontWeight: 700 }} className="text-[#1B6B8A]">{"\u20A6"}125.5M</p>
                      <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Total Revenue</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Session 2025/2026 • Second Term</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Revenue Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueBreakdown.slice(0, 4).map((item) => (
              <div key={item.source} className="bg-white rounded-xl border border-border shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>{item.source}</p>
                </div>
                <p style={{ fontSize: "20px", fontWeight: 700 }}>{"\u20A6"}{(item.amount / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600" style={{ fontSize: "11px" }}>+{item.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === "Reminders" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Payment Reminders</h4>
            <p className="text-muted-foreground mb-4" style={{ fontSize: "13px" }}>Send payment reminders to parents with outstanding balances</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-700" style={{ fontSize: "12px" }}>Total Outstanding</p>
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-red-700">{"\u20A6"}{(totalOutstanding / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-700" style={{ fontSize: "12px" }}>Students with Balance</p>
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-yellow-700">{paymentRecords.filter(p => p.balance > 0).length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700" style={{ fontSize: "12px" }}>Reminders Sent</p>
                <p style={{ fontSize: "20px", fontWeight: 700 }} className="text-blue-700">12</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {(Array.isArray(paymentRecords) ? paymentRecords : []).filter(p => p.balance > 0).map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-red-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{rec.student}</h4>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{rec.class} • {rec.billTitle}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span style={{ fontSize: "13px" }}>Total: {"\u20A6"}{rec.billTotal.toLocaleString()}</span>
                        <span className="text-green-600" style={{ fontSize: "13px" }}>Paid: {"\u20A6"}{rec.amountPaid.toLocaleString()}</span>
                        <span className="text-red-600" style={{ fontSize: "13px", fontWeight: 600 }}>Outstanding: {"\u20A6"}{rec.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowReminderModal(rec)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600" style={{ fontSize: "12px" }}>
                    <Bell className="w-4 h-4" /> Send Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discounts Tab */}
      {activeTab === "Discounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Fee Discounts</h4>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>Grant discounts to students and notify parents</p>
            </div>
            <button onClick={() => setShowDiscountModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
              <Tag className="w-4 h-4" /> Grant Discount
            </button>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h4 style={{ fontSize: "13px", fontWeight: 600 }} className="mb-3">Recent Discounts</h4>
            <div className="space-y-3">
              {[
                { student: "Adebayo Johnson", class: "SS 3A", originalFee: 450000, discount: 20, finalFee: 360000, reason: "Financial hardship - parent job loss", date: "Mar 5, 2026" },
                { student: "Fatima Ibrahim", class: "SS 3B", originalFee: 450000, discount: 25, finalFee: 337500, reason: "Sibling discount - 2 children enrolled", date: "Mar 2, 2026" },
              ].map((disc, i) => (
                <div key={i} className="p-4 bg-[#F5F7FA] rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>{disc.student}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{disc.class}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-green-50 text-green-700" style={{ fontSize: "12px", fontWeight: 600 }}>{disc.discount}% OFF</span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-muted-foreground line-through" style={{ fontSize: "12px" }}>{"\u20A6"}{disc.originalFee.toLocaleString()}</span>
                    <span className="text-[#1B6B8A]" style={{ fontSize: "15px", fontWeight: 700 }}>{"\u20A6"}{disc.finalFee.toLocaleString()}</span>
                    <span className="text-green-600" style={{ fontSize: "12px" }}>Saved: {"\u20A6"}{(disc.originalFee - disc.finalFee).toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{disc.reason}</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>Granted: {disc.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipts Tab */}
      {activeTab === "Receipts" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-3 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-[#F5F7FA] rounded-lg px-3 py-2 flex-1 gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by student or receipt number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none flex-1" style={{ fontSize: "13px" }} />
            </div>
            <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "12px" }}>
              <Mail className="w-4 h-4" /> Email Receipt
            </button>
          </div>

          <div className="space-y-3">
            {(Array.isArray(paymentRecords) ? paymentRecords : []).filter(p => p.status !== "Unpaid" && p.student.toLowerCase().includes(searchTerm.toLowerCase())).map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4F8] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#1B6B8A]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Receipt #{rec.reference}</h4>
                        <span className={`px-2 py-0.5 rounded-full ${statusColor(rec.status)}`} style={{ fontSize: "10px", fontWeight: 500 }}>{rec.status}</span>
                      </div>
                      <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>{rec.student} • {rec.class}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span style={{ fontSize: "13px" }}>Bill: {rec.billTitle}</span>
                        <span className="text-green-600" style={{ fontSize: "13px", fontWeight: 600 }}>Amount: {"\u20A6"}{rec.amountPaid.toLocaleString()}</span>
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Method: {rec.method}</span>
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Date: {rec.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setShowReceiptModal(rec)} className="flex items-center gap-2 px-3 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]" style={{ fontSize: "12px" }}>
                      <Printer className="w-4 h-4" /> Print
                    </button>
                    <button onClick={() => setShowEmailModal(true)} className="p-2 rounded-lg hover:bg-gray-100">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill Detail Modal */}
      {showBillDetail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Bill Details</h3>
              <button onClick={() => setShowBillDetail(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#E8F4F8] text-[#1B6B8A]" style={{ fontSize: "12px", fontWeight: 600 }}>{showBillDetail.targetClass}</span>
                <span className={`px-2 py-0.5 rounded-full ${statusColor(showBillDetail.status)}`} style={{ fontSize: "11px", fontWeight: 500 }}>{showBillDetail.status}</span>
                {showBillDetail.isUniversal && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700" style={{ fontSize: "10px", fontWeight: 600 }}><Globe className="w-3 h-3" /> Universal</span>}
                {showBillDetail.targetType === "teacher" && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700" style={{ fontSize: "10px", fontWeight: 600 }}><GraduationCap className="w-3 h-3" /> Teacher</span>}
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: 600 }}>{showBillDetail.title}</h4>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{showBillDetail.session} &middot; {showBillDetail.term}</p>
              <div className="mt-4 space-y-2">
                <p style={{ fontSize: "13px", fontWeight: 600 }}>Fee Breakdown</p>
                {(Array.isArray(showBillDetail.items) ? showBillDetail.items : []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-[#F5F7FA] rounded-lg">
                    <span style={{ fontSize: "13px" }}>{item.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{"\u20A6"}{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{"\u20A6"}{showBillDetail.total.toLocaleString()}</span>
                </div>
                {showBillDetail.bankCharges > 0 && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "12px" }}><Building className="w-3 h-3" /> Bank Charges</span>
                    <span style={{ fontSize: "12px", fontWeight: 500 }}>{"\u20A6"}{showBillDetail.bankCharges.toLocaleString()}</span>
                  </div>
                )}
                {showBillDetail.vat > 0 && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: "12px" }}><Percent className="w-3 h-3" /> VAT</span>
                    <span style={{ fontSize: "12px", fontWeight: 500 }}>{"\u20A6"}{showBillDetail.vat.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 px-3 bg-[#1B6B8A]/10 rounded-lg border border-[#1B6B8A]/20">
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>Grand Total</span>
                  <span style={{ fontSize: "18px", fontWeight: 700 }} className="text-[#1B6B8A]">{"\u20A6"}{showBillDetail.grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p style={{ fontSize: "18px", fontWeight: 700 }} className="text-green-600">{showBillDetail.paidCount}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Fully Paid</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p style={{ fontSize: "18px", fontWeight: 700 }} className="text-yellow-600">{showBillDetail.partialCount}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Partial</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p style={{ fontSize: "18px", fontWeight: 700 }} className="text-red-500">{showBillDetail.studentsCount - showBillDetail.paidCount - showBillDetail.partialCount}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Unpaid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Detail Modal (Payment Breakdown) */}
      {showFeeDetail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Payment Breakdown</h3>
              <button onClick={() => setShowFeeDetail(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1B6B8A] flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{showFeeDetail.student.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{showFeeDetail.student}</p>
                  <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{showFeeDetail.class} &middot; {showFeeDetail.billTitle}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {(Array.isArray(showFeeDetail.breakdown) ? showFeeDetail.breakdown : []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-[#F5F7FA] rounded-lg">
                    <span style={{ fontSize: "13px" }}>{item.component}</span>
                    <span className="text-green-600" style={{ fontSize: "13px", fontWeight: 500 }}>{"\u20A6"}{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 px-3 bg-green-50 rounded-lg border border-green-100 mt-2">
                  <span className="text-green-700" style={{ fontSize: "13px", fontWeight: 600 }}>Amount Paid</span>
                  <span className="text-green-700" style={{ fontSize: "15px", fontWeight: 700 }}>{"\u20A6"}{showFeeDetail.amountPaid.toLocaleString()}</span>
                </div>
                {showFeeDetail.balance > 0 && (
                  <div className="flex items-center justify-between py-2.5 px-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-600" style={{ fontSize: "13px", fontWeight: 600 }}>Balance</span>
                    <span className="text-red-600" style={{ fontSize: "15px", fontWeight: 700 }}>{"\u20A6"}{showFeeDetail.balance.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-between text-muted-foreground" style={{ fontSize: "12px" }}>
                  <span>Reference: {showFeeDetail.reference}</span>
                  <span>{showFeeDetail.date}</span>
                </div>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "12px" }}>Method: {showFeeDetail.method}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {showCreateBill && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Create New Bill</h3>
              <button onClick={() => setShowCreateBill(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label style={{ fontSize: "13px" }}>Bill Title</label><input value={newBillTitle} onChange={(e) => setNewBillTitle(e.target.value)} placeholder="e.g. SS 1 Second Term School Fees" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>

              {/* Bill Target Type */}
              <div>
                <label style={{ fontSize: "13px" }}>Bill For</label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setNewBillTargetType("student")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${newBillTargetType === "student" ? "bg-[#E8F4F8] border-[#1B6B8A] text-[#1B6B8A]" : "border-border hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>
                    <Users className="w-4 h-4" /> Students
                  </button>
                  <button onClick={() => setNewBillTargetType("teacher")} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${newBillTargetType === "teacher" ? "bg-purple-50 border-purple-400 text-purple-700" : "border-border hover:bg-gray-50"}`} style={{ fontSize: "13px" }}>
                    <GraduationCap className="w-4 h-4" /> Teachers
                  </button>
                </div>
              </div>

              {/* Universal Bill Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#1B6B8A]" />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>Universal Bill</p>
                    <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Apply to all {newBillTargetType === "teacher" ? "teachers" : "students in all classes"}</p>
                  </div>
                </div>
                <button onClick={() => setNewBillIsUniversal(!newBillIsUniversal)} className={`w-10 h-5 rounded-full transition-colors ${newBillIsUniversal ? "bg-[#1B6B8A]" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${newBillIsUniversal ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div><label style={{ fontSize: "13px" }}>Session</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{sessions.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label style={{ fontSize: "13px" }}>Term</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{termsOptions.map(t => <option key={t}>{t}</option>)}</select></div>
                {!newBillIsUniversal && newBillTargetType === "student" && (
                  <div><label style={{ fontSize: "13px" }}>Class</label><select value={newBillClass} onChange={(e) => setNewBillClass(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>{(() => {
                    const classLevels = Array.from(new Set(allStudentsList.map(s => s.class)));
                    return classLevels.map(c => <option key={c} value={c}>{c}</option>);
                  })()}</select></div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ fontSize: "13px" }}>Fee Items</label>
                  <button onClick={addBillItem} className="flex items-center gap-1 text-[#1B6B8A] hover:underline" style={{ fontSize: "12px" }}>
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(Array.isArray(newBillItems) ? newBillItems : []).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input placeholder="Fee name" value={item.name} onChange={(e) => updateBillItem(i, "name", e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                      <div className="relative w-[140px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "13px" }}>{"\u20A6"}</span>
                        <input type="number" placeholder="Amount" value={item.amount || ""} onChange={(e) => updateBillItem(i, "amount", Number(e.target.value))} className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                      </div>
                      {newBillItems.length > 1 && (
                        <button onClick={() => removeBillItem(i)} className="p-1.5 rounded hover:bg-gray-100"><X className="w-4 h-4 text-red-400" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Charges Configuration */}
              <div className="space-y-3 p-4 bg-[#F5F7FA] rounded-lg">
                <p style={{ fontSize: "13px", fontWeight: 600 }}>Invoice Charges</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={includeBankCharges} onChange={(e) => setIncludeBankCharges(e.target.checked)} className="rounded" />
                    <label className="flex items-center gap-1" style={{ fontSize: "12px" }}><Building className="w-3.5 h-3.5" /> Bank Charges</label>
                  </div>
                  {includeBankCharges && (
                    <div className="relative w-[120px]">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "12px" }}>{"\u20A6"}</span>
                      <input type="number" value={bankChargesAmount} onChange={(e) => setBankChargesAmount(Number(e.target.value))} className="w-full pl-6 pr-2 py-1.5 rounded border border-border bg-white" style={{ fontSize: "12px" }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={includeVAT} onChange={(e) => setIncludeVAT(e.target.checked)} className="rounded" />
                    <label className="flex items-center gap-1" style={{ fontSize: "12px" }}><Percent className="w-3.5 h-3.5" /> VAT</label>
                  </div>
                  {includeVAT && (
                    <div className="relative w-[80px]">
                      <input type="number" value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value))} className="w-full pr-6 pl-2 py-1.5 rounded border border-border bg-white" style={{ fontSize: "12px" }} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "12px" }}>%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{"\u20A6"}{subtotal.toLocaleString()}</span>
                </div>
                {includeBankCharges && (
                  <div className="flex items-center justify-between py-1.5 px-3">
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Bank Charges</span>
                    <span style={{ fontSize: "12px" }}>+{"\u20A6"}{computedCharges.toLocaleString()}</span>
                  </div>
                )}
                {includeVAT && (
                  <div className="flex items-center justify-between py-1.5 px-3">
                    <span className="text-muted-foreground" style={{ fontSize: "11px" }}>VAT ({vatPercent}%)</span>
                    <span style={{ fontSize: "12px" }}>+{"\u20A6"}{computedVAT.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1 py-2 px-3 bg-[#1B6B8A]/10 rounded-lg border border-[#1B6B8A]/20">
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Grand Total</span>
                  <span style={{ fontSize: "16px", fontWeight: 700 }} className="text-[#1B6B8A]">{"\u20A6"}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => { setShowCreateBill(false); resetBillForm(); }} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => handleCreateBill(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Save as Draft</button>
              <button onClick={() => handleCreateBill(true)} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>Create Bill</button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal with Session & Class filters */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: "13px" }}>Session</label>
                  <select value={paymentSessionFilter} onChange={(e) => setPaymentSessionFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Class</label>
                  <select value={paymentClassFilter} onChange={(e) => setPaymentClassFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                    <option value="All">All Classes</option>
                    {(() => {
                      const classLevels = Array.from(new Set(allStudentsList.map(s => s.class)));
                      return classLevels.map(c => <option key={c} value={c}>{c}</option>);
                    })()}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Student</label>
                <select value={paymentStudent} onChange={(e) => setPaymentStudent(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Student</option>
                  {(Array.isArray(filteredStudents) ? filteredStudents : []).map((s, i) => <option key={i} value={s.name}>{s.name} ({s.class})</option>)}
                </select>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "11px" }}>{filteredStudents.length} students found</p>
              </div>
              <div><label style={{ fontSize: "13px" }}>Bill</label>
                <select value={paymentBillId} onChange={e => setPaymentBillId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Select Bill</option>
                  {bills.filter(b => b.status === "Published").map(b => <option key={b.id} value={b.id}>{b.title} — {b.targetClass}</option>)}
                </select>
              </div>
              <div><label style={{ fontSize: "13px" }}>Amount ({"\u20A6"})</label><input type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Payment Method</label><select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}><option>Bank Transfer</option><option>Cash</option><option>Card</option><option>Online Payment</option></select></div>
              <div><label style={{ fontSize: "13px" }}>Payment Date</label><input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
              <div><label style={{ fontSize: "13px" }}>Reference Number</label><input value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} /></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={submitPayment} disabled={!paymentStudent || !paymentBillId || !paymentAmount} className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50" style={{ fontSize: "13px" }}>Record Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Send Payment Reminder</h3>
              <button onClick={() => setShowReminderModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-orange-700" style={{ fontSize: "13px" }}>
                  A payment reminder will be sent to the parent/guardian of <strong>{showReminderModal.student}</strong> regarding the outstanding balance of <strong>{"\u20A6"}{showReminderModal.balance.toLocaleString()}</strong>.
                </p>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Student</label>
                <input type="text" value={showReminderModal.student} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Class</label>
                <input type="text" value={showReminderModal.class} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: "13px" }}>Total Bill</label>
                  <input type="text" value={`₦${showReminderModal.billTotal.toLocaleString()}`} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px" }}>Outstanding</label>
                  <input type="text" value={`₦${showReminderModal.balance.toLocaleString()}`} readOnly className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-red-50 text-red-700 font-semibold" style={{ fontSize: "13px" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Message</label>
                <textarea rows={5} defaultValue={`Dear Parent/Guardian,\n\nThis is a friendly reminder that there is an outstanding balance of ₦${showReminderModal.balance.toLocaleString()} for ${showReminderModal.student} (${showReminderModal.class}).\n\nBill: ${showReminderModal.billTitle}\nTotal: ₦${showReminderModal.billTotal.toLocaleString()}\nPaid: ₦${showReminderModal.amountPaid.toLocaleString()}\nOutstanding: ₦${showReminderModal.balance.toLocaleString()}\n\nPlease make payment at your earliest convenience.\n\nThank you,\nNetzerTech School Admin`} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowReminderModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowReminderModal(null)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600" style={{ fontSize: "13px" }}>
                <Send className="w-4 h-4" /> Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8" id="receipt-content">
              {/* Receipt Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-[#1B6B8A]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-[#1B6B8A] rounded-full flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>N</span>
                  </div>
                  <div>
                    <h2 className="text-[#1B6B8A]" style={{ fontSize: "20px", fontWeight: 700 }}>NetzerTech School</h2>
                    <p className="text-[#1B6B8A]/60" style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "1px" }}>VERSACORE PROVIDEX</p>
                  </div>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>123 Education Avenue, Lagos, Nigeria</p>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Tel: +234 800 123 4567 | Email: finance@netzertech.edu.ng</p>
              </div>

              {/* Receipt Details */}
              <div className="mb-6">
                <h3 className="text-center mb-4" style={{ fontSize: "18px", fontWeight: 700 }}>PAYMENT RECEIPT</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Receipt Number</p>
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{showReceiptModal.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Date</p>
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{showReceiptModal.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#F5F7FA] rounded-lg">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Student Name</p>
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{showReceiptModal.student}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: "12px" }}>Class</p>
                    <p style={{ fontSize: "14px", fontWeight: 600 }}>{showReceiptModal.class}</p>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2" style={{ fontSize: "12px", fontWeight: 600 }}>Description</th>
                      <th className="text-right py-2" style={{ fontSize: "12px", fontWeight: 600 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2" style={{ fontSize: "13px" }}>{showReceiptModal.billTitle}</td>
                      <td className="text-right py-2" style={{ fontSize: "13px" }}>{"\u20A6"}{showReceiptModal.billTotal.toLocaleString()}</td>
                    </tr>
                    {showReceiptModal.breakdown.map((item, i) => (
                      <tr key={i} className="border-b border-dashed border-border">
                        <td className="py-1.5 pl-4 text-muted-foreground" style={{ fontSize: "12px" }}>{item.component}</td>
                        <td className="text-right py-1.5" style={{ fontSize: "12px" }}>{"\u20A6"}{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: "13px" }}>Amount Paid</span>
                  <span className="text-green-700" style={{ fontSize: "18px", fontWeight: 700 }}>{"\u20A6"}{showReceiptModal.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span style={{ fontSize: "12px" }}>Payment Method</span>
                  <span style={{ fontSize: "12px" }}>{showReceiptModal.method}</span>
                </div>
                {showReceiptModal.balance > 0 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
                    <span className="text-red-600" style={{ fontSize: "13px", fontWeight: 600 }}>Outstanding Balance</span>
                    <span className="text-red-600" style={{ fontSize: "16px", fontWeight: 700 }}>{"\u20A6"}{showReceiptModal.balance.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>This is an official payment receipt from NetzerTech School</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>For inquiries, contact our finance office</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowReceiptModal(null)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Close</button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Grant Fee Discount</h3>
              <button onClick={() => setShowDiscountModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>Select Student</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }}>
                  <option value="">Choose a student</option>
                  {allStudentsList.map((s, i) => <option key={i} value={s.name}>{s.name} ({s.class})</option>)}
                </select>
              </div>
              {selectedStudent && (
                <>
                  <div className="p-4 bg-[#F5F7FA] rounded-lg">
                    <p className="text-muted-foreground mb-2" style={{ fontSize: "12px" }}>Current Fee Breakdown</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span style={{ fontSize: "13px" }}>Tuition Fee</span>
                        <span style={{ fontSize: "13px" }}>{"\u20A6"}260,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontSize: "13px" }}>Development Levy</span>
                        <span style={{ fontSize: "13px" }}>{"\u20A6"}50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontSize: "13px" }}>Laboratory Fee</span>
                        <span style={{ fontSize: "13px" }}>{"\u20A6"}50,000</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>Total</span>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{"\u20A6"}360,000</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "13px" }}>Discount Percentage</label>
                    <input type="number" min="0" max="100" defaultValue="0" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px" }}>Reason for Discount</label>
                    <textarea rows={3} placeholder="e.g. Financial hardship, Sibling discount, Scholarship..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-blue-700" style={{ fontSize: "12px" }}>
                      The parent/guardian will be notified via email about the approved discount.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowDiscountModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowDiscountModal(false)} disabled={!selectedStudent} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74] disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontSize: "13px" }}>
                <Tag className="w-4 h-4" /> Grant Discount
              </button>
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
              <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontSize: "13px" }}>To</label>
                <input type="email" value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} placeholder="recipient@email.com" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Subject</label>
                <input type="text" defaultValue="Financial Information from NetzerTech School" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA]" style={{ fontSize: "13px" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px" }}>Message</label>
                <textarea rows={6} defaultValue="Dear Parent/Guardian,\n\nPlease find attached the financial information from NetzerTech School.\n\nBest regards,\nNetzerTech Finance Department" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-[#F5F7FA] resize-none" style={{ fontSize: "13px" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50" style={{ fontSize: "13px" }}>Cancel</button>
              <button onClick={() => setShowEmailModal(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]" style={{ fontSize: "13px" }}>
                <Send className="w-4 h-4" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
