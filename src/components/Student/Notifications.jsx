import {
  deleteNoti,
  putAllNoti,
  putNotificationstatus,
  viewallNoti,
} from "@/data/api";
import { BellOff, Ellipsis, EllipsisVertical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hoveredNoti, setHoveredNoti] = useState(null);
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("All");

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await viewallNoti(token);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-2 dark:border-gray-700">
          <h1 className="font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          {/* Ellipsis icon to show the "Mark all as read" menu */}
          <div
            className="relative"
            onClick={() => setShowMarkAllMenu((prev) => !prev)} // Toggle the menu on icon click
          >
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold">
              {/* Replace with your Ellipsis icon */}
              <Ellipsis />
            </button>

            {/* Dropdown for "Mark all as read" */}
            {showMarkAllMenu && (
              <div className="absolute right-0 top-full w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex whitespace-nowrap items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full"
                >
                  {/* Icon for "Mark all as read" */}
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
        <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
          <button
            onClick={() => handleTabChange("All")}
            className={`flex-1 text-center py-1.5 text-sm ${
              activeTab === "All"
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-300"
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
            }`}
          >
            Not Read
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4 mt-4">
          {filteredNotifications.length === 0 ? (
            // Show this section when there are no notifications and filter is 0
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <BellOff className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
              <p>No Notifications Left</p>
            </div>
          ) : (
            filteredNotifications
              .slice(0, visibleCount)
              .map((notification, index) => (
                <div
                  key={index}
                  className="group relative border-b border-gray-200 dark:border-gray-700 pb-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {notification.type}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.description}
                  </div>

                  {/* Ellipsis icon */}
                  <div className="absolute right-2 top-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredNoti((prev) =>
                          prev === notification.id ? null : notification.id
                        );
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold px-2"
                    >
                      <EllipsisVertical />
                    </button>
                  </div>

                  {/* Dropdown menu */}
                  {hoveredNoti === notification.id && (
                    <div className="absolute right-2 top-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full"
                      >
                        {/* Icon for "Mark as Read" */}
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
                        {/* Icon for "Remove" */}
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
          {visibleCount < filteredNotifications.length && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
