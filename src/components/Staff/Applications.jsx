import { useState } from "react";
import { CheckCircle, Search, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RejectModal from "../Helper/RejectModal";
import ModalApprove from "./ModalApprove";
import { fetchApproveApplication, rejectApplication } from "@/data/api";

const ApplicationLayout = ({
  applications,
  setApplications,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadinga, setLoadinga] = useState(false);
  const [loadingr, setLoadingr] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [teacherNameToApprove, setTeacherNameToApprove] = useState("");
  const [isModalApp, setIsModalApp] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);

  const token = sessionStorage.getItem("token");

  const handleViewCertificateClick = (certificates) => {
    setSelectedCertificates(certificates);
    setIsModalApp(true);
  };

  const handleCloseModalApp = () => {
    setIsModalApp(false);
  };

  const handleApproveClick = (app) => {
    setTeacherNameToApprove(app.teacherName);
    setSelectedApplication(app.applicationId);
    setIsApproveModalOpen(true);
  };

  const handleApproveApplication = async () => {
    if (!selectedApplication) return;
    try {
      setLoadinga(true);
      await fetchApproveApplication(selectedApplication, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === selectedApplication
            ? { ...app, status: "APPROVED" }
            : app
        )
      );
      toast.success("Application approved successfully");
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application.");
      setIsApproveModalOpen(false);
    } finally {
      setLoadinga(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Rejection reason must not be empty.");
      return;
    }

    try {
      setLoadingr(true);
      await rejectApplication(selectedApplication, rejectionReason, token);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.applicationId === selectedApplication
            ? { ...app, status: "REJECTED", rejectionReason }
            : app
        )
      );
      toast.success("Application rejected successfully");
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error("Failed to reject application.");
    } finally {
      setIsModalOpen(false);
      setRejectionReason("");
      setLoadingr(false);
      setSelectedApplication(null);
    }
  };

  const sortedData = applications.sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );

  const filteredApplications = sortedData.filter((app) =>
    app.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex items-center border rounded p-2"
          style={{ width: "330px" }}
        >
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search Applications by Tutor Name"
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
                Portfolio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutor Name
              </th>
              <th className="px-6 whitespace-nowrap py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rejection Reason
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative group">
                    {app.description
                      ? app.description.length > 10
                        ? `${app.description.slice(0, 10)}...`
                        : app.description
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.certificate && app.certificate.length > 0 ? (
                      <div>
                        <button
                          onClick={() =>
                            handleViewCertificateClick(app.certificate)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View Portfolio
                        </button>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold text-sm rounded-lg ${
                      app.status === "APPROVED"
                        ? "text-green-500"
                        : app.status === "ASSIGNED"
                        ? "text-yellow-500"
                        : app.status === "REJECTED"
                        ? "text-red-500"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() +
                      app.status.slice(1).toLowerCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.teacherName.length > 12
                      ? `${app.teacherName.slice(0, 12)}...`
                      : app.teacherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.rejectionReason
                      ? app.rejectionReason.length > 10
                        ? `${app.rejectionReason.slice(0, 10)}...`
                        : app.rejectionReason
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mr-2">
                          <Info className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[600px]">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          {/* Description - Text above the content */}
                          <div className="mb-4">
                            <span className="font-bold">Description:</span>
                            <div>{app.description || "N/A"}</div>
                          </div>

                          {/* Portfolio */}
                          <div className="mb-4">
                            <span className="font-bold">Portfolio:</span>
                            <div>
                              {app.certificate && app.certificate.length > 0 ? (
                                <ul className="list-disc pl-5">
                                  {app.certificate.map((cert, index) => (
                                    <li key={index}>
                                      <a
                                        href={cert.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        {cert.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "No portfolio available"
                              )}
                            </div>
                          </div>

                          {/* Rejection Reason (if available) */}
                          {app.rejectionReason && (
                            <div className="mb-4">
                              <span className="font-bold">
                                Rejection Reason:
                              </span>
                              <div>{app.rejectionReason}</div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {app.status === "ASSIGNED" && (
                      <>
                        <Button
                          className="mr-2 bg-green-500 hover:bg-green-600"
                          onClick={() => handleApproveClick(app)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedApplication(app.applicationId);
                            setIsModalOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalApp && selectedCertificates && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 relative overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Portfolio Details</h3>
            <button
              onClick={handleCloseModalApp}
              className="absolute top-2 right-2 px-5 py-5 text-lg font-bold"
            >
              X
            </button>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {selectedCertificates.map((cert, index) => (
                  <tr key={cert.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{cert.name}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isApproveModalOpen && (
        <ModalApprove onClose={() => setIsApproveModalOpen(false)}>
          <div className="flex justify-center items-center flex-col">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <div className="flex justify-center items-center text-center p-2">
              <h2 className="text-xl font-semibold">
                Are you sure you want to approve the application for{" "}
                <span className="font-bold text-blue-600">
                  {teacherNameToApprove}
                </span>
                ?
              </h2>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleApproveApplication}
                className="mr-2 bg-green-500 hover:bg-green-600"
                disabled={loadinga}
              >
                {loadinga ? "Approving..." : "Yes"}
              </Button>
              <Button
                variant="secondary"
                disabled={loadinga}
                onClick={() => setIsApproveModalOpen(false)}
              >
                No
              </Button>
            </div>
          </div>
        </ModalApprove>
      )}

      <RejectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReject}
        loadingr={loadingr}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
      />
    </div>
  );
};

export default ApplicationLayout;
