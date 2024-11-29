import { useState } from "react";
import { fetchApproveApplication, rejectApplication } from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";
import { CheckCircle, Search } from "lucide-react";
import RejectModal from "../Helper/RejectModal";
import ModalApprove from "./ModalApprove";

const ApplicationLayout = ({
  applications,
  setApplications,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedApplication, setSelectedApplication] = useState(null); // Currently selected application for rejection
  const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // For approve modal
  const [teacherNameToApprove, setTeacherNameToApprove] = useState("");
  const [isModalApp, setIsModalApp] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const handleViewCertificateClick = (certificates) => {
    setSelectedCertificates(certificates); // Set the full array of certificates
    setIsModalApp(true); // Open the modal
  };

  const handleCloseModalApp = () => {
    setIsModalApp(false);
  };
  const token = sessionStorage.getItem("token"); // Get the token from session storage
  const handleApproveClick = (app) => {
    console.log(app);
    setTeacherNameToApprove(app.teacherName); // Set teacher's name for the modal
    setSelectedApplication(app.applicationId); // Set selected application ID
    setIsApproveModalOpen(true); // Open the approval confirmation modal
  };

  const handleApproveApplication = async () => {
    if (!selectedApplication) return; // If no application is selected, do nothing
    try {
      await fetchApproveApplication(selectedApplication, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === selectedApplication
            ? { ...app, status: "APPROVED" }
            : app
        )
      );
      toast.success("Application approved successfully");
      setIsApproveModalOpen(false); // Close modal after approval
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
      setIsApproveModalOpen(false);
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
            ? { ...app, status: "REJECTED", rejectionReason }
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

  // Calculate the current data to display based on pagination and search query
  const filteredApplications = applications.filter((app) =>
    app.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredApplications);

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(currentData);

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
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer relative group">
                    <span
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-md shadow-lg"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {app.description}
                    </span>
                    {app.description
                      ? app.description.length > 10
                        ? `${app.description.slice(0, 10)}...`
                        : app.description
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.certificate && app.certificate.length > 0 ? (
                      <div>
                        <button
                          onClick={
                            () => handleViewCertificateClick(app.certificate) // Pass the full certificate array to the modal
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View Certificate
                        </button>

                        {/* Modal to display certificate details */}
                        {isModalApp && selectedCertificates && (
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-3/4 relative overflow-x-auto">
                              <h3 className="text-xl font-semibold mb-4">
                                Certificate Details
                              </h3>
                              <button
                                onClick={handleCloseModalApp}
                                className="absolute top-2 right-2 px-5 py-5 text-lg font-bold"
                              >
                                X
                              </button>

                              {/* Table to display all certificates */}
                              <table className="min-w-full table-auto">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">
                                      Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                      File
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedCertificates.map((cert, index) => (
                                    <tr key={cert.id} className="border-t">
                                      <td className="px-4 py-2">{index + 1}</td>
                                      <td className="px-4 py-2">{cert.name}</td>
                                      <td className="px-4 py-2">
                                        <a
                                          href={cert.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500"
                                        >
                                          View File
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
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
                    {app.status.charAt(0).toUpperCase() +
                      app.status.slice(1).toLowerCase()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.teacherName.length > 12
                      ? `${app.teacherName.slice(0, 12)}...`
                      : app.teacherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer relative group">
                    {app.status === "REJECTED" && app.rejectionReason ? (
                      <>
                        <span
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-md shadow-lg z-10"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {app.rejectionReason}
                        </span>
                        {app.rejectionReason.length > 10
                          ? `${app.rejectionReason.slice(0, 10)}...`
                          : app.rejectionReason}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {app.status === "ASSIGNED" && (
                      <>
                        <button
                          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                          onClick={() => handleApproveClick(app)} // Open the approval modal
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
      {isApproveModalOpen && (
        <ModalApprove onClose={() => setIsApproveModalOpen(false)}>
          <div className="flex justify-center items-center flex-col">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <div className="flex justify-center items-center text-center p-2">
              <h2 className="text-xl font-semibold">
                Are you sure you want to approve the application for{" "}
                <span className="font-bold text-blue-600">
                  {teacherNameToApprove}
                </span>{" "}
                ?
              </h2>
            </div>

            <div className="mt-4">
              <button
                className="px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mr-5"
                onClick={handleApproveApplication}
              >
                Yes
              </button>
              <button
                className="px-5 py-3 rounded-md bg-gray-300 text-black hover:bg-gray-400 transition duration-200"
                onClick={() => setIsApproveModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </ModalApprove>
      )}
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
