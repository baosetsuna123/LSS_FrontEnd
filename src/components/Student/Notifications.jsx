import {
  deleteNoti,
  putAllNoti,
  putNotificationstatus,
  viewallNoti,
} from "@/data/api";
import { BellOff, Ellipsis, EllipsisVertical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import profile from "../../assets/noti2.avif";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hoveredNoti, setHoveredNoti] = useState(null);
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await viewallNoti(token);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await putNotificationstatus(token, notificationId);
      toast.success("Notification marked as read successfully");
      setNotifications((prevState) =>
        prevState.map((noti) =>
          noti.id === notificationId ? { ...noti, readStatus: true } : noti
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
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const handleMarkAllAsRead = async () => {
    try {
      const response = await putAllNoti(token);
      console.log("Response from putAllNoti:", response);
      toast.success("All notifications marked as read successfully");
      setNotifications((prevState) =>
        prevState.map((noti) => ({ ...noti, readStatus: true }))
      );
      setShowMarkAllMenu(false); // Close the menu after action
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(10);
  };
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "All") return true;
    if (activeTab === "Not Read") return !notification.readStatus;
    return true;
  });
  return (
    <div
      className="flex justify-center items-start min-h-screen p-4 bg-gray-100 dark:bg-gray-900 relative"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-40 z-0"></div>

      <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 relative z-10 overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-0.5">
          <div className="h-full w-full rounded-lg bg-white dark:bg-gray-800"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
              onClick={() => setShowMarkAllMenu((prev) => !prev)}
            >
              <Ellipsis />
            </button>
            {showMarkAllMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => handleTabChange("All")}
            className={`flex-1 py-2 text-sm font-medium text-center ${
              activeTab === "All"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTabChange("Not Read")}
            className={`flex-1 py-2 text-sm font-medium text-center ${
              activeTab === "Not Read"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Not Read
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                  <BellOff className="h-12 w-12 mb-4" />
                  <p>No Notifications Left</p>
                </div>
              ) : (
                filteredNotifications
                  .slice(0, visibleCount)
                  .map((notification, index) => (
                    <div
                      key={index}
                      className="relative border-b border-gray-200 dark:border-gray-700 pb-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {notification.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTime(notification.createAt)}
                      </div>

                      {/* Dropdown Icon */}
                      <div className="absolute top-0 right-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setHoveredNoti((prev) =>
                              prev === notification.id ? null : notification.id
                            );
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <EllipsisVertical />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {hoveredNoti === notification.id && (
                        <div className="absolute right-2 top-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
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
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
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
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))
              )}
              {visibleCount < filteredNotifications.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={loadMore}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-800"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
