import { CourseLandingPage } from "./components/course-landing-page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<CourseLandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
