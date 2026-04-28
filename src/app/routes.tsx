import { createBrowserRouter, Navigate } from "react-router";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { Students } from "./components/admin/Students";
import { StudentDetail } from "./components/admin/StudentDetail";
import { Teachers } from "./components/admin/Teachers";
import { TeacherDetail } from "./components/admin/TeacherDetail";
import { Parents } from "./components/admin/Parents";
import { Classes } from "./components/admin/Classes";
import { Subjects } from "./components/admin/Subjects";
import { Attendance } from "./components/admin/Attendance";
import { Examinations } from "./components/admin/Examinations";
import { Timetable } from "./components/admin/Timetable";
import { EventSetup } from "./components/admin/EventSetup";
import { Approvals } from "./components/admin/Approvals";
import { Finance } from "./components/admin/Finance";
import { Announcements } from "./components/admin/Announcements";
import { AcademicRecords } from "./components/admin/AcademicRecords";
import { Settings } from "./components/admin/Settings";
import { IDCardRequests } from "./components/admin/IDCardRequests";
import { TechnicalSupport } from "./components/admin/TechnicalSupport";
import { UserManagement } from "./components/admin/UserManagement";
import { Library } from "./components/admin/Library";
import { ContactForms } from "./components/admin/ContactForms";
import { Clubs } from "./components/admin/Clubs";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";

// Basic Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "students", Component: Students },
      { path: "students/:id", Component: StudentDetail },
      { path: "teachers", Component: Teachers },
      { path: "teachers/:id", Component: TeacherDetail },
      { path: "parents", Component: Parents },
      { path: "classes", Component: Classes },
      { path: "subjects", Component: Subjects },
      { path: "attendance", Component: Attendance },
      { path: "examinations", Component: Examinations },
      { path: "timetable", Component: Timetable },
      { path: "events", Component: EventSetup },
      { path: "approvals", Component: Approvals },
      { path: "finance", Component: Finance },
      { path: "announcements", Component: Announcements },
      { path: "records", Component: AcademicRecords },
      { path: "id-cards", Component: IDCardRequests },
      { path: "library", Component: Library },
      { path: "support", Component: TechnicalSupport },
      { path: "users", Component: UserManagement },
      { path: "contact-forms", Component: ContactForms },
      { path: "clubs", Component: Clubs },
      { path: "settings", Component: Settings },
    ],
  },
  // Catch all - redirect to dashboard (which will redirect to login if no token)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);