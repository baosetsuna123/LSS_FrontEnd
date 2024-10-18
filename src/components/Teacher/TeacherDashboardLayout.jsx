import {  useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaCalendarAlt,
  FaBan,
  FaDoorOpen,
  FaList,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function TeacherDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

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


  const navItems = [
    { path: "/teacher", label: "Trang chủ", icon: FaChalkboardTeacher },
    {
      path: "/teacher/qualification",
      label: "Gửi đơn đăng ký trình độ",
      icon: FaChalkboardTeacher,
    },
    {
      path: "/teacher/assign-classes",
      label: "Phân công lớp học",
      icon: FaBookOpen,
    },
    {
      path: "/teacher/update-schedule",
      label: "Cập nhật lịch học",
      icon: FaCalendarAlt,
    },
    {
      path: "/teacher/cancel-request",
      label: "Gửi yêu cầu hủy lớp",
      icon: FaBan,
    },
    {
      path: "/teacher/create-classroom",
      label: "Tạo phòng học",
      icon: FaDoorOpen,
    },
    {
      path: "/teacher/class-list",
      label: "Xem danh sách lớp học",
      icon: FaList,
    },
  ];


  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"
          } bg-gray-900 text-white shadow-md transition-all duration-300 ease-in-out`}
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
              className={`flex items-center py-3 px-4 ${location.pathname === item.path
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

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {teacherName}
          </h1>
          <p className="text-red-600">Call API Class</p>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboardLayout;
