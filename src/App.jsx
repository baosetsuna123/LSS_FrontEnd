import { CourseLandingPage } from "./components/Home/Course-Landing-Page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import CoursesPage from "./components/Courses";
import SubjectDetailsPage from "./components/CourseDetails";
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
import QualificationForm from "./components/Teacher/QualificationForm";
import AssignClasses from "./components/Teacher/AssignClasses";
import UpdateSchedule from "./components/Teacher/UpdateSchedule";
import CancelClassRequest from "./components/Teacher/CancelClassRequest";
import CreateClassroom from "./components/Teacher/CreateClassroom";
import ClassList from "./components/Teacher/ClassList";
import TeacherHome from "./components/Teacher/TeacherHome";
import { MyWallet } from "./components/Student/Wallet";
import { ClassDetail } from "./components/Student/class-detail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-application" element={<Application />} />
        <Route path="/dashboard" element={<Dashboard />} />

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
            <Route path="qualification" element={<QualificationForm />} />
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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CourseLandingPage />} />
          <Route path="/class/:id" element={<ClassDetail />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/subject/:subjectId" element={<SubjectDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
