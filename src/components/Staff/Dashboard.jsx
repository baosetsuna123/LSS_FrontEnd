import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  LayoutGrid,
  AppWindowMac,
  ArrowDown,
  LogOut,
  School,
} from "lucide-react";
import ApplicationLayout from "./Applications";
import CourseLayout from "./Course";
// import ClassLayout from "./Class";
import CategoryLayout from "./Category";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  fetchAllCategories,
  fetchAllCourses,
  fetchApplicationStaff,
  // fetchClasses,
} from "@/data/api"; // Import the API function
import { useAuth } from "@/context/AuthContext";

export function Dashboard() {
  const { logout } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [classes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = JSON.parse(localStorage.getItem("result"));
  const itemsPerPage = 4;
  const [activeCategory, setActiveCategory] = useState("category");
  const [showLogoutText, setShowLogoutText] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQueryCategory, setSearchQueryCategory] = useState("");
  const [searchQueryApplication, setSearchQueryApplication] = useState("");
  const [searchQueryCourse, setSearchQueryCourse] = useState("");
  const [searchQueryClass] = useState("");
  const [totalCategories, setTotalCategories] = useState(0); // Track total categories

  const navigate = useNavigate();

  // Load active category from localStorage on component mount
  useEffect(() => {
    const savedCategory = localStorage.getItem("activeCategory");
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }
  }, []);

  // Save active category to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);
  const handleUpdatePagination = (totalCount) => {
    setTotalCategories(totalCount);
    setCurrentPage(1); // Reset to page 1 if total count changes
  };
  // Fetch all categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const data = await fetchAllCategories(token);
        setCategories(data || []); // Ensure categories is always an array
        setTotalCategories(data.length); // Track total categories
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadCourses = async () => {
      const token = sessionStorage.getItem("token");
      setLoading(true);
      try {
        const data = await fetchAllCourses(token);
        console.log(data);
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to fetch courses.");
        setLoading(true);
      }
    };
    loadCourses();
  }, []);
  // useEffect(() => {
  //   const loadClasses = async () => {
  //     const token = sessionStorage.getItem("token");
  //     try {
  //       const data = await fetchClasses(token);
  //       console.log(data);
  //       setClasses(data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch classes:", error);
  //       // toast.error("Failed to fetch classes.");
  //       setCourses([]);
  //     }
  //   };
  //   loadClasses();
  // }, []);
  // Calculate page counts based on data lengths
  const pageCountCate = Math.ceil(totalCategories / itemsPerPage);
  const pageCountApp = Math.ceil(applications.length / itemsPerPage);
  const pageCountCourse = Math.ceil(courses.length / itemsPerPage);
  const pageCountClass = Math.ceil(classes.length / itemsPerPage);
  // Function to check if any search query is active
  const isSearchActive = () => {
    return (
      searchQueryCategory.trim() !== "" ||
      searchQueryApplication.trim() !== "" ||
      searchQueryCourse.trim() !== "" ||
      searchQueryClass.trim() !== ""
    );
  };

  // Function to handle logout
  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("result");
    logout();
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

  // Function to reset the current page to 1
  const resetCurrentPage = () => {
    setCurrentPage(1);
  };

  // Close the popup and logout text when clicking outside of it

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
              onClick={() => {
                setActiveCategory("category");
                setCurrentPage(1); // Reset to page 1 when changing category
              }}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "category" ? "bg-gray-200" : ""
              }`}
            >
              <LayoutGrid size={20} className="mr-2" />
              Category
            </button>
            <button
              onClick={() => {
                setActiveCategory("application");
                setCurrentPage(1); // Reset to page 1 when changing category
              }}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "application" ? "bg-gray-200" : ""
              }`}
            >
              <AppWindowMac size={20} className="mr-2" />
              Application
            </button>
            <button
              onClick={() => {
                setActiveCategory("course");
                setCurrentPage(1); // Reset to page 1 when changing category
              }}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "course" ? "bg-gray-200" : ""
              }`}
            >
              <BookOpen size={20} className="mr-2" />
              Course
            </button>
            <button
              onClick={() => {
                setActiveCategory("class");
                setCurrentPage(1); // Reset to page 1 when changing category
              }}
              className={`w-full flex items-center py-2 px-4 hover:bg-gray-200 ${
                activeCategory === "class" ? "bg-gray-200" : ""
              }`}
            >
              <School size={20} className="mr-2" />
              Class
            </button>
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

          {/* Render the active category layout */}
          {activeCategory === "category" && (
            <CategoryLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              onUpdatePagination={handleUpdatePagination}
              initialCategories={categories} // Pass categories to CategoryLayout
              searchQuery={searchQueryCategory}
              setSearchQuery={setSearchQueryCategory} // Pass down the search query state
            />
          )}
          {activeCategory === "application" && (
            <ApplicationLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              applications={applications} // Pass applications to ApplicationLayout
              searchQuery={searchQueryApplication}
              setSearchQuery={setSearchQueryApplication} // Pass down the search query state
              onDelete={resetCurrentPage} // Pass down the reset function
            />
          )}
          {activeCategory === "course" && (
            <CourseLayout
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              courses={courses}
              setCourses={setCourses}
              searchQuery={searchQueryCourse}
              setSearchQuery={setSearchQueryCourse} // Pass down the search query state
              onDelete={resetCurrentPage}
              loading={loading}
            />
          )}
          {/* {activeCategory === "class" && (
            // <ClassLayout
            //   currentPage={currentPage}
            //   itemsPerPage={itemsPerPage}
            //   classes={classes}
            //   setClasses={setClasses}
            //   searchQuery={searchQueryClass}
            //   setSearchQuery={setSearchQueryClass} // Pass down the search query state
            //   onDelete={resetCurrentPage} // Pass down the reset function
            // />
          )} */}

          {/* Pagination Controls */}
          {!isSearchActive() && ( // Only show pagination if no search query is active
            <>
              {activeCategory === "category" &&
                categories.length > itemsPerPage && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {pageCountCate}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pageCountCate)
                        )
                      }
                      disabled={currentPage === pageCountCate}
                      className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              {activeCategory === "application" &&
                applications.length > itemsPerPage && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {pageCountApp}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pageCountApp)
                        )
                      }
                      disabled={currentPage === pageCountApp}
                      className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              {activeCategory === "course" && courses.length > itemsPerPage && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {pageCountCourse}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pageCountCourse)
                      )
                    }
                    disabled={currentPage === pageCountCourse}
                    className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
              {activeCategory === "class" && classes.length > itemsPerPage && (
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {pageCountClass}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pageCountClass)
                      )
                    }
                    disabled={currentPage === pageCountClass}
                    className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
