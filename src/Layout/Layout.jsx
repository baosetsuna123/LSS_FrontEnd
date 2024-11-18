import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Dock,
  Ellipsis,
  EllipsisVertical,
  LayoutGrid,
  LogOut,
  BellOff,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useClassContext } from "@/context/ClassContext";
import { ModeToggle } from "@/components/ui/Mode-Toggle";
import {
  deleteNoti,
  putAllNoti,
  putNotificationstatus,
  viewallNoti,
} from "@/data/api";

export function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const { isLoggedIn, logout } = useAuth();
  const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false);
  const [isUserPopupVisible, setIsUserPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const { clearClasses, setLoading, classes } = useClassContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [hiddenHeader, setHiddenHeader] = useState(false);
  const location = useLocation();
  const result = localStorage.getItem("result");
  let role;

  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      role = parsedResult.role;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }
  const [notifications, setNotifications] = useState([]);
  const token = sessionStorage.getItem("token");
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await viewallNoti(token);
      setNotifications(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);
  useEffect(() => {
    if (location.pathname) {
      const paths = location.pathname.split("/");
      if (paths.length > 1 && paths[1] === "teacher") {
        setHiddenHeader(true);
      } else {
        setHiddenHeader(false);
      }
    }
  }, [location.pathname]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filtered = classes.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
      setIsSearchPopupVisible(filtered.length > 0); // Show popup if there are results
    } else {
      setFilteredClasses([]); // Clear filtered classes when search term is empty
      setIsSearchPopupVisible(false); // Hide the popup when search term is empty
    }
  }, [searchTerm, classes]);
  // Handle class navigation when a row is clicked
  const handleClassClick = (classId) => {
    setIsSearchPopupVisible(false);
    navigate(`/class/${classId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsUserPopupVisible(false);
      }
    };
    if (isUserPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserPopupVisible]);
  const togglePopup = (event) => {
    event.stopPropagation();
    setIsUserPopupVisible((prev) => !prev);
  };
  const [isbellPopupVisible, setIsbellPopupVisible] = useState(false);
  const togglePopupBell = (event) => {
    event.stopPropagation();
    setIsbellPopupVisible((prev) => !prev);
  };
  const [hoveredNoti, setHoveredNoti] = useState(null);
  const handleLogout = () => {
    logout();
    setIsUserPopupVisible(false);
    clearClasses();
    setLoading(true);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await putNotificationstatus(token, notificationId);
      toast.success("Notification marked as read successfully");
      setNotifications((prevState) =>
        prevState.map((noti) =>
          noti.id === notificationId ? { ...noti, read: true } : noti
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleRemoveNotification = async (notificationId) => {
    try {
      await deleteNoti(token, notificationId);
      toast.success("Notification removed successfully");
      setNotifications((prevState) =>
        prevState.filter((noti) => noti.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to remove notification", error);
    }
  };
  const [showMarkAllMenu, setShowMarkAllMenu] = useState(false);
  const handleMarkAllAsRead = async () => {
    try {
      await putAllNoti(token);
      toast.success("All notifications marked as read successfully");
      setNotifications((prevState) =>
        prevState.map((noti) => ({ ...noti, readStatus: true }))
      );
      setShowMarkAllMenu(false); // Close the menu after action
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };
  const [activeTab, setActiveTab] = useState("All");
  const handleTabChange = (tab) => {
    setActiveTab(tab); // Change active tab when clicked
  };

  const filteredNotifications =
    activeTab === "All"
      ? notifications
      : notifications.filter((noti) => noti.readStatus === false);

  return (
    <div className="flex flex-col min-h-screen">
      {!hiddenHeader && (
        <header
          className={`px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-orange-500 z-50 transition-transform duration-300 ${
            isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <Link to="/" className="flex items-center justify-center">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="font-bold">EduCourse</span>
          </Link>
          {isLoggedIn && (
            <div className="flex items-center mx-auto relative">
              <Search
                className="h-6 w-6 mr-2 cursor-pointer"
                onClick={() => searchInputRef.current.focus()}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search classes ..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="border rounded px-4 py-1 w-96 
    bg-white text-gray-800 placeholder-gray-500 
    dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm(""); // Clear the search term
                    setIsSearchPopupVisible(false); // Hide the popup if visible
                  }}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9l-3.5-3.5a1 1 0 00-1.414 0L4.293 6.293a1 1 0 000 1.414L7.5 10l-3.5 3.5a1 1 0 000 1.414l1.293 1.293a1 1 0 001.414 0L10 11l3.5 3.5a1 1 0 001.414 0l1.293-1.293a1 1 0 000-1.414L12.5 10l3.5-3.5a1 1 0 000-1.414L14.707 5.293a1 1 0 00-1.414 0L10 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              {/* Search Results Popup */}
              {isSearchPopupVisible && filteredClasses.length > 0 && (
                <div
                  ref={popupRef}
                  className="absolute top-full left-0 mt-2 ml-7 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                  style={{
                    width: "calc(93.5%)", // Adjust width to ensure it aligns with the input
                  }}
                >
                  {filteredClasses.slice(0, 5).map((course) => (
                    <div
                      key={course.classId}
                      onClick={() => handleClassClick(course.classId)}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-10 h-10 object-cover rounded mr-4"
                      />
                      <span className="font-semibold dark:text-green-600">
                        {course.name}
                      </span>
                      <span className="ml-auto text-gray-500 dark:text-green-400">
                        {course.courseCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <nav className="ml-auto font-semibold flex items-center gap-8 sm:gap-10">
            {isLoggedIn && (
              <>
                <Link
                  className="text-sm font-semibold hover:underline underline-offset-4"
                  to="/class"
                >
                  Classes
                </Link>
                <Link
                  className="text-sm font-semibold hover:underline underline-offset-4"
                  to="/wallet"
                >
                  Wallet
                </Link>
                <Link
                  className="text-sm font-semibold hover:underline underline-offset-4"
                  to="/news"
                >
                  News
                </Link>
              </>
            )}
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="/about-me"
            >
              About
            </Link>
            {isLoggedIn ? (
              <div className="relative flex items-center gap-6">
                <User
                  className="h-6 w-6 cursor-pointer mr-3"
                  onClick={togglePopup}
                  aria-hidden="true"
                />
                <Bell
                  className="h-6 w-6 cursor-pointer mr-3"
                  onClick={togglePopupBell}
                  aria-hidden="true"
                />
                {notifications.some(
                  (notification) => !notification.readStatus
                ) && (
                  <span className="absolute top-0 right-16 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
                <ModeToggle />
                {isbellPopupVisible && (
                  <div className="absolute right-0 top-full dark:bg-gray-800 dark:border-gray-700 mr-14 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                    {/* Header with Notifications title and ellipsis icon */}
                    <div className="flex justify-between items-center border-b border-gray-200 p-2 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                      </h3>
                      {/* Ellipsis icon to show the "Mark all as read" menu */}
                      <div
                        className="relative"
                        onClick={() => setShowMarkAllMenu((prev) => !prev)} // Toggle the menu on icon click
                      >
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold">
                          <Ellipsis />
                        </button>

                        {/* Dropdown for "Mark all as read" */}
                        {showMarkAllMenu && (
                          <div className="absolute right-0 top-full w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                            <button
                              onClick={handleMarkAllAsRead}
                              className="flex whitespace-nowrap items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full"
                            >
                              <svg
                                className="h-5 w-5 mr-2 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Mark all as read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleTabChange("All")}
                        className={`flex-1 text-center py-1.5 text-sm ${
                          activeTab === "All"
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 dark:text-gray-300"
                        } ${
                          activeTab !== "All"
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                            : ""
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleTabChange("Not Read")}
                        className={`flex-1 text-center py-1.5 text-sm ${
                          activeTab === "Not Read"
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 dark:text-gray-300"
                        } ${
                          activeTab !== "Not Read"
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                            : ""
                        }`}
                      >
                        Not Read
                      </button>
                    </div>

                    <div className="relative">
                      {filteredNotifications.length === 0 ? (
                        <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                          <BellOff className="mx-auto mb-2 text-3xl" />
                          <p>No Notifications Left</p>
                        </div>
                      ) : (
                        filteredNotifications
                          .slice(0, 5)
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className="group relative border-b border-gray-200 p-2 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition duration-200 ease-in-out"
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {notification.type}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {notification.description}
                              </div>

                              {/* Show Ellipsis icon when hovering over the notification */}
                              <div className="absolute right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHoveredNoti((prev) =>
                                      prev === notification.id
                                        ? null
                                        : notification.id
                                    );
                                  }}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold px-2"
                                >
                                  <EllipsisVertical />
                                </button>
                              </div>
                              {hoveredNoti === notification.id && (
                                <div
                                  className={`absolute right-2 top-10 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20`}
                                >
                                  <button
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full"
                                  >
                                    <svg
                                      className="h-5 w-5 mr-2 text-green-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Mark as Read
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRemoveNotification(notification.id)
                                    }
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full"
                                  >
                                    <svg
                                      className="h-5 w-5 mr-2 text-red-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    Remove This
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>

                    {/* View All Button */}
                    <div className="p-2 text-center">
                      <button
                        onClick={() => navigate("/notifications")}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline transition duration-200 ease-in-out"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                )}

                {isUserPopupVisible && (
                  <div
                    ref={popupRef}
                    className="absolute right-5 mr-28 mt-44 w-max bg-white border border-gray-300 rounded-md shadow-lg z-50 p-2 grid grid-cols-2 gap-2 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/order"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      My Order
                    </Link>
                    {role === "STUDENT" && (
                      <Link
                        to="/my-class"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        My Timetable
                      </Link>
                    )}
                    <Link
                      to="/send-applications"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Send Applications
                    </Link>
                    <Link
                      to="/view-applications"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Dock className="h-4 w-4 mr-2" />
                      View Applications
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Login
              </Link>
            )}
          </nav>
        </header>
      )}
      <main className="flex-1">{children}</main>
      <footer className="flex flex-col bg-orange-500 gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-semibold">
        <p className="text-xs">© 2024 EduCourse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
