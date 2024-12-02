import { useState } from "react";
import { rejectAppOther, approveOtherApp } from "@/data/api";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

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
  const [approvalImage, setApprovalImage] = useState(null);

  const sortedData = appother.sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );
  const filteredApplications = sortedData.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [fileName, setFileName] = useState(null); // State to store the file name
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setApprovalImage(file); // Set the file name state
      setFileName(file.name); // Set the file name state
    } else {
      setApprovalImage(null); // If no file is selected, reset the file name state
    } // Store the selected file
  };
  const [loading, setLoading] = useState(false);
  const handleAction = async () => {
    const token = sessionStorage.getItem("token");
    try {
      if (actionType === "approve") {
        if (!approvalImage) {
          toast.error("Please choose an approval image before submitting.");
          return;
        }
        setLoading(true);
        await approveOtherApp(selectedId, token, approvalImage);
        toast.success("Application approved successfully!");
        setAppOther((prevApplications) =>
          prevApplications.map((app) =>
            app.applicationUserId === selectedId
              ? { ...app, status: "completed" }
              : app
          )
        );
        setModalVisible(false);
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
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
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
  // Utility function to extract the value for a given key from a string
  const extractValueFromDescription = (description, key) => {
    const part = description
      .split(", ")
      .find((item) => item.startsWith(`${key}:`));
    return part ? part.split(": ")[1] : "N/A";
  };
  return (
    <div>
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
                  <div className="mt-4 space-y-2">
                    <Label
                      htmlFor="file-upload"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Choose a file
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Select File
                      </Button>
                      <span className="text-sm text-gray-500">
                        {fileName ? fileName : "No file chosen"}
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </div>
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
            <div className="flex justify-between items-center w-full">
              {!loading ? (
                <>
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
                </>
              ) : (
                <div className="w-full flex justify-center">
                  <button
                    disabled
                    className="px-4 py-2 bg-blue-500 text-white rounded-md w-24"
                  >
                    Loading...
                  </button>
                </div>
              )}
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
              currentData.map((app, index) => {
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
                    <td className="px-6 py-4 whitespace-nowrap relative group">
                      <span
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-md shadow-lg"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {extractValueFromDescription(app.description, "Reason")}
                      </span>
                      {extractValueFromDescription(app.description, "Reason")
                        .length > 30
                        ? `${extractValueFromDescription(
                            app.description,
                            "Reason"
                          ).slice(0, 30)}...`
                        : extractValueFromDescription(
                            app.description,
                            "Reason"
                          )}
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
