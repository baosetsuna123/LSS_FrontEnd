import { CourseLandingPage } from "./components/course-landing-page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

import CoursesPage from "./components/Courses";
import SubjectDetailsPage from "./components/CourseDetails";
import { Layout } from "./components/Layout";
import ForgotPassword from "./components/ForgotPassword";
import SignUp from "./components/SignUp";
import { Application } from "./components/Application";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
      />
      <Routes>
        {/* Route for login, without the layout */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-application" element={<Application />} />
        {/* Protected routes using the layout */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CourseLandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/subject/:subjectId" element={<SubjectDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
