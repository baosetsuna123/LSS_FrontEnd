import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../Staff/Modal";
import FeedbackDetail from "./FeedbackDetail";
import { fetchFeedbackByclassid, fetchSystemParam } from "@/data/api";
import toast from "react-hot-toast";

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
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [params, setParams] = useState([]);
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const fetchParam = async () => {
      try {
        const data = await fetchSystemParam(token);
        setParams(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to fetch feedback.");
      }
    };

    fetchParam();
  }, []);
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
  const handleClick = (classId, startDate) => {
    setSelectedClassId(classId);
    setIsModalOpen(true); // Open the modal
    setSelectedStartDate(startDate);
    console.log(classId, startDate);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClassId(null);
  };
  const sortedData = classes.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );
  // Calculate the current data to display based on pagination and search query
  const filteredClass = sortedData.filter((cls) =>
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
            placeholder="Search Lessons by Name"
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
                TutorName
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                CourseCode
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
                    {formatCurrency(app.price) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedbackCounts[app.classId] > 0 && (
                      <button
                        className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200"
                        onClick={() => handleClick(app.classId, app.startDate)}
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
          <FeedbackDetail
            classId={selectedClassId}
            params={params}
            startDate={selectedStartDate}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClassLayout;
