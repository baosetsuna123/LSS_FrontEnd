import { CourseLandingPage } from "./components/Home/Course-Landing-Page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import { Layout } from "./Layout/Layout";
import ForgotPassword from "./components/Auth/ForgotPassword";
import SignUp from "./components/Auth/SignUp";
import { Application } from "./components/Application/Application";
import VerifyOtp from "./components/Auth/Verify-Otp";
import ResetPassword from "./components/Auth/ResetPassword";
import Profile from "./components/Student/Profile";
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Import the ProtectedRoute
import NotFound from "./components/Notfound/NotFound";
import { Dashboard } from "./components/Staff/Dashboard";

// Import các component Teacher Dashboard
import TeacherDashboardLayout from "./components/Teacher/TeacherDashboardLayout";
import AssignClasses from "./components/Teacher/AssignClasses";
import UpdateSchedule from "./components/Teacher/UpdateSchedule";
import CancelClassRequest from "./components/Teacher/CancelClassRequest";
import CreateClassroom from "./components/Teacher/CreateClassroom";
import ClassList from "./components/Teacher/ClassList";
import TeacherHome from "./components/Teacher/TeacherHome";
import { MyWallet } from "./components/Student/Wallet";
import { ClassDetail } from "./components/Student/class-detail";
import { ViewAllClasses } from "./components/Student/All_Class";
import { MyOrders } from "./components/Student/Order";
import MyClass from "./components/Student/MyClass";
import FeedbackForm from "./components/Student/Feedback";
import { WalletHistory } from "./components/Student/All_Transactions";
import { SendApplication } from "./components/Student/send-application";
import { AdminLayout } from "./components/Admin/admin-layout";
import AdminHome from "./components/Admin/AdminHome";
import { AboutMe } from "./components/Home/AboutMe";
import { ApplicationManagement } from "./components/Student/ViewApplication";
import News from "./components/Student/News";
import NewsDetail from "./components/Student/NewsDetail";
import TeacherProfile from "./components/Student/TeacherProfile";
import ProfileTeacher from "./components/Teacher/ProfileTeacher";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-application" element={<Application />} />
        {/* Staff Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Dashboard */}
        <Route
          element={
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          }
        >
          <Route path="/admin-dashboard" element={<AdminHome />} />
        </Route>

        {/* Teacher Dashboard Routes */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/teacher" element={<TeacherDashboardLayout />}>
            <Route index element={<TeacherHome />} />
            <Route path="send-applications" element={<SendApplication />} />
            <Route path="profile" element={<ProfileTeacher />} />
            <Route path="assign-classes" element={<AssignClasses />} />
            <Route path="update-schedule" element={<UpdateSchedule />} />
            <Route path="cancel-request" element={<CancelClassRequest />} />
            <Route path="create-classroom" element={<CreateClassroom />} />
            <Route path="class-list" element={<ClassList />} />
          </Route>
        </Route>

        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <MyWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/all-transactions" element={<WalletHistory />} />
          <Route
            path="/view-applications"
            element={<ApplicationManagement />}
          />
          <Route path="/send-applications" element={<SendApplication />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/" element={<CourseLandingPage />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/class/:id" element={<ClassDetail />} />
          <Route path="/profile/:teacherName" element={<TeacherProfile />} />
          <Route path="/class" element={<ViewAllClasses />} />
          <Route path="/feedback/:orderId" element={<FeedbackForm />} />
          <Route path="/my-class" element={<MyClass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
