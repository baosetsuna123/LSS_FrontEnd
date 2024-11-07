import { rejectAppOther, approveOtherApp } from "@/data/api";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

const parseDescription = (description) => {
  const studentRollNoMatch = description.match(/Student Roll No: (\w+)/);

  return {
    studentRollNo: studentRollNoMatch ? studentRollNoMatch[1] : "N/A",
  };
};

const AppOthers = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  appother,
  setAppOther,
}) => {
  const filteredApplications = appother.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReject = async (id) => {
    const token = sessionStorage.getItem("token"); // Ensure token is retrieved from session storage
    try {
      await rejectAppOther(id, token);
      toast.success("Application rejected successfully!");
      setAppOther((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === id ? { ...app, status: "rejected" } : app
        )
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleApprove = async (id) => {
    const token = sessionStorage.getItem("token"); // Ensure token is retrieved from session storage
    try {
      await approveOtherApp(id, token);
      toast.success("Application approved successfully!");
      setAppOther((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === id ? { ...app, status: "completed" } : app
        )
      );
    } catch (error) {
      console.error("Error approving application:", error);
    }
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
            placeholder="Search Applications by Name"
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
                Roll Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((app, index) => {
                const { studentRollNo } = parseDescription(app.description); // Extract student roll number
                return (
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
                        app.status === "rejected"
                          ? " text-red-500"
                          : app.status === "pending"
                          ? " text-yellow-500"
                          : app.status === "completed"
                          ? " text-green-500"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {studentRollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(app.applicationUserId)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app.applicationUserId)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                          >
                            Reject
                          </button>
                        </>
                      ) : app.status === "completed" ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white rounded-md"
                        >
                          Approved
                        </button>
                      ) : app.status === "rejected" ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white rounded-md"
                        >
                          Rejected
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })
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
