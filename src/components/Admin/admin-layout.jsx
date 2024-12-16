import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  School,
  User,
  UserPlus,
  BookUser,
  FileX,
  FileQuestionIcon,
  File,
  FileTextIcon,
} from "lucide-react";
import Modal from "@/components/Helper/Modal"; // Adjust the import path
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const handleLogoutConfirm = () => {
    setIsModalOpen(false);
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };
  const [isAppMenuExpanded, setIsAppMenuExpanded] = useState(false); // State to toggle the applications
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    {
      icon: Users,
      label: "Users",
      path: "#",
      onClick: () => setIsUsersMenuExpanded(!isUsersMenuExpanded), // Toggle child menu
    },
    {
      icon: File,
      label: "Applications",
      path: "#",
      onClick: () => setIsAppMenuExpanded(!isAppMenuExpanded), // Toggle child menu
    },
    {
      icon: School,
      label: "Lessons",
      path: "Classes",
    },
    { icon: Settings, label: "Params", path: "EditParams" },
  ];

  const usersSubMenuItems = [
    { icon: User, label: "List User", path: "/admin/User/ListUser" },
    { icon: BookUser, label: "List Tutor", path: "/admin/User/ListTutor" },
    {
      icon: UserPlus,
      label: "Create Staff",
      path: "/admin/User/create-staff",
    },
  ];
  const appsSubMenuItems = [
    {
      icon: FileTextIcon,
      label: "Register",
      path: "/admin/Application/Register",
    },
    {
      icon: FileX,
      label: "Withdraw",
      path: "/admin/Application/Withdraw",
    },
    {
      icon: FileQuestionIcon,
      label: "Other",
      path: "/admin/Application/Other",
    },
  ];
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className="bg-gray-800 text-white transition-all duration-300 h-screen"
        style={{
          width: isExpanded ? "16rem" : "8rem",
          minWidth: isExpanded ? "16rem" : "8rem",
          maxWidth: isExpanded ? "16rem" : "8rem",
        }}
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
                  {item.icon && (
                    <item.icon className="h-5 w-5 mr-3 text-gray-300" />
                  )}
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
                      {subItem.icon && (
                        <subItem.icon className="h-5 w-5 mr-3 text-gray-300" />
                      )}
                      {isExpanded && (
                        <span className="ml-3">{subItem.label}</span>
                      )}
                    </Link>
                  ))}
                {isAppMenuExpanded &&
                  item.label === "Applications" &&
                  appsSubMenuItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`flex items-center pl-6 p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                        isExpanded ? "justify-start" : "justify-center"
                      }`}
                    >
                      {subItem.icon && (
                        <subItem.icon className="h-5 w-5 mr-3 text-gray-300" />
                      )}
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
              className={`text-gray-600 hover:text-gray-800 mr-[85px] hover:bg-gray-100 ${
                isLogoutHovered ? "text-red-500" : ""
              }`}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              onClick={handleLogoutClick}
            >
              <LogOut
                className={`h-5 w-5  ${isLogoutHovered ? "text-red-500" : ""}`}
              />
              Logout
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Footer with Assign Application button */}
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
