import { completeWithdrawalRequest } from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

const AppOthers = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  appother,
  setAppOther,
}) => {
  const token = sessionStorage.getItem("token"); // Get the token from session storage

  const handleClick = async (id) => {
    try {
      const response = await completeWithdrawalRequest(id, token);
      console.log(response);
      setAppOther((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === id ? { ...app, status: "completed" } : app
        )
      );
      toast.success("Application approved successfully");
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
    }
  };

  // Calculate the current data to display based on pagination and search query
  const filteredApplications = appother.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
                    {app.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {
                      app.description
                        .split(", ")
                        .find((part) => part.startsWith("Reason:"))
                        .split(": ")[1]
                    }
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold text-sm rounded-lg ${
                      app.status === "completed"
                        ? " text-green-500"
                        : app.status === "pending"
                        ? " text-yellow-500"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`px-4 py-2 rounded-md transition duration-200 ${
                        app.status === "completed"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handleClick(app.applicationUserId)}
                      disabled={app.status === "completed"}
                    >
                      {app.status === "completed" ? "Approved" : "Approve"}
                    </button>
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
    </div>
  );
};

export default AppOthers;
