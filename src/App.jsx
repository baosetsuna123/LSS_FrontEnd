import { CourseLandingPageJsx } from "./components/course-landing-page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CourseLandingPageJsx />} />
      </Routes>
    </Router>
  );
}

export default App;
