import { AssignApplication, fetchAppAdmin } from "@/data/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { Button } from "../ui/button";

const RegisterApp = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const loadApplications = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    try {
      const data = await fetchAppAdmin(token);
      console.log(data.content);
      const sortedData = data.content.sort(
        (a, b) => new Date(b.applicationId) - new Date(a.applicationId)
      );
      setApplications(sortedData || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to fetch applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    const matchesSearch = app.teacherName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pageCount = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [isModalApp, setIsModalApp] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const handleViewCertificateClick = (certificates) => {
    setSelectedCertificates(certificates); // Set the full array of certificates
    setIsModalApp(true); // Open the modal
  };
  const handleCloseModalApp = () => {
    setIsModalApp(false);
  };
  const handleClick = async () => {
    try {
      await AssignApplication();
      await loadApplications();
      toast.success("Pending applications assigned successfully!");
    } catch (error) {
      console.error("Error assigning applications", error);
      toast.error("Failed to assign applications!");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Register Applications
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="REJECTED">Rejected</option>
          <option value="APPROVED">Approved</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="PENDING">Pending</option>
        </select>

        <input
          type="text"
          placeholder="Search by tutor name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Portfolio
                  </th>
                  <th className="px-6 py-3 whitespace-nowrap  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Assigned
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApplications.length > 0 ? (
                  paginatedApplications.map((app, index) => (
                    <tr key={app.applicationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium cursor-pointer text-gray-500"
                        title={app.description}
                      >
                        {app.description.length > 10
                          ? `${app.description.slice(0, 10)}...`
                          : app.description}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.teacherName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : app.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : app.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                        {app.certificate && app.certificate.length > 0 ? (
                          <div>
                            <button
                              onClick={() =>
                                handleViewCertificateClick(app.certificate)
                              } // Pass the full certificate array to the modal
                              className="text-blue-600 hover:underline"
                            >
                              View Portfolio
                            </button>

                            {/* Modal to display certificate details */}
                            {isModalApp && selectedCertificates && (
                              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-lg w-3/4 relative overflow-x-auto">
                                  <h3 className="text-xl font-semibold mb-4">
                                    Portfolio Details
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
                                        <th className="px-4 py-2 text-left">
                                          ID
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                          Name
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                          File
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {selectedCertificates.map(
                                        (cert, index) => (
                                          <tr
                                            key={cert.id}
                                            className="border-t"
                                          >
                                            <td className="px-4 py-2">
                                              {index + 1}
                                            </td>
                                            <td className="px-4 py-2">
                                              {cert.name}
                                            </td>
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
                                        )
                                      )}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.assignedStaff || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {applications.some((app) => app.status === "PENDING") && (
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
            )}
          </>
        )}
      </div>

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

export default RegisterApp;
