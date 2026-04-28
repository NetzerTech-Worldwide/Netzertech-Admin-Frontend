import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import {
  Search, Plus, Download, Eye, Edit, Trash2, Book, BookOpen,
  Clock, AlertCircle, CheckCircle, X, TrendingUp, Users,
  Calendar, DollarSign, Star, Tag, BarChart3, FileText,
  RefreshCw, BookMarked, BookCheck, BookX, CreditCard,
  Filter, Mail, Bell, Printer, XCircle, UserCheck, Target,
  Heart, Award, Activity, ShoppingCart,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const sessions = ["2025/2026", "2024/2025", "2023/2024"];
const termsOptions = ["First Term", "Second Term", "Third Term"];
const categories = ["Fiction", "Non-Fiction", "Science", "History", "Mathematics", "Literature", "Technology", "Biography", "Reference"];
const statuses = ["Available", "Borrowed", "Reserved", "Maintenance", "Lost"];

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  borrowed: number;
  reserved: number;
  publisher: string;
  yearPublished: string;
  status: string;
  rating: number;
  shelfLocation: string;
}

interface LoanRecord {
  id: string;
  bookTitle: string;
  bookId: string;
  studentName: string;
  studentClass: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Active" | "Returned" | "Overdue" | "Renewed";
  renewalCount: number;
  fine: number;
  rating?: number;
}

interface FineRecord {
  id: string;
  loanId: string;
  studentName: string;
  studentClass: string;
  bookTitle: string;
  dueDate: string;
  daysOverdue: number;
  fineAmount: number;
  status: "Pending" | "Paid" | "Waived";
  paidDate?: string;
  paidMethod?: string;
  receiptNo?: string;
}

interface Reservation {
  id: string;
  bookTitle: string;
  bookId: string;
  studentName: string;
  studentClass: string;
  reservedDate: string;
  expiryDate: string;
  status: "Active" | "Fulfilled" | "Expired";
  notified: boolean;
}

interface WishlistItem {
  id: string;
  bookTitle: string;
  author: string;
  isbn?: string;
  studentName: string;
  studentClass: string;
  addedDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Ordered" | "Available" | "Declined";
  requestCount: number;
}

interface ReadingGoal {
  id: string;
  studentName: string;
  studentClass: string;
  yearlyGoal: number;
  booksRead: number;
  currentStreak: number;
  lastReadDate: string;
  progress: number;
}

interface StudentActivity {
  studentName: string;
  studentClass: string;
  totalBorrowed: number;
  currentlyBorrowed: number;
  overdueBooks: number;
  totalFines: number;
  averageRating: number;
  wishlistCount: number;
  readingGoal: number;
  booksRead: number;
}

const initialBooks: BookItem[] = [];

const initialLoans: LoanRecord[] = [];

const initialFines: FineRecord[] = [];

const initialReservations: Reservation[] = [];

const initialWishlist: WishlistItem[] = [];

const initialReadingGoals: ReadingGoal[] = [];

const initialStudentActivity: StudentActivity[] = [];

const categoryStats: { name: string; value: number; color: string }[] = [];

const borrowingTrends: { month: string; count: number }[] = [];

