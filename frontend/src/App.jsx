import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import AccountBook from "./pages/AccountBook";
import Notes from "./pages/Notes";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import MyLoginHistory from "./pages/MyLoginHistory";
import Assignment from "./components/common/Assignment";
import Quiz from "./components/common/Quiz";
import OpenQuiz from "./components/common/OpenQuiz";
import SubmitAssignment from "./components/common/SubmitAssignment";
import Announcement from "./components/common/Announcement";
import ViewCourse from "./pages/ViewCourse";
import Progress from "./pages/Progress";
import GradeBook from "./pages/GradeBook";
import MyStudiedCourses from "./pages/MyStudiedCourses";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLayout from "./components/Layout/AdminLayout";
import NoticeBoard from "./pages/NoticeBoard";
import ManageCourses from "./components/admin/ManageCourses";
import CreateQuiz from "./components/admin/CreateQuiz";
import CreateAssignment from "./components/admin/CreateAssignment";
import Announcements from "./components/admin/Announcements";
import UploadGrades from "./components/admin/UploadGrades";
import ManageStudents from "./components/admin/ManageStudents";
import PaymentForm from "./components/admin/PaymentForm";
import NoticeBoardAnnouncements from "./components/admin/NoticeBoardAnnouncements";
import AddNewCourse from "./components/admin/AddNewCourse";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";
import { useSelector } from "react-redux";
import { isTokenExpired } from "./utils/checkToken";
import Chatbot from "./pages/Chatbot";
import ShowSubmittedSingleQuiz from "./components/admin/ShowSubmittedSingleQuiz";
import Success from "./pages/Success";
import CheckoutPage from "./pages/CheckoutPage";

const GuestOnlyRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const isAuthenticated = token && !isTokenExpired(token) && user;

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirect component for root path
const RootRedirect = () => {
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const isAuthenticated = token && !isTokenExpired(token) && user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* Root redirect - handles both authenticated and unauthenticated users */}
        <Route path="/" element={<RootRedirect />} />

        {/* Student Routes - Only accessible by users with role 'user' */}
        <Route
          path="/"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <UserLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="account-book" element={<AccountBook />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
          <Route path="settings/myloginhistory" element={<MyLoginHistory />} />
          <Route path="course/:courseId/assignment" element={<Assignment />} />
          <Route
            path="course/submit/assignment/:id"
            element={<SubmitAssignment />}
          />
          <Route path="course/:courseId/quiz" element={<Quiz />} />
          <Route path="course/attempt-quiz/:id" element={<OpenQuiz />} />
          <Route
            path="course/:courseId/announcement"
            element={<Announcement />}
          />
          <Route path="course/:courseId/viewcourse" element={<ViewCourse />} />
          <Route path="progress" element={<Progress />} />
          <Route path="grade-book" element={<GradeBook />} />
          <Route path="mystudiedcourses" element={<MyStudiedCourses />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="noticeboard" element={<NoticeBoard />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="success" element={<Success />} />
        </Route>

        {/* Admin Routes - Only accessible by users with role 'admin' */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="add-new-course" element={<AddNewCourse />} />
          <Route
            path="manage-courses/createassignment"
            element={<CreateAssignment />}
          />
          <Route path="manage-courses/createquiz" element={<CreateQuiz />} />
          <Route
            path="manage-courses/createannouncements"
            element={<Announcements />}
          />
          <Route path="upload-grades" element={<UploadGrades />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="payments" element={<PaymentForm />} />
          <Route path="announcements" element={<NoticeBoardAnnouncements />} />
        </Route>

        {/* Public Routes - Accessible by everyone (no authentication required) */}
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route
          path="/forgot-password"
          element={
            <GuestOnlyRoute>
              <ForgotPassword />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnlyRoute>
              <Signup />
            </GuestOnlyRoute>
          }
        />

        {/* Quiz results - Accessible by both roles (but check inside component) */}
        <Route path="/quiz/:quizId" element={<ShowSubmittedSingleQuiz />} />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
