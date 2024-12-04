import { useEffect, useState } from "react";
import {
  fetchClasses,
  completeClassImmediately,
  activateClassImmediately,
} from "@/data/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusOptions = [
  "ALL",
  "COMPLETED",
  "CANCELED",
  "PENDING",
  "ONGOING",
  "ACTIVE",
];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const token = sessionStorage.getItem("token");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetchClasses(token);
        const sortedData = response.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setClasses(sortedData);
        setFilteredClasses(sortedData);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClassData();
  }, [token]);

  useEffect(() => {
    const filtered = classes.filter(
      (cls) =>
        (statusFilter === "ALL" || cls.status === statusFilter) &&
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [classes, statusFilter, searchTerm]);

  const handleEdit = (classId, status) => {
    const selectedClass = classes.find((cls) => cls.classId === classId);
    setClassToEdit(selectedClass);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!classToEdit) return;
    try {
      if (newStatus === "ONGOING") {
        await activateClassImmediately(classToEdit.classId, token);
      } else if (newStatus === "COMPLETED") {
        await completeClassImmediately(classToEdit.classId, token);
      }

      const updatedClasses = classes.map((cls) =>
        cls.classId === classToEdit.classId
          ? { ...cls, status: newStatus }
          : cls
      );
      setClasses(updatedClasses);
      setFilteredClasses(updatedClasses);
      setIsModalOpen(false);
      toast.success(`Class status changed to ${newStatus}.`);
    } catch (error) {
      console.error(`Error changing class status to ${newStatus}:`, error);
      toast.error("Failed to update class status. Please try again.");
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by lesson name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Lesson Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tutor Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClasses.map((cls, index) => (
            <TableRow key={cls.classId}>
              <TableCell className="font-medium">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{formatDate(cls.startDate)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full font-semibold text-sm ${
                    cls.status === "PENDING"
                      ? "bg-yellow-300 text-yellow-700"
                      : cls.status === "ACTIVE"
                      ? "bg-blue-300 text-blue-700"
                      : cls.status === "ONGOING"
                      ? "bg-purple-300 text-purple-700"
                      : cls.status === "COMPLETED"
                      ? "bg-green-300 text-green-700"
                      : cls.status === "CANCELED"
                      ? "bg-red-300 text-red-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {cls.status.charAt(0).toUpperCase() +
                    cls.status.slice(1).toLowerCase()}
                </span>
              </TableCell>

              <TableCell>{cls.teacherName}</TableCell>
              <TableCell className="text-right">
                {(cls.status === "PENDING" || cls.status === "ACTIVE") && (
                  <Button onClick={() => handleEdit(cls.classId, "ONGOING")}>
                    Edit
                  </Button>
                )}
                {cls.status === "ONGOING" && (
                  <Button onClick={() => handleEdit(cls.classId, "COMPLETED")}>
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredClasses.length)} of{" "}
          {filteredClasses.length} results
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Modal for updating the class status */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Change Lesson Status</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to change the status of this lesson to{" "}
                  <span className="font-bold text-green-500">{newStatus}</span>?
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                className="bg-green-500 text-white"
              >
                Yes, Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
