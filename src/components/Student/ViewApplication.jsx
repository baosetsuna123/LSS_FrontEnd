import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCancelApplication, viewAllApplications } from "@/data/api";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { useWallet } from "@/context/WalletContext";

const parseDescription = (description) => {
  const accountMatch = description.match(/Account number: (\d+)/);
  const bankMatch = description.match(/Bank: (\w+)/);
  const reasonMatch = description.match(/Reason: (.+)/);
  const studentRollNoMatch = description.match(/Student Roll No: (\w+)/);

  return {
    accountNumber: accountMatch ? accountMatch[1] : "N/A",
    bank: bankMatch ? bankMatch[1] : "N/A",
    reason: reasonMatch ? reasonMatch[1] : "N/A",
    studentRollNo: studentRollNoMatch ? studentRollNoMatch[1] : "N/A",
  };
};

export function ApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const { balance, loadBalance } = useWallet();
  const token = sessionStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    if (token) {
      loadBalance(token);
    }
  }, [token, loadBalance]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Withdraw Applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawPage, setWithdrawPage] = useState(1); // Separate page for Withdraw Applications
  const [otherPage, setOtherPage] = useState(1); // Separate page for Other Applications
  const [applicationsPerPage] = useState(5);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await viewAllApplications(token);
        setApplications(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    fetchApplications();
  }, [token]);
  const [selectedApp, setSelectedApp] = useState(null);
  const handleShowModal = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };
  // Filter applications based on search query
  useEffect(() => {
    const filtered = applications.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);
  const handleCloseModal = () => setShowModal(false);

  const handleCancelApplication = async () => {
    if (!selectedApp) return;

    const amountToRefund = selectedApp.amountFromDescription;
    const newBalance = balance + amountToRefund;

    try {
      await fetchCancelApplication(selectedApp.applicationUserId, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === selectedApp.applicationUserId
            ? { ...app, status: "Canceled" }
            : app
        )
      );
      loadBalance(token); // Update balance after cancel
      toast.success(
        `Application canceled successfully!\nNew balance: ${formatCurrency(
          newBalance
        )}`
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error canceling application:", error);
      toast.error("Failed to cancel the application.");
    }
  };

  // Filter applications based on selected tab
  const withdrawApplications = filteredApplications.filter(
    (app) => app.applicationType.name === "Withdraw Application"
  );
  const otherApplications = filteredApplications.filter(
    (app) => app.applicationType.name === "Other Application"
  );

  // Pagination for Withdraw Applications
  const indexOfLastWithdrawApp = withdrawPage * applicationsPerPage;
  const indexOfFirstWithdrawApp = indexOfLastWithdrawApp - applicationsPerPage;
  const currentWithdrawApplications = withdrawApplications.slice(
    indexOfFirstWithdrawApp,
    indexOfLastWithdrawApp
  );

  // Pagination for Other Applications
  const indexOfLastOtherApp = otherPage * applicationsPerPage;
  const indexOfFirstOtherApp = indexOfLastOtherApp - applicationsPerPage;
  const currentOtherApplications = otherApplications.slice(
    indexOfFirstOtherApp,
    indexOfLastOtherApp
  );

  const paginateWithdraw = (pageNumber) => setWithdrawPage(pageNumber);
  const paginateOther = (pageNumber) => setOtherPage(pageNumber);
  const [role, setRole] = useState("");
  useEffect(() => {
    const storedData = localStorage.getItem("result");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRole(parsedData.role);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Your Applications</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-4 flex space-x-4">
        <Button
          className={`${
            selectedTab === "Withdraw Applications"
              ? "bg-blue-600 text-white font-semibold border-blue-600"
              : "bg-white text-blue-600 border-blue-600"
          } px-4 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-500 hover:text-white`}
          onClick={() => setSelectedTab("Withdraw Applications")}
        >
          Withdraw Applications
        </Button>

        <Button
          className={`${
            selectedTab === "Other Applications"
              ? "bg-blue-600 text-white font-semibold border-blue-600"
              : "bg-white text-blue-600 border-blue-600"
          } px-4 py-2 rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-500 hover:text-white`}
          onClick={() => setSelectedTab("Other Applications")}
        >
          Other Applications
        </Button>
      </div>

      {/* Tab Content */}
      {selectedTab === "Withdraw Applications" && (
        <>
          {withdrawApplications.length === 0 ? (
            <p className="flex items-center text-red-500 justify-center text-center w-full h-full">
              No Data
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentWithdrawApplications.map((app, index) => {
                  const { accountNumber, bank } = parseDescription(
                    app.description
                  );
                  return (
                    <TableRow key={app.applicationUserId}>
                      <TableCell>
                        {index + 1 + (withdrawPage - 1) * applicationsPerPage}
                      </TableCell>
                      <TableCell>{app.applicationType.name}</TableCell>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{accountNumber}</TableCell>
                      <TableCell>{bank}</TableCell>
                      <TableCell>
                        {app.amountFromDescription
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(app.amountFromDescription)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 rounded-full font-semibold text-sm transition-colors duration-200 ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:border-yellow-600 dark:hover:bg-yellow-700"
                              : app.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-700"
                              : app.status === "Canceled"
                              ? "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-700"
                              : "bg-gray-100 text-gray-700 border border-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.status === "pending" && (
                          <Button
                            className="px-4 py-2 text-white dark:bg-red-400 dark:hover:bg-red-500 bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                            onClick={() => handleShowModal(app)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {showModal && selectedApp && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-full sm:w-96 p-6 shadow-xl transform transition-all scale-95 hover:scale-100">
                      <div className="flex items-center mb-4 border-b border-gray-200 pb-3">
                        <FaInfoCircle className="text-blue-500 mr-3 text-2xl" />
                        <h3 className="text-2xl font-semibold text-gray-800">
                          Cancel Application
                        </h3>
                      </div>

                      <div className="text-gray-700 mb-4">
                        <p className="text-lg">
                          Are you sure you want to cancel the application for{" "}
                          <strong className="font-semibold">
                            {selectedApp.name}
                          </strong>
                          ?
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-xl font-semibold text-green-600">
                          New Balance:{" "}
                          {formatCurrency(
                            balance + selectedApp.amountFromDescription
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between mt-6">
                        <button
                          className="w-full sm:w-auto mt-3 sm:mt-0 text-lg px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200"
                          onClick={handleCancelApplication}
                        >
                          Yes
                        </button>
                        <button
                          className="w-full sm:w-auto px-6 py-2 text-lg bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                          onClick={handleCloseModal}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {applications.length > applicationsPerPage &&
            withdrawApplications.length > 0 &&
            searchQuery === "" && (
              <div className="flex justify-end items-center mt-4">
                <div className="flex items-center">
                  <Button
                    onClick={() => paginateWithdraw(withdrawPage - 1)}
                    disabled={withdrawPage === 1}
                    className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-full p-2"
                  >
                    <FaChevronLeft />
                  </Button>

                  <span className="px-4 text-lg">{withdrawPage}</span>

                  <Button
                    onClick={() => paginateWithdraw(withdrawPage + 1)}
                    disabled={
                      withdrawPage ===
                      Math.ceil(
                        withdrawApplications.length / applicationsPerPage
                      )
                    }
                    className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-full p-2"
                  >
                    <FaChevronRight />
                  </Button>
                </div>
              </div>
            )}
        </>
      )}

      {selectedTab === "Other Applications" && (
        <>
          {otherApplications.length === 0 ? (
            <p className="flex items-center text-red-500 justify-center text-center w-full h-full">
              No Data
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  {role !== "TEACHER" && (
                    <TableHead>Roll Number</TableHead>
                  )}{" "}
                  {/* Conditionally render the Roll Number column */}
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOtherApplications.map((app, index) => {
                  const { studentRollNo, reason } = parseDescription(
                    app.description
                  );
                  return (
                    <TableRow key={app.applicationUserId}>
                      <TableCell>
                        {index + 1 + (otherPage - 1) * applicationsPerPage}
                      </TableCell>
                      <TableCell>{app.applicationType.name}</TableCell>
                      <TableCell>{app.name}</TableCell>
                      {role !== "TEACHER" && (
                        <TableCell>{studentRollNo}</TableCell>
                      )}{" "}
                      {/* Conditionally render Roll Number data */}
                      <TableCell>{reason}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 rounded-full font-semibold text-sm transition-colors duration-200 ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:border-yellow-600 dark:hover:bg-yellow-700"
                              : app.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-700"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-700"
                              : "bg-gray-100 text-gray-700 border border-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {otherApplications.length > applicationsPerPage &&
            otherApplications.length > 0 &&
            searchQuery === "" && (
              <div className="flex justify-end items-center mt-4">
                <div className="flex items-center">
                  <Button
                    onClick={() => paginateOther(otherPage - 1)}
                    disabled={otherPage === 1}
                    className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-full p-2"
                  >
                    <FaChevronLeft />
                  </Button>

                  <span className="px-4 text-lg">{otherPage}</span>

                  <Button
                    onClick={() => paginateOther(otherPage + 1)}
                    disabled={
                      otherPage ===
                      Math.ceil(otherApplications.length / applicationsPerPage)
                    }
                    className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-full p-2"
                  >
                    <FaChevronRight />
                  </Button>
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}
