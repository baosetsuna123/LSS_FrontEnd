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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-application" element={<Application />} />
        <Route path="/dashboard" element={<Dashboard />} />

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
