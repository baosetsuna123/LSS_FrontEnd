import { useState, useEffect } from "react";
import { fetchApplicationStaff, fetchApproveApplication } from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";

const ApplicationLayout = ({ currentPage, itemsPerPage }) => {
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

  // Calculate the current data to display based on pagination
  const currentData = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
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
            {currentData.map((app, index) => (
              <tr key={app.applicationId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(currentPage - 1) * itemsPerPage + index + 1}{" "}
                  {/* Calculate sequential ID */}
                </td>
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
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationLayout;
