import { useState, useEffect } from "react";
import {
  fetchApplicationStaff,
  fetchApproveApplication,
  rejectApplication,
} from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import RejectModal from "../Helper/RejectModal";

const ApplicationLayout = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
}) => {
  const [applications, setApplications] = useState([]); // State to hold application data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedApplication, setSelectedApplication] = useState(null); // Currently selected application for rejection
  const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason

  const token = sessionStorage.getItem("token"); // Get the token from session storage

  const handleClick = async (id) => {
    try {
      const response = await fetchApproveApplication(id, token);
      console.log(response);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === id ? { ...app, status: "APPROVED" } : app
        )
      );
      toast.success("Application approved successfully");
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
    }
  };
  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Rejection reason must not be empty.");
      return;
    }

    try {
      await rejectApplication(selectedApplication, rejectionReason, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === selectedApplication
            ? { ...app, status: "REJECTED" }
            : app
        )
      );
      toast.success("Application rejected successfully");
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error("Failed to reject application.");
    } finally {
      setIsModalOpen(false);
      setRejectionReason("");
      setSelectedApplication(null);
    }
  };
  // Fetch application data on component mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplicationStaff(token);
        const application = data.content;
        console.log("Applications:", application);
        setApplications(application); // Set the fetched data to state
      } catch (error) {
        console.error("Failed to fetch applications:", error); // Log the error
        toast.error("Failed to fetch applications."); // Show error message
      }
    };

    loadApplications();
  }, [token]);

  // Calculate the current data to display based on pagination and search query
  const filteredApplications = applications.filter((app) =>
    app.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            placeholder="Search Applications by Teacher Name"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ">
                Certificate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Teacher Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Reason
              </th>{" "}
              {/* New column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((app, index) => (
                <tr
                  key={app.applicationId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.description && typeof app.description === "string"
                      ? app.description.length > 20
                        ? `${app.description.slice(0, 20)}...`
                        : app.description
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.certificate ? (
                      <a
                        href={app.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold cursor-pointer text-sm rounded-lg ${
                      app.status === "APPROVED"
                        ? "text-green-500"
                        : app.status === "ASSIGNED"
                        ? "text-yellow-500"
                        : app.status === "REJECTED"
                        ? "text-red-500"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.teacherName.length > 20
                      ? `${app.teacherName.slice(0, 20)}...`
                      : app.teacherName}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    title={app.rejectionReason}
                  >
                    {app.status === "REJECTED"
                      ? app.rejectionReason.length > 17
                        ? `${app.rejectionReason.slice(0, 17)}...`
                        : app.rejectionReason
                      : "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.status === "ASSIGNED" && (
                      <>
                        <button
                          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                          onClick={() => handleClick(app.applicationId)}
                        >
                          Approve
                        </button>
                        <button
                          className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => {
                            setSelectedApplication(app.applicationId);
                            setIsModalOpen(true);
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === "APPROVED" && (
                      <button
                        className="px-4 py-2 rounded-md bg-gray-400 text-white cursor-not-allowed"
                        disabled
                      >
                        Approved
                      </button>
                    )}
                    {app.status === "REJECTED" && (
                      <button
                        className="px-4 py-2 rounded-md bg-gray-400 text-white cursor-not-allowed"
                        disabled
                      >
                        Rejected
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
                  No Applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RejectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReject}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
      />
    </div>
  );
};

export default ApplicationLayout;
