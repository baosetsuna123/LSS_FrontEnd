import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  BookOpen,
  Users,
  LayoutGrid,
  AppWindowMac,
} from "lucide-react";
import { useCallback } from "react";
export function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffData, setStaffData] = useState([]);
  const itemsPerPage = 5;
  const [activeCategory, setActiveCategory] = useState("manage");

  useEffect(() => {
    // Simulating data fetch
    const fetchData = () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Staff Member ${i + 1}`,
        email: `staff${i + 1}@example.com`,
        department: ["HR", "IT", "Finance", "Marketing"][
          Math.floor(Math.random() * 4)
        ],
      }));
      setStaffData(data);
    };
    fetchData();
  }, []);

  const stopResizing = () => setIsResizing(false);

  const resize = useCallback(
    (e) => {
      // Wrap resize in useCallback
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

  const pageCount = Math.ceil(staffData.length / itemsPerPage);
  const currentData = staffData.slice(
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
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{staff.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.department}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
