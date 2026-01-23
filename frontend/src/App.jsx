import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner";
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import UserLayout from "./components/Layout/UserLayout"
import Home from "./pages/Home"
import AccountBook from "./pages/AccountBook"
import Notes from "./pages/Notes"
import ChangePassword from "./pages/ChangePassword"
import ForgotPassword from "./components/auth/ForgotPassword"
import MyLoginHistory from "./pages/MyLoginHistory"
import Assignment from "./components/common/Assignment"
import Quiz from "./components/common/Quiz"
import OpenQuiz from "./components/common/OpenQuiz"
import SubmitAssignment from "./components/common/SubmitAssignment"
import Announcement from "./components/common/Announcement"
import ViewCourse from "./pages/ViewCourse"
import Progress from "./pages/Progress"
import GradeBook from "./pages/GradeBook"
import MyStudiedCourses from "./pages/MyStudiedCourses"
import AdminDashboard from "./components/admin/AdminDashboard"
import AdminLayout from "./components/Layout/AdminLayout"
import NoticeBoard from "./pages/NoticeBoard"
import ManageCourses from "./components/admin/ManageCourses"
import CreateQuiz from "./components/admin/CreateQuiz"
import CreateAssignment from "./components/admin/CreateAssignment"
import Announcements from "./components/admin/Announcements"
import UploadGrades from "./components/admin/UploadGrades"
import ManageStudents from "./components/admin/ManageStudents"
import PaymentForm from "./components/admin/PaymentForm"
import NoticeBoardAnnouncements from "./components/admin/NoticeBoardAnnouncements"
import AddNewCourse from "./components/admin/AddNewCourse"
import ProtectedRoute from "./utils/ProtectedRoute"
import { useSelector } from "react-redux";
import { isTokenExpired } from "./utils/checkToken";
import Chatbot from "./pages/Chatbot";
import ShowSubmittedSingleQuiz from "./components/admin/ShowSubmittedSingleQuiz";
// import { stripePromise } from "./stripe";
// import Checkout from "./pages/CheckoutPage";
// import { Elements } from "@stripe/react-stripe-js";
import Success from "./pages/Success";
import CheckoutPage from "./pages/CheckoutPage";


const GuestOnlyRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const isAuthenticated = token && !isTokenExpired(token) && user;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {

  return (

    <BrowserRouter>
      <Toaster position='top-right' />

      <Routes>

        {/* Student Routes */}
        <Route path="/" element={
          <ProtectedRoute><UserLayout /></ProtectedRoute>
        }>
          <Route index element={<Home />}></Route>
          <Route path="/account-book" element={<AccountBook />}></Route>
          <Route path="/notes" element={<Notes />}></Route>
          <Route path="/settings/change-password" element={<ChangePassword />}></Route>
          <Route path="/settings/myloginhistory" element={<MyLoginHistory />}></Route>
          <Route path="/course/:courseId/assignment" element={<Assignment />}></Route>
          <Route path="/course/submit/assignment/:id" element={<SubmitAssignment />}></Route>
          <Route path="/course/:courseId/quiz" element={<Quiz />}></Route>
          <Route path="/course/attempt-quiz/:id" element={<OpenQuiz />}></Route>
          <Route path="/course/:courseId/announcement" element={<Announcement />}></Route>
          <Route path="/course/:courseId/viewcourse" element={<ViewCourse />}></Route>
          <Route path="/progress" element={<Progress />}></Route>
          <Route path="/grade-book" element={<GradeBook />}></Route>
          <Route path="/mystudiedcourses" element={<MyStudiedCourses />}></Route>
          <Route path="/chatbot" element={<Chatbot />}></Route>
          <Route path="/noticeboard" element={<NoticeBoard />}></Route>
         <Route path="checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<Success />} ></Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />}></Route>
          <Route path="/admin/manage-courses" element={<ManageCourses />}></Route>
          <Route path="/admin/add-new-course" element={<AddNewCourse />}></Route>
          <Route path="/admin/manage-courses/createassignment" element={<CreateAssignment />}></Route>
          <Route path="/admin/manage-courses/createquiz" element={<CreateQuiz />}></Route>
          <Route path="/admin/manage-courses/createannouncements" element={<Announcements />}></Route>
          <Route path="/admin/upload-grades" element={<UploadGrades />}></Route>
          <Route path="/admin/manage-students" element={<ManageStudents />}></Route>
          <Route path="/admin/payments" element={<PaymentForm />}></Route>
          <Route path="/admin/announcements" element={<NoticeBoardAnnouncements />}></Route>
        </Route>

        {/* Public Routes (No token required) */}

        <Route path="/notice-board" element={<GuestOnlyRoute><NoticeBoard /></GuestOnlyRoute>}></Route>
        <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPassword /></GuestOnlyRoute>}></Route>
        <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>}></Route>
        <Route path="/signup" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>}></Route>


        <Route path="/quiz/:quizId" element={<ShowSubmittedSingleQuiz />}></Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App