export function Library() {
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "loans" | "fines" | "reservations" | "wishlist" | "goals" | "activity">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState("2025/2026");
  const [selectedTerm, setSelectedTerm] = useState("Second Term");

  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [loans, setLoans] = useState<LoanRecord[]>(initialLoans);
  const [fines, setFines] = useState<FineRecord[]>(initialFines);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>(initialReadingGoals);
  const [studentActivity, setStudentActivity] = useState<StudentActivity[]>(initialStudentActivity);

  // Modals
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showBookDetailModal, setShowBookDetailModal] = useState(false);
  const [showLoanDetailModal, setShowLoanDetailModal] = useState(false);
  const [showProcessReturnModal, setShowProcessReturnModal] = useState(false);
  const [showPayFineModal, setShowPayFineModal] = useState(false);
  const [showReservationDetailModal, setShowReservationDetailModal] = useState(false);
  const [showWishlistDetailModal, setShowWishlistDetailModal] = useState(false);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);

  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [selectedFine, setSelectedFine] = useState<FineRecord | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState<WishlistItem | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentActivity | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.get('/library/catalog');
      // Format backend response to match UI state
      setBooks(data.map((b: any) => ({
        ...b,
        copies: b.totalCopies || b.copies,
        available: b.availableCopies || b.available,
        status: b.status || "Available",
        rating: b.rating || 0
      })));
    } catch (err) {
      console.error(err);
    }
  };

  // Form states for Add Book
  const [newBook, setNewBook] = useState({
    title: "", author: "", isbn: "", category: "Fiction", copies: 1,
    publisher: "", yearPublished: "", shelfLocation: "",
  });

  // Form states for Process Return
  const [returnForm, setReturnForm] = useState({
    condition: "Good",
    notes: "",
  });

  // Form states for Pay Fine
  const [paymentForm, setPaymentForm] = useState({
    method: "Cash",
    receiptNo: "",
  });

  const handleAddBook = async () => {
    try {
      await api.post('/library/catalog', newBook);
      setShowAddBookModal(false);
      setNewBook({ title: "", author: "", isbn: "", category: "Fiction", copies: 1, publisher: "", yearPublished: "", shelfLocation: "" });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBook = () => {
    if (selectedBook) {
      setBooks(books.map(b => b.id === selectedBook.id ? selectedBook : b));
      setShowEditBookModal(false);
      setSelectedBook(null);
    }
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleRenewLoan = (loanId: string) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId) {
        const newDueDate = new Date(loan.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14);
        return {
          ...loan,
          dueDate: newDueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          renewalCount: loan.renewalCount + 1,
          status: "Renewed" as const,
        };
      }
      return loan;
    }));
  };

  const handleProcessReturn = () => {
    if (selectedLoan) {
      setLoans(loans.map(loan => {
        if (loan.id === selectedLoan.id) {
          return {
            ...loan,
            returnDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: "Returned" as const,
          };
        }
        return loan;
      }));

      // Update book availability
      const book = books.find(b => b.id === selectedLoan.bookId);
      if (book) {
        setBooks(books.map(b => {
          if (b.id === book.id) {
            return {
              ...b,
              available: b.available + 1,
              borrowed: b.borrowed - 1,
            };
          }
          return b;
        }));
      }

      setShowProcessReturnModal(false);
      setSelectedLoan(null);
      setReturnForm({ condition: "Good", notes: "" });
    }
  };

  const handlePayFine = () => {
    if (selectedFine) {
      const receiptNo = paymentForm.receiptNo || `RCP-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      setFines(fines.map(fine => {
        if (fine.id === selectedFine.id) {
          return {
            ...fine,
            status: "Paid" as const,
            paidDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            paidMethod: paymentForm.method,
            receiptNo,
          };
        }
        return fine;
      }));

      setShowPayFineModal(false);
      setSelectedFine(null);
      setPaymentForm({ method: "Cash", receiptNo: "" });
    }
  };

  const handleWaiveFine = (fineId: string) => {
    if (window.confirm("Are you sure you want to waive this fine?")) {
      setFines(fines.map(fine => {
        if (fine.id === fineId) {
          return { ...fine, status: "Waived" as const };
        }
        return fine;
      }));
    }
  };

  const handleNotifyReservation = (reservationId: string) => {
    setReservations(reservations.map(res => {
      if (res.id === reservationId) {
        return { ...res, notified: true };
      }
      return res;
    }));
  };

  const handleUpdateWishlistStatus = (wishlistId: string, newStatus: "Pending" | "Ordered" | "Available" | "Declined") => {
    setWishlist(wishlist.map(item => {
      if (item.id === wishlistId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleAddToWishlistCatalog = (wishlistId: string) => {
    const item = wishlist.find(w => w.id === wishlistId);
    if (item && item.isbn) {
      const newBook: BookItem = {
        id: `BK${String(books.length + 1).padStart(3, '0')}`,
        title: item.bookTitle,
        author: item.author,
        isbn: item.isbn,
        category: "Fiction",
        copies: 1,
        available: 1,
        borrowed: 0,
        reserved: 0,
        publisher: "",
        yearPublished: new Date().getFullYear().toString(),
        status: "Available",
        rating: 0,
        shelfLocation: "",
      };
      setBooks([...books, newBook]);
      handleUpdateWishlistStatus(wishlistId, "Available");
    }
  };

  const stats = [
    { label: "Total Books", value: books.reduce((sum, b) => sum + b.copies, 0).toString(), icon: Book, color: "#1B6B8A", bg: "#E8F4F8" },
    { label: "Books Borrowed", value: loans.filter(l => l.status === "Active" || l.status === "Overdue").length.toString(), icon: BookOpen, color: "#22C55E", bg: "#ECFDF5" },
    { label: "Overdue Books", value: loans.filter(l => l.status === "Overdue").length.toString(), icon: Clock, color: "#EF4444", bg: "#FEE2E2" },
    { label: "Active Fines", value: `₦${fines.filter(f => f.status === "Pending").reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()}`, icon: DollarSign, color: "#F59E0B", bg: "#FEF9C3" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            Manage library catalog, loans, and student reading activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg"
            style={{ fontSize: "13px" }}
          >
            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg"
            style={{ fontSize: "13px" }}
          >
            {termsOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "catalog", label: "Book Catalog", icon: Book },
          { id: "loans", label: "Loans", icon: BookOpen },
          { id: "fines", label: "Fines", icon: DollarSign },
          { id: "reservations", label: "Reservations", icon: BookMarked },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "goals", label: "Reading Goals", icon: Target },
          { id: "activity", label: "Student Activity", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#1B6B8A] text-[#1B6B8A]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "14px", fontWeight: activeTab === tab.id ? 600 : 400 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>{stat.label}</p>
                    <p style={{ fontSize: "24px", fontWeight: 700 }}>{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bg }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Borrowing Trends */}
            <div className="bg-white p-6 rounded-xl border border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-4">Borrowing Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={borrowingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: "12px" }} />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1B6B8A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Books by Category */}
            <div className="bg-white p-6 rounded-xl border border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }} className="mb-4">Books by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Recent Loans</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Book</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Borrow Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Due Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 5).map((loan) => (
                    <tr key={loan.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500 }}>{loan.studentName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{loan.studentClass}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.bookTitle}</td>
                      <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.borrowDate}</td>
                      <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-white ${
                          loan.status === "Active" ? "bg-[#22C55E]" :
                          loan.status === "Overdue" ? "bg-[#EF4444]" :
                          loan.status === "Returned" ? "bg-[#1B6B8A]" : "bg-[#F59E0B]"
                        }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === "catalog" && (
        <div>
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B6B8A] text-white rounded-lg hover:bg-[#155a74]"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              Add Book
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books
              .filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.isbn.includes(searchQuery)
              )
              .map((book) => (
                <div key={book.id} className="bg-white p-5 rounded-xl border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 style={{ fontSize: "15px", fontWeight: 600 }} className="mb-1">{book.title}</h4>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>{book.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "12px" }}>
                      <span>ISBN:</span>
                      <span className="font-mono">{book.isbn}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "12px" }}>
                      <span>Category:</span>
                      <span className="px-2 py-0.5 bg-[#E8F4F8] text-[#1B6B8A] rounded">{book.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: "12px" }}>
                      <span>Location:</span>
                      <span>{book.shelfLocation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-muted-foreground" style={{ fontSize: "10px" }}>Total</p>
                      <p style={{ fontSize: "16px", fontWeight: 700 }}>{book.copies}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground" style={{ fontSize: "10px" }}>Available</p>
                      <p style={{ fontSize: "16px", fontWeight: 700 }} className="text-green-600">{book.available}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground" style={{ fontSize: "10px" }}>Borrowed</p>
                      <p style={{ fontSize: "16px", fontWeight: 700 }} className="text-blue-600">{book.borrowed}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setShowBookDetailModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-gray-50"
                      style={{ fontSize: "12px" }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setShowEditBookModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-gray-50"
                      style={{ fontSize: "12px" }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                      style={{ fontSize: "12px" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Loans Tab */}
      {activeTab === "loans" && (
        <div>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search by student name or book title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Loans Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Loan ID</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Book</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Borrow Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Due Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Renewals</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans
                    .filter(loan =>
                      loan.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((loan) => (
                      <tr key={loan.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-4" style={{ fontSize: "13px", fontWeight: 600 }}>{loan.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{loan.studentName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{loan.studentClass}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.bookTitle}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.borrowDate}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.dueDate}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{loan.renewalCount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white ${
                            loan.status === "Active" ? "bg-[#22C55E]" :
                            loan.status === "Overdue" ? "bg-[#EF4444]" :
                            loan.status === "Returned" ? "bg-[#1B6B8A]" : "bg-[#F59E0B]"
                          }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                                setShowLoanDetailModal(true);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(loan.status === "Active" || loan.status === "Overdue") && (
                              <>
                                <button
                                  onClick={() => handleRenewLoan(loan.id)}
                                  className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                                  title="Renew"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedLoan(loan);
                                    setShowProcessReturnModal(true);
                                  }}
                                  className="p-1.5 hover:bg-green-50 text-green-600 rounded"
                                  title="Process Return"
                                >
                                  <BookCheck className="w-4 h-4" />
                                </button>
                              </>
                            )}
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

      {/* Fines Tab */}
      {activeTab === "fines" && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Total Pending Fines</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>
                ₦{fines.filter(f => f.status === "Pending").reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Total Collected</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">
                ₦{fines.filter(f => f.status === "Paid").reduce((sum, f) => sum + f.fineAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Students with Fines</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{fines.filter(f => f.status === "Pending").length}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Fines Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Fine ID</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Book</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Due Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Days Overdue</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Fine Amount</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fines
                    .filter(fine => fine.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((fine) => (
                      <tr key={fine.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-4" style={{ fontSize: "13px", fontWeight: 600 }}>{fine.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{fine.studentName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{fine.studentClass}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{fine.bookTitle}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{fine.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded" style={{ fontSize: "12px", fontWeight: 600 }}>
                            {fine.daysOverdue} days
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "13px", fontWeight: 600 }}>
                          ₦{fine.fineAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white ${
                            fine.status === "Pending" ? "bg-[#EF4444]" :
                            fine.status === "Paid" ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                          }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                            {fine.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {fine.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedFine(fine);
                                    setShowPayFineModal(true);
                                  }}
                                  className="p-1.5 hover:bg-green-50 text-green-600 rounded"
                                  title="Collect Payment"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleWaiveFine(fine.id)}
                                  className="p-1.5 hover:bg-yellow-50 text-yellow-600 rounded"
                                  title="Waive Fine"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {fine.status === "Paid" && fine.receiptNo && (
                              <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Print Receipt">
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
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

      {/* Reservations Tab */}
      {activeTab === "reservations" && (
        <div>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Reservations Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Reservation ID</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Book</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Reserved Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Expiry Date</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations
                    .filter(res =>
                      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      res.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((reservation) => (
                      <tr key={reservation.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-4" style={{ fontSize: "13px", fontWeight: 600 }}>{reservation.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{reservation.studentName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{reservation.studentClass}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{reservation.bookTitle}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{reservation.reservedDate}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{reservation.expiryDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-white ${
                              reservation.status === "Active" ? "bg-[#22C55E]" :
                              reservation.status === "Fulfilled" ? "bg-[#1B6B8A]" : "bg-[#EF4444]"
                            }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                              {reservation.status}
                            </span>
                            {reservation.notified && (
                              <CheckCircle className="w-4 h-4 text-green-600" title="Student Notified" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setShowReservationDetailModal(true);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {reservation.status === "Active" && !reservation.notified && (
                              <button
                                onClick={() => handleNotifyReservation(reservation.id)}
                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                                title="Notify Student"
                              >
                                <Bell className="w-4 h-4" />
                              </button>
                            )}
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

      {/* Wishlist Tab */}
      {activeTab === "wishlist" && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Pending Requests</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{wishlist.filter(w => w.status === "Pending").length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Ordered</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-blue-600">{wishlist.filter(w => w.status === "Ordered").length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Now Available</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">{wishlist.filter(w => w.status === "Available").length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Total Requests</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{wishlist.reduce((sum, w) => sum + w.requestCount, 0)}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search wishlist items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Wishlist Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Book Title</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Author</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Requested By</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Total Requests</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Priority</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Status</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist
                    .filter(item =>
                      item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.studentName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .sort((a, b) => b.requestCount - a.requestCount)
                    .map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-4" style={{ fontSize: "13px", fontWeight: 500 }}>{item.bookTitle}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{item.author}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{item.studentName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{item.studentClass}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded" style={{ fontSize: "12px", fontWeight: 600 }}>
                            {item.requestCount} students
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white ${
                            item.priority === "High" ? "bg-[#EF4444]" :
                            item.priority === "Medium" ? "bg-[#F59E0B]" : "bg-[#22C55E]"
                          }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white ${
                            item.status === "Pending" ? "bg-[#F59E0B]" :
                            item.status === "Ordered" ? "bg-[#1B6B8A]" :
                            item.status === "Available" ? "bg-[#22C55E]" : "bg-[#EF4444]"
                          }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateWishlistStatus(item.id, "Ordered")}
                                  className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                                  title="Mark as Ordered"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateWishlistStatus(item.id, "Declined")}
                                  className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                                  title="Decline Request"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {item.status === "Ordered" && item.isbn && (
                              <button
                                onClick={() => handleAddToWishlistCatalog(item.id)}
                                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                                style={{ fontSize: "12px" }}
                              >
                                Add to Catalog
                              </button>
                            )}
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

      {/* Reading Goals Tab */}
      {activeTab === "goals" && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Active Goals</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{readingGoals.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Avg. Progress</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">
                {Math.round(readingGoals.reduce((sum, g) => sum + g.progress, 0) / readingGoals.length)}%
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Total Books Read</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }}>{readingGoals.reduce((sum, g) => sum + g.booksRead, 0)}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Longest Streak</p>
              <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-orange-600">
                {Math.max(...readingGoals.map(g => g.currentStreak))} weeks
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Reading Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readingGoals
              .filter(goal =>
                goal.studentName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .sort((a, b) => b.progress - a.progress)
              .map((goal) => (
                <div key={goal.id} className="bg-white p-5 rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 600 }}>{goal.studentName}</h4>
                      <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{goal.studentClass}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-[#1B6B8A]" />
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{goal.yearlyGoal}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>Progress</span>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.progress >= 75 ? "bg-green-600" :
                            goal.progress >= 50 ? "bg-blue-600" :
                            goal.progress >= 25 ? "bg-yellow-600" : "bg-red-600"
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Books Read</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }}>{goal.booksRead}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground" style={{ fontSize: "11px" }}>Streak</p>
                        <p style={{ fontSize: "18px", fontWeight: 700 }} className="text-orange-600">{goal.currentStreak}w</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-center" style={{ fontSize: "11px" }}>
                      Last read: {goal.lastReadDate}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Student Activity Tab */}
      {activeTab === "activity" && (
        <div>
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-border px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span style={{ fontSize: "13px" }}>Export</span>
            </button>
          </div>

          {/* Student Activity Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F7FA]">
                  <tr>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Student</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Total Borrowed</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Currently Out</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Overdue</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Total Fines</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Avg. Rating</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Reading Goal</th>
                    <th className="px-6 py-3 text-left" style={{ fontSize: "12px", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentActivity
                    .filter(student =>
                      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      student.studentClass.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500 }}>{student.studentName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{student.studentClass}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{student.totalBorrowed}</td>
                        <td className="px-6 py-4" style={{ fontSize: "13px" }}>{student.currentlyBorrowed}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded ${
                            student.overdueBooks > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`} style={{ fontSize: "12px", fontWeight: 600 }}>
                            {student.overdueBooks}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${student.totalFines > 0 ? "text-red-600" : ""}`} style={{ fontSize: "13px", fontWeight: student.totalFines > 0 ? 600 : 400 }}>
                          {student.totalFines > 0 ? `₦${student.totalFines.toLocaleString()}` : "₦0"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span style={{ fontSize: "13px", fontWeight: 600 }}>{student.averageRating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                              <div
                                className="bg-green-600 h-1.5 rounded-full"
                                style={{ width: `${(student.booksRead / student.readingGoal) * 100}%` }}
                              />
                            </div>
                            <span style={{ fontSize: "12px" }}>{student.booksRead}/{student.readingGoal}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentDetailModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Add New Book</h3>
              <button onClick={() => setShowAddBookModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Book Title *</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Author *</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>ISBN *</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Category *</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Publisher</label>
                  <input
                    type="text"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Year Published</label>
                  <input
                    type="text"
                    value={newBook.yearPublished}
                    onChange={(e) => setNewBook({ ...newBook, yearPublished: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Number of Copies *</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.copies}
                    onChange={(e) => setNewBook({ ...newBook, copies: parseInt(e.target.value) || 1 })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Shelf Location</label>
                  <input
                    type="text"
                    value={newBook.shelfLocation}
                    onChange={(e) => setNewBook({ ...newBook, shelfLocation: e.target.value })}
                    placeholder="e.g., A1-F2"
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50"
                style={{ fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Edit Book</h3>
              <button onClick={() => { setShowEditBookModal(false); setSelectedBook(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Book Title</label>
                  <input
                    type="text"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Author</label>
                  <input
                    type="text"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>ISBN</label>
                  <input
                    type="text"
                    value={selectedBook.isbn}
                    onChange={(e) => setSelectedBook({ ...selectedBook, isbn: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Category</label>
                  <select
                    value={selectedBook.category}
                    onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedBook.copies}
                    onChange={(e) => setSelectedBook({ ...selectedBook, copies: parseInt(e.target.value) || 1 })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Shelf Location</label>
                  <input
                    type="text"
                    value={selectedBook.shelfLocation}
                    onChange={(e) => setSelectedBook({ ...selectedBook, shelfLocation: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => { setShowEditBookModal(false); setSelectedBook(null); }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50"
                style={{ fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditBook}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {showBookDetailModal && selectedBook && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Book Details</h3>
              <button onClick={() => { setShowBookDetailModal(false); setSelectedBook(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Title</h4>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{selectedBook.title}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Author</h4>
                  <p style={{ fontSize: "14px" }}>{selectedBook.author}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>ISBN</h4>
                  <p className="font-mono" style={{ fontSize: "14px" }}>{selectedBook.isbn}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Category</h4>
                  <p style={{ fontSize: "14px" }}>{selectedBook.category}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Publisher</h4>
                  <p style={{ fontSize: "14px" }}>{selectedBook.publisher}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Year Published</h4>
                  <p style={{ fontSize: "14px" }}>{selectedBook.yearPublished}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Shelf Location</h4>
                  <p style={{ fontSize: "14px" }}>{selectedBook.shelfLocation}</p>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Rating</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{selectedBook.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Total Copies</p>
                  <p style={{ fontSize: "24px", fontWeight: 700 }}>{selectedBook.copies}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Available</p>
                  <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-green-600">{selectedBook.available}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "12px" }}>Borrowed</p>
                  <p style={{ fontSize: "24px", fontWeight: 700 }} className="text-blue-600">{selectedBook.borrowed}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-3">Current Borrowers</h4>
                <div className="space-y-2">
                  {loans.filter(l => l.bookId === selectedBook.id && (l.status === "Active" || l.status === "Overdue")).map(loan => (
                    <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>{loan.studentName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{loan.studentClass}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: "12px" }}>Due: {loan.dueDate}</p>
                        <span className={`px-2 py-0.5 rounded-full text-white ${
                          loan.status === "Active" ? "bg-green-600" : "bg-red-600"
                        }`} style={{ fontSize: "10px" }}>
                          {loan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {loans.filter(l => l.bookId === selectedBook.id && (l.status === "Active" || l.status === "Overdue")).length === 0 && (
                    <p className="text-muted-foreground text-center py-4" style={{ fontSize: "13px" }}>No active loans</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => { setShowBookDetailModal(false); setSelectedBook(null); }}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Return Modal */}
      {showProcessReturnModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Process Book Return</h3>
              <button onClick={() => { setShowProcessReturnModal(false); setSelectedLoan(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p style={{ fontSize: "13px", fontWeight: 600 }}>{selectedLoan.bookTitle}</p>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                  Borrowed by {selectedLoan.studentName} ({selectedLoan.studentClass})
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Book Condition</label>
                  <select
                    value={returnForm.condition}
                    onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Notes (Optional)</label>
                  <textarea
                    value={returnForm.notes}
                    onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Any damage or issues to report..."
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                {selectedLoan.fine > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800" style={{ fontSize: "13px", fontWeight: 600 }}>
                      Outstanding Fine: ₦{selectedLoan.fine.toLocaleString()}
                    </p>
                    <p className="text-red-700" style={{ fontSize: "12px" }}>
                      Please collect fine before processing return
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => { setShowProcessReturnModal(false); setSelectedLoan(null); setReturnForm({ condition: "Good", notes: "" }); }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50"
                style={{ fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleProcessReturn}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Process Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Fine Modal */}
      {showPayFineModal && selectedFine && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Collect Fine Payment</h3>
              <button onClick={() => { setShowPayFineModal(false); setSelectedFine(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-red-50 rounded-lg">
                <p style={{ fontSize: "13px", fontWeight: 600 }}>{selectedFine.studentName}</p>
                <p className="text-muted-foreground" style={{ fontSize: "12px" }}>{selectedFine.studentClass}</p>
                <p className="text-muted-foreground mt-2" style={{ fontSize: "12px" }}>Book: {selectedFine.bookTitle}</p>
                <p className="text-red-700 mt-2" style={{ fontSize: "16px", fontWeight: 700 }}>
                  Fine Amount: ₦{selectedFine.fineAmount.toLocaleString()}
                </p>
                <p className="text-red-600" style={{ fontSize: "12px" }}>{selectedFine.daysOverdue} days overdue</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Payment Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600 }}>Receipt Number (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.receiptNo}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiptNo: e.target.value })}
                    placeholder="Auto-generated if left blank"
                    className="w-full mt-2 px-4 py-2 border border-border rounded-lg"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => { setShowPayFineModal(false); setSelectedFine(null); setPaymentForm({ method: "Cash", receiptNo: "" }); }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50"
                style={{ fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayFine}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {showStudentDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600 }}>{selectedStudent.studentName}</h3>
                <p className="text-muted-foreground" style={{ fontSize: "13px" }}>{selectedStudent.studentClass}</p>
              </div>
              <button onClick={() => { setShowStudentDetailModal(false); setSelectedStudent(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>Total Borrowed</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }}>{selectedStudent.totalBorrowed}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>Books Read</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }}>{selectedStudent.booksRead}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>Avg. Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p style={{ fontSize: "20px", fontWeight: 700 }}>{selectedStudent.averageRating.toFixed(1)}</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-muted-foreground mb-1" style={{ fontSize: "11px" }}>Wishlist Items</p>
                  <p style={{ fontSize: "20px", fontWeight: 700 }}>{selectedStudent.wishlistCount}</p>
                </div>
              </div>

              {/* Reading Goal Progress */}
              <div className="mb-6 p-5 bg-gradient-to-r from-[#1B6B8A] to-[#2c8aaf] text-white rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <h4 style={{ fontSize: "15px", fontWeight: 600 }}>Reading Goal Progress</h4>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: 700 }}>{selectedStudent.booksRead}/{selectedStudent.readingGoal}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${(selectedStudent.booksRead / selectedStudent.readingGoal) * 100}%` }}
                  />
                </div>
                <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.9 }}>
                  {Math.round((selectedStudent.booksRead / selectedStudent.readingGoal) * 100)}% complete
                </p>
              </div>

              {/* Current Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="mb-3" style={{ fontSize: "14px", fontWeight: 600 }}>Current Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Currently Borrowed:</span>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedStudent.currentlyBorrowed} books</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Overdue Books:</span>
                      <span className={`${selectedStudent.overdueBooks > 0 ? 'text-red-600' : 'text-green-600'}`} style={{ fontSize: "13px", fontWeight: 600 }}>
                        {selectedStudent.overdueBooks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "13px" }}>Total Fines:</span>
                      <span className={`${selectedStudent.totalFines > 0 ? 'text-red-600' : 'text-green-600'}`} style={{ fontSize: "13px", fontWeight: 600 }}>
                        ₦{selectedStudent.totalFines.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="mb-3" style={{ fontSize: "14px", fontWeight: 600 }}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
                      <BookOpen className="w-4 h-4" />
                      View Borrowing History
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
                      <Heart className="w-4 h-4" />
                      View Wishlist
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-gray-50" style={{ fontSize: "13px" }}>
                      <Mail className="w-4 h-4" />
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Loans */}
              <div>
                <h4 className="mb-3" style={{ fontSize: "14px", fontWeight: 600 }}>Recent Loans</h4>
                <div className="space-y-2">
                  {loans
                    .filter(l => l.studentName === selectedStudent.studentName)
                    .slice(0, 5)
                    .map(loan => (
                      <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p style={{ fontSize: "13px", fontWeight: 500 }}>{loan.bookTitle}</p>
                          <p className="text-muted-foreground" style={{ fontSize: "12px" }}>
                            {loan.borrowDate} - {loan.returnDate || `Due: ${loan.dueDate}`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-white ${
                          loan.status === "Active" ? "bg-[#22C55E]" :
                          loan.status === "Overdue" ? "bg-[#EF4444]" :
                          loan.status === "Returned" ? "bg-[#1B6B8A]" : "bg-[#F59E0B]"
                        }`} style={{ fontSize: "11px", fontWeight: 600 }}>
                          {loan.status}
                        </span>
                      </div>
                    ))}
                  {loans.filter(l => l.studentName === selectedStudent.studentName).length === 0 && (
                    <p className="text-muted-foreground text-center py-4" style={{ fontSize: "13px" }}>No loan history</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => { setShowStudentDetailModal(false); setSelectedStudent(null); }}
                className="px-4 py-2 rounded-lg bg-[#1B6B8A] text-white hover:bg-[#155a74]"
                style={{ fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
