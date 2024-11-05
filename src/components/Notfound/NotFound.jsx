// src/components/NotFound.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("The page you are looking for does not exist."); // Show toast notification
  }, []);
  const result = localStorage.getItem("result");
  const role = result ? JSON.parse(result).role : null;
  const handleBackToHome = () => {
    if (role === "STAFF") {
      navigate("/dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (role === "TEACHER") {
      navigate("/teacher");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Not Found</h1>
      <p className="text-lg mb-6">
        The page you are looking for does not exist.
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        onClick={handleBackToHome}
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default NotFound;
