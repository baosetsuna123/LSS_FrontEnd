import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Users,
  LayoutGrid,
  AppWindowMac,
} from "lucide-react";
import ApplicationLayout from "./Applications";
import CourseLayout from "./Course";
import ClassLayout from "./Class";
import CategoryLayout from "./Category";

export function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeCategory, setActiveCategory] = useState("category");

  const categoryData = [
    {
      id: 1,
      name: "Category A",
      email: "catA@example.com",
      department: "Marketing",
    },
    {
      id: 2,
      name: "Category B",
      email: "catB@example.com",
      department: "Sales",
    },
    {
      id: 3,
      name: "Category C",
      email: "catC@example.com",
      department: "Support",
    },
  ];

  const applicationData = [
    {
      id: 1,
      name: "Application A",
      email: "appA@example.com",
      department: "IT",
    },
    {
      id: 2,
      name: "Application B",
      email: "appB@example.com",
      department: "Finance",
    },
    {
      id: 3,
      name: "Application C",
      email: "appC@example.com",
      department: "HR",
    },
  ];

  const courseData = [
    {
      id: 1,
      name: "Course A",
      email: "courseA@example.com",
      department: "Math",
    },
    {
      id: 2,
      name: "Course B",
      email: "courseB@example.com",
      department: "Science",
    },
    {
      id: 3,
      name: "Course C",
      email: "courseC@example.com",
      department: "History",
    },
    {
      id: 4,
      name: "Course A",
      email: "courseA@example.com",
      department: "Math",
    },
    {
      id: 5,
      name: "Course B",
      email: "courseB@example.com",
      department: "Science",
    },
    {
      id: 6,
      name: "Course C",
      email: "courseC@example.com",
      department: "History",
    },
  ];

  const classData = [
    {
      id: 1,
      name: "Class A",
      email: "classA@example.com",
      department: "Biology",
    },
    {
      id: 2,
      name: "Class B",
      email: "classB@example.com",
      department: "Chemistry",
    },
    {
      id: 3,
      name: "Class C",
      email: "classC@example.com",
      department: "Physics",
    },
  ];

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

  // Determine the data to display based on the active category
  const getDataForCurrentCategory = () => {
    switch (activeCategory) {
      case "application":
        return applicationData;
      case "course":
        return courseData;
      case "class":
        return classData;
      case "category":
      default:
        return categoryData;
    }
  };

  const dataToDisplay = getDataForCurrentCategory();
  const pageCount = Math.ceil(dataToDisplay.length / itemsPerPage);
  const currentData = dataToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className="bg-gray-100 text-gray-800 transition-all duration-300 ease-in-out flex flex-col"
        style={{
          width: `${sidebarWidth}px`,
          minWidth: isSidebarCollapsed ? "60px" : "60px",
        }}
      >
        <div className="p-4 flex justify-between items-center">
          <h2
            className={`text-xl font-bold ${
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
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
          {/* Table */}
          {activeCategory === "category" && (
            <CategoryLayout data={currentData} />
          )}
          {activeCategory === "application" && (
            <ApplicationLayout data={currentData} />
          )}
          {activeCategory === "course" && <CourseLayout data={currentData} />}
          {activeCategory === "class" && <ClassLayout data={currentData} />}
          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-800"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {pageCount}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
              className="px-4 py-2 border border-zinc-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
