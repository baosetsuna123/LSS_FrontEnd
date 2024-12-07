import { getApplicationsByType, getApprovalDetail } from "@/data/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  User,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "../ui/button";

const OtherApp = () => {
  const [appOther, setAppOther] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingOther, setLoadingOther] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadAppOthers = async () => {
      const token = sessionStorage.getItem("token");
      setLoadingOther(true);
      try {
        const data = await getApplicationsByType(2, token);
        const sortedData = data.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        setAppOther(sortedData);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        toast.error("Failed to fetch applications.");
      } finally {
        setLoadingOther(false);
      }
    };

    loadAppOthers();
  }, []);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [approvalDetail, setApprovalDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDetailsClick = async (applicationUserId) => {
    setLoading(true); // Set loading to true when the Details button is clicked
    try {
      const approvalRecord = await getApprovalDetail(applicationUserId, token);
      console.log("Approval Record: ", approvalRecord);
      setApprovalDetail(approvalRecord);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching approval record:", error);
      toast.error("Failed to fetch approval record.");
    } finally {
      setLoading(false); // Set loading to false when the API call is completed
    }
  };
  const parseDescription = (description) => {
    const rollNoMatch = description.match(/Student Roll No:\s*(.*?),/i);
    const reasonMatch = description.match(/Reason:\s*(.+)/i);

    return {
      rollNo:
        rollNoMatch && rollNoMatch[1].trim() ? rollNoMatch[1].trim() : "N/A",
      reason:
        reasonMatch && reasonMatch[1].trim() ? reasonMatch[1].trim() : "N/A",
    };
  };

  const filteredApplications = appOther.filter((app) => {
    const matchesStatus = filterStatus
      ? app.status.toLowerCase() === filterStatus.toLowerCase()
      : true;
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const pageCount = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Other Applications
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loadingOther ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApplications.length > 0 ? (
                  paginatedApplications.map((app, index) => {
                    const { reason } = parseDescription(app.description);
                    return (
                      <tr
                        key={app.applicationUserId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {app.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-800"
                                : app.status.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {app.status === "completed" && (
                            <button
                              onClick={() =>
                                handleDetailsClick(app.applicationUserId)
                              }
                              className="text-blue-600 hover:text-blue-800"
                              disabled={loading} // Disable button while loading
                            >
                              {loading ? "Loading..." : "Details"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <Button
              onClick={closeModal}
              variant="ghost"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Approval Details
            </h2>
            {approvalDetail ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                      Approval Date
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {formatTransactionDate(approvalDetail.approvalDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                      Approved By
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {approvalDetail.approvedBy}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <ImageIcon className="h-5 w-5 text-red-500" />
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                      Approval Image
                    </p>
                  </div>
                  <div className="w-full h-auto flex justify-center items-center">
                    {!imageLoaded && (
                      <div className="text-gray-500 dark:text-gray-400">
                        Loading image...
                      </div>
                    )}
                    <img
                      src={approvalDetail.approvalImage}
                      alt="Approval Image"
                      className={`rounded-lg shadow-md ${
                        imageLoaded ? "block" : "hidden"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                Loading approval details...
              </div>
            )}
            <Button onClick={closeModal} className="mt-6 w-full">
              Close
            </Button>
          </div>
        </div>
      )}
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, pageCount))
              }
              disabled={currentPage === pageCount}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredApplications.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredApplications.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(pageCount)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === index + 1
                        ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, pageCount))
                  }
                  disabled={currentPage === pageCount}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherApp;
