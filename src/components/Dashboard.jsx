import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Users,
  LayoutGrid,
  AppWindowMac,
  ArrowDown,
  LogOut,
} from "lucide-react";
import ApplicationLayout from "./Applications";
import CourseLayout from "./Course";
import ClassLayout from "./Class";
import CategoryLayout from "./Category";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchAllCategories, fetchApplicationStaff } from "@/data/api"; // Import the API function

export function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const user = JSON.parse(localStorage.getItem("result"));
  const itemsPerPage = 5;
  const [activeCategory, setActiveCategory] = useState("category");
  const [showLogoutText, setShowLogoutText] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [categories, setCategories] = useState([]); // State to hold categories
  const [applications, setApplications] = useState([]); // State to hold applications

  const navigate = useNavigate();

  // Fetch all categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const data = await fetchAllCategories(token);
        setCategories(data || []); // Ensure categories is always an array
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories.");
        setCategories([]); // Set to an empty array on error
      }
    };

    loadCategories();
  }, []);

  // Fetch applications on component mount
  useEffect(() => {
    const loadApplications = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const data = await fetchApplicationStaff(token);
        setApplications(data.content || []); // Ensure applications is always an array
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        toast.error("Failed to fetch applications.");
        setApplications([]); // Set to an empty array on error
      }
    };

    loadApplications();
  }, []);

  // Calculate page counts based on data lengths
  const pageCountCate = Math.ceil(categories.length / itemsPerPage);
  const pageCountApp = Math.ceil(applications.length / itemsPerPage);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("result");
    sessionStorage.removeItem("token");
    toast.success("You have logged out successfully.");
    navigate("/login");
  };

  const stopResizing = () => setIsResizing(false);

  const resize = useCallback(
    (e) => {
      if (isResizing && !isSidebarCollapsed) {
        setSidebarWidth(Math.max(60, e.clientX));
      }
    },
    [isResizing, isSidebarCollapsed]
  );

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    setSidebarWidth(isSidebarCollapsed ? 250 : 60);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize]);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className="bg-gray-100 text-gray-800 transition-all duration-300 ease-in-out flex flex-col"
          style={{
            width: `${sidebarWidth}px`, // Fixed template literal
            minWidth: isSidebarCollapsed ? "60px" : "60px",
          }}
        >
          <div className="p-4 flex justify-between items-center">
            <h2
              className={`text-xl font-bold ${
                // Fixed template literal
                isSidebarCollapsed ? "hidden" : ""
              }`}
            >
              Dashboard
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-200 rounded"
            >
              {isSidebarCollapsed ? (
                <Menu size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
          </div>
          <nav className={`mt-6 ${isSidebarCollapsed ? "hidden" : ""}`}>
            <button
              onClick={() => setActiveCategory("category")}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "category" ? "bg-gray-200" : ""
              }`}
            >
              <LayoutGrid size={20} className="mr-2" />
              Category
            </button>
            <button
              onClick={() => setActiveCategory("application")}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "application" ? "bg-gray-200" : ""
              }`}
            >
              <AppWindowMac size={20} className="mr-2" />
              Application
            </button>
            <div>
              <button
                onClick={() => setActiveCategory("course")}
                className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                  activeCategory === "course" ? "bg-gray-200" : ""
                }`}
              >
                <BookOpen size={20} className="mr-2" />
                Course
              </button>
              <button
                onClick={() => setActiveCategory("class")}
                className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                  activeCategory === "class" ? "bg-gray-200" : ""
                }`}
              >
                <Users size={20} className="mr-2" />
                Class
              </button>
            </div>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-2">Xin chao, {user.username}</span>
              <div className="relative">
                <ArrowDown
                  className="cursor-pointer"
                  onClick={() => setShowLogoutText(!showLogoutText)}
                />
                {showLogoutText && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2">
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
          </div>

          {/* Logout Confirmation Popup */}
          {showLogoutPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white shadow-lg rounded-md p-6">
                <p>Bạn có chắc chắn muốn thoát không?</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowLogoutPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render the active category layout */}
          {activeCategory === "category" && (
            <CategoryLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              initialCategories={categories} // Pass categories to CategoryLayout
            />
          )}
          {activeCategory === "application" && (
            <ApplicationLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              applications={applications} // Pass applications to ApplicationLayout
            />
          )}
          {activeCategory === "course" && (
            <CourseLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          )}
          {activeCategory === "class" && (
            <ClassLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          )}

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of{" "}
              {activeCategory === "category" ? pageCountCate : pageCountApp}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    activeCategory === "category" ? pageCountCate : pageCountApp
                  )
                )
              }
              disabled={
                currentPage ===
                (activeCategory === "category" ? pageCountCate : pageCountApp)
              }
              className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
