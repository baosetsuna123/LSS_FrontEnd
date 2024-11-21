import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../Staff/Modal";
import FeedbackDetail from "./FeedbackDetail";
import { fetchFeedbackByclassid } from "@/data/api";

const ClassLayout = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  classes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackCounts, setFeedbackCounts] = useState({});
  const [selectedClassId, setSelectedClassId] = useState(null);
  useEffect(() => {
    console.log(classes);
    const fetchFeedbackCounts = async () => {
      const counts = {};
      for (const cls of classes) {
        try {
          const data = await fetchFeedbackByclassid(
            sessionStorage.getItem("token"),
            cls.classId
          );
          counts[cls.classId] = data.length;
        } catch (error) {
          console.error("Error fetching feedback count:", error);
        }
      }
      setFeedbackCounts(counts);
    };

    fetchFeedbackCounts();
  }, [classes]);
  const handleClick = (classId) => {
    setSelectedClassId(classId);
    setIsModalOpen(true); // Open the modal
    console.log(classId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClassId(null);
  };

  // Calculate the current data to display based on pagination and search query
  const filteredClass = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredClass.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Search Box */}
        <div
          className="flex items-center border rounded p-2"
          style={{ width: "330px" }}
        >
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search Classes by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                TeacherName
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                CourseCode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                StartDate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((app, index) => (
                <tr
                  key={app.applicationUserId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.teacherName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.courseCode || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.startDate
                      ? new Date(app.startDate).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(app.price) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedbackCounts[app.classId] > 0 && (
                      <button
                        className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200"
                        onClick={() => handleClick(app.classId)}
                      >
                        Show Feedback
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <FeedbackDetail classId={selectedClassId} />
        </Modal>
      )}
    </div>
  );
};

export default ClassLayout;
