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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing pagination icons

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
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Withdraw Applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawPage, setWithdrawPage] = useState(1); // Separate page for Withdraw Applications
  const [otherPage, setOtherPage] = useState(1); // Separate page for Other Applications
  const [applicationsPerPage] = useState(5);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await viewAllApplications(token);
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    fetchApplications();
  }, [token]);

  // Filter applications based on search query
  useEffect(() => {
    const filtered = applications.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);

  const handleAction = async (id) => {
    try {
      await fetchCancelApplication(id, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationUserId === id ? { ...app, status: "Canceled" } : app
        )
      );
      toast.success("Application canceled successfully!");
    } catch (error) {
      console.error("Error canceling application:", error);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Application Management</h1>

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
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                              : app.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                              : app.status === "Canceled"
                              ? "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.status === "pending" && (
                          <Button
                            className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                            onClick={() => handleAction(app.applicationUserId)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {searchQuery === "" && (
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
                    Math.ceil(withdrawApplications.length / applicationsPerPage)
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
                  <TableHead>Roll Number</TableHead>
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
                      <TableCell>{studentRollNo}</TableCell>
                      <TableCell>{reason}</TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 rounded-full font-semibold text-sm transition-colors duration-200 ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-400 hover:bg-yellow-200"
                              : app.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-400 hover:bg-gray-200"
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
          {searchQuery === "" && (
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
