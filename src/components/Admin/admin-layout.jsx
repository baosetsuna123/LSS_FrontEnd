import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  UserPlus,
} from "lucide-react";
import Modal from "@/components/Helper/Modal"; // Adjust the import path
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AssignApplication } from "@/data/api";

export function AdminLayout({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersMenuExpanded, setIsUsersMenuExpanded] = useState(false); // State to toggle the users submenu
  const result = localStorage.getItem("result");
  const [isLogoutHovered, setIsLogoutHovered] = useState(false); // State to track hover
  const { logout } = useAuth(); // Import the useAuth hook
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked"); // Debugging line
    setIsModalOpen(true);
  };

  const handleClick = async () => {
    try {
      await AssignApplication();
      toast.success("Application assigned successfully!");
    } catch (error) {
      console.error("Error assigning application", error);
      toast.error("Already assigned for Staff!");
    }
  };

  const navigate = useNavigate();
  const handleLogoutConfirm = () => {
    setIsModalOpen(false);
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    {
      icon: Users,
      label: "Users",
      path: "#",
      onClick: () => setIsUsersMenuExpanded(!isUsersMenuExpanded), // Toggle child menu
    },
    { icon: FileText, label: "Applications", path: "#" },
    { icon: Settings, label: "Settings", path: "#" },
  ];

  const usersSubMenuItems = [
    { label: "List User", path: "/admin/User" },
    { label: "Create Staff", path: "/admin/User/create-staff" }, // Example path for creating staff
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isExpanded && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-gray-700"
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        <ScrollArea className="flex-grow h-[calc(100vh-8rem)]">
          <nav className="p-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {/* If the menu item is "Users", handle submenu rendering */}
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    isExpanded ? "justify-start" : "justify-center"
                  }`}
                  onClick={item.onClick} // If it's the "Users" item, toggle the submenu
                >
                  <item.icon className="h-6 w-6" />
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </Link>

                {/* Render sub-menu items if the "Users" menu is expanded */}
                {isUsersMenuExpanded &&
                  item.label === "Users" &&
                  usersSubMenuItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`flex items-center pl-6 p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                        isExpanded ? "justify-start" : "justify-center"
                      }`}
                    >
                      {isExpanded && (
                        <span className="ml-3">{subItem.label}</span>
                      )}
                    </Link>
                  ))}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <span className="text-gray-800 font-semibold">
            Hello,{" "}
            <span className="text-blue-500">
              {result ? JSON.parse(result).username : ""}
            </span>
          </span>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className={`text-gray-600 hover:text-gray-800 hover:bg-gray-100 ${
                isLogoutHovered ? "text-red-500" : ""
              }`}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              onClick={handleLogoutClick}
            >
              <LogOut
                className={`h-5 w-5 mr-2 ${
                  isLogoutHovered ? "text-red-500" : ""
                }`}
              />
              Logout
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Footer with Assign Application button */}
        <footer className="bg-white shadow-sm p-4 flex justify-end">
          <Button
            variant="default"
            onClick={() => handleClick()}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Application
          </Button>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
