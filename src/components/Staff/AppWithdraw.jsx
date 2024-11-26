import { completeWithdrawalRequest } from "@/data/api"; // Import the API function
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import { useState } from "react"; // Import useState for modal visibility
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const AppWithDraw = ({
  currentPage,
  itemsPerPage,
  appwithdraw,
  setAppWithdraw,
  searchQuery,
  setSearchQuery,
}) => {
  const token = sessionStorage.getItem("token"); // Get the token from session storage
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedApp, setSelectedApp] = useState(null); // Store selected application
  const [approvalImage, setApprovalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(appwithdraw);
  const handleClick = (app) => {
    setSelectedApp(app); // Store the selected application
    setShowModal(true); // Show the confirmation modal
  };

  const handleApprove = async () => {
    if (!approvalImage) {
      toast.error("Please choose an approval image before submitting.");
      return;
    }
    setLoading(true);
    try {
      // Call the completeWithdrawalRequest function with the required arguments
      const response = await completeWithdrawalRequest(
        selectedApp.applicationUserId,
        token,
        approvalImage
      );
      console.log("Withdraw", response);

      // Update the application status to "completed"
      setAppWithdraw((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === selectedApp.applicationUserId
            ? { ...app, status: "completed" }
            : app
        )
      );

      toast.success("Application approved successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal if Cancel is clicked
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredApplications = appwithdraw.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const parseDescription = (description) => {
    const accountMatch = description.match(/Account number: (\d+)/);
    const bankMatch = description.match(/Bank: ([^,]+)/);

    return {
      accountNumber: accountMatch ? accountMatch[1] : "N/A",
      bank: bankMatch ? bankMatch[1] : "N/A",
    };
  };
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
  return (
    <div>
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
                Account Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((app, index) => {
                const { accountNumber, bank } = parseDescription(
                  app.description
                );
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
                      {accountNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bank || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold text-sm rounded-lg ${
                        app.status === "completed"
                          ? " text-green-500"
                          : app.status === "pending"
                          ? " text-yellow-500"
                          : app.status === "Canceled"
                          ? " text-red-500"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(app.amountFromDescription) || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleClick(app)}
                        disabled={
                          app.status === "completed" ||
                          app.status === "Canceled"
                        }
                        className={`px-4 py-2 text-white rounded-md transition duration-200 ${
                          app.status === "completed" ||
                          app.status === "Canceled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {app.status === "completed"
                          ? "Approved"
                          : app.status === "Canceled"
                          ? "Cancelled"
                          : "Approve"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Confirmation */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <span className="text-green-500 text-4xl">✔️</span>{" "}
              {/* Icon for confirmation */}
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Are you sure you want to approve this withdrawal?
            </h2>
            <p className="text-center text-lg">
              <strong>{selectedApp.name}</strong>
            </p>
            <p className="text-center text-lg text-green-600">
              {formatCurrency(selectedApp.amountFromDescription)}
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
            <div className="mt-4 flex justify-between">
              {!loading ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 w-24"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-24"
                  >
                    Yes
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
    </div>
  );
};

export default AppWithDraw;
