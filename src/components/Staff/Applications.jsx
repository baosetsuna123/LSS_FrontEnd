import { useState, useEffect } from "react";
import { fetchApplicationStaff, fetchApproveApplication } from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

const ApplicationLayout = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
}) => {
  const [applications, setApplications] = useState([]); // State to hold application data
  const token = sessionStorage.getItem("token"); // Get the token from session storage

  const handleClick = async (id) => {
    try {
      const response = await fetchApproveApplication(id, token);
      console.log(response);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === id ? { ...app, status: "APPROVE" } : app
        )
      );
      toast.success("Application approved successfully");
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
    }
  };

  // Fetch application data on component mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplicationStaff(token);
        const application = data.content;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teacher Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.teacherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`px-4 py-2 rounded-md transition duration-200 ${
                        app.status === "APPROVE"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handleClick(app.applicationId)}
                      disabled={app.status === "APPROVE"}
                    >
                      {app.status === "APPROVE" ? "Approved" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationLayout;
