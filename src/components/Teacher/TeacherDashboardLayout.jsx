import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBan,
  // FaDoorOpen,
  FaList,
  FaBars,
  FaTimes,
  FaDollarSign,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Dock, LogOut, Wallet } from "lucide-react";
import misasa from "../../assets/misasa.jfif";

function TeacherDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLogoutText, setShowLogoutText] = useState(false);

  const result = localStorage.getItem("result");

  let teacherName;

  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      if (parsedResult.role === "TEACHER") {
        teacherName = parsedResult.fullName;
      }
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }
  const [avatarImage, setAvatarImage] = useState(null);
  useEffect(() => {
    const result = localStorage.getItem("result");
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        setAvatarImage(parsedResult.avatarImage || null);
      } catch (error) {
        console.error("Error parsing result from localStorage:", error);
      }
    }
  }, []);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    toast.success("You have logged out successfully.");
    navigate("/login");
  };
  const navItems = [
    { path: "/teacher", label: "Home", icon: FaChalkboardTeacher },
    {
      path: "/teacher/update-schedule",
      label: "Update Schedule",
      icon: FaCalendarAlt,
    },
    {
      path: "/teacher/cancel-request",
      label: "Send Class Cancellation Request",
      icon: FaBan,
    },
    {
      path: "/teacher/class-list",
      label: "View Class List",
      icon: FaList,
    },
    {
      path: "/teacher/send-applications",
      label: "Send Application",
      icon: FaDollarSign,
    },
    {
      path: "/teacher/view-applications",
      label: "View Applications",
      icon: Dock,
    },
    {
      path: "/teacher/wallet",
      label: "My Wallet",
      icon: Wallet,
    },
    {
      path: "/teacher/profile",
      label: "My Profile",
      icon: FaUser,
    },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white shadow-md transition-all duration-300 ease-in-out min-h-screen`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {isSidebarOpen && (
            <h2 className="text-2xl font-semibold">
              <Link to="/teacher">Teacher Dashboard</Link>
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-800 text-white transition-colors duration-200"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 ${
                location.pathname === item.path
                  ? "bg-gray-800 text-blue-400"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } transition-colors duration-200`}
            >
              <item.icon
                className={`${isSidebarOpen ? "mr-4" : "mx-auto"} text-xl`}
              />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full flex flex-col items-center">
            {/* Add an icon or image at the top */}
            <svg
              className="w-16 h-16 text-red-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01"
              ></path>
            </svg>

            <p className="text-gray-800 text-lg font-semibold mb-6 text-center">
              Do you really want to log out?
            </p>

            <div className="flex justify-center space-x-4 w-full">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-300 ease-in-out w-full"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors duration-300 ease-in-out w-full"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
          <div className="flex justify-end items-center gap-4">
            {" "}
            {/* Changed to justify-end and added gap */}
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, {teacherName}
            </h1>
            <div className="relative flex items-center gap-4">
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                  onClick={() => setShowLogoutText(!showLogoutText)}
                />
              ) : (
                <img
                  src={misasa}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                  onClick={() => setShowLogoutText(!showLogoutText)}
                />
              )}
              {showLogoutText && (
                <div className="absolute top-0 right-0 transform translate-y-full translate-x-2 bg-white shadow-lg rounded-md p-2 flex flex-col items-center">
                  <span
                    className="flex items-center cursor-pointer text-red-600"
                    onClick={() => setShowLogoutPopup(true)}
                  >
                    <LogOut className="mr-2" />
                    Logout
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboardLayout;
