import { useState } from "react";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [selectedId, setSelectedId] = useState(null);
  console.log(appother);
  const filteredApplications = appother.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = async () => {
    const token = sessionStorage.getItem("token");
    try {
      if (actionType === "approve") {
        await approveOtherApp(selectedId, token);
        toast.success("Application approved successfully!");
        setAppOther((prevApplications) =>
          prevApplications.map((app) =>
            app.applicationUserId === selectedId
              ? { ...app, status: "completed" }
              : app
          )
        );
      } else if (actionType === "reject") {
        await rejectAppOther(selectedId, token);
        toast.success("Application rejected successfully!");
        setAppOther((prevApplications) =>
          prevApplications.map((app) =>
            app.applicationUserId === selectedId
              ? { ...app, status: "rejected" }
              : app
          )
        );
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Something went wrong!");
    } finally {
      setModalVisible(false);
    }
  };

  const openModal = (type, id) => {
    setActionType(type);
    setSelectedId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActionType("");
    setSelectedId(null);
  };

  return (
    <div>
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <div className="mb-4">
              {actionType === "approve" ? (
                <div className="text-green-500">
                  <Search size={48} className="mx-auto" />
                  <p className="font-semibold text-lg mt-2">
                    Are you sure you want to approve this application?
                  </p>
                </div>
              ) : (
                <div className="text-red-500">
                  <Search size={48} className="mx-auto" />
                  <p className="font-semibold text-lg mt-2">
                    Are you sure you want to reject this application?
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAction}
                className={`px-4 py-2 rounded text-white ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="flex justify-between items-center mb-4">
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

      {/* Applications Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Table Headers */}
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
                const { studentRollNo } = parseDescription(app.description);
                return (
                  <tr
                    key={app.applicationUserId}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    {/* Table Data */}
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
                      {app.description
                        .split(", ")
                        .find((part) => part.startsWith("Reason:"))
                        .split(": ")[1] || "N/A"}
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
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {studentRollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              openModal("approve", app.applicationUserId)
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              openModal("reject", app.applicationUserId)
                            }
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
