import { CourseLandingPageJsx } from "./components/course-landing-page";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login, without the layout */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes using the layout */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/" element={<CourseLandingPageJsx />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/subject/:subjectId" element={<SubjectDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
