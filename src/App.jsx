import { CourseLandingPage } from "./components/Course-Landing-Page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import CoursesPage from "./components/Courses";
import SubjectDetailsPage from "./components/CourseDetails";
import { Layout } from "./components/Layout";
import ForgotPassword from "./components/ForgotPassword";
import SignUp from "./components/SignUp";
import { Application } from "./components/Application";
import VerifyOtp from "./components/Verify-Otp";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute
import NotFound from "./components/NotFound";
import { Dashboard } from "./components/Dashboard";

// Import các component Teacher Dashboard
import TeacherDashboardLayout from './components/Teacher/TeacherDashboardLayout';
import QualificationForm from './components/Teacher/QualificationForm';
import AssignClasses from './components/Teacher/AssignClasses';
import UpdateSchedule from './components/Teacher/UpdateSchedule';
import CancelClassRequest from './components/Teacher/CancelClassRequest';
import CreateClassroom from './components/Teacher/CreateClassroom';
import ClassList from './components/Teacher/ClassList';
import TeacherHome from './components/Teacher/TeacherHome';

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

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CourseLandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/subject/:subjectId" element={<SubjectDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
