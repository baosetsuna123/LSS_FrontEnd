import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listTeacher, activeTeacher } from "@/data/api";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listTeacher(token);
        setTeachers(response.ACTIVE.concat(response.DEACTIVATED)); // Combine active and deactivated teachers
      } catch (error) {
        setError("Failed to load teachers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [token]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      (statusFilter === "ALL" || teacher.status === statusFilter) &&
      teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const toggleUserStatus = async (teacher) => {
    try {
      const newStatus = teacher.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
      await activeTeacher(token, teacher.teacherName);
      toast.success(
        `User ${teacher.teacherName} is now ${newStatus.toLowerCase()}`
      );
      setTeachers((prevUsers) =>
        prevUsers.map((u) =>
          u.teacherName === teacher.teacherName
            ? { ...u, status: newStatus }
            : u
        )
      );
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by teacher name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {filteredTeachers.length === 0 ? (
            <p className="text-center text-red-500">No data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTeachers.map((teacher, index) => (
                  <TableRow key={teacher.teacherId}>
                    <TableCell className="font-medium">
                      {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell>{teacher.teacherName}</TableCell>
                    <TableCell>
                      <span
                        className={`${
                          teacher.status === "ACTIVE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {teacher.status.charAt(0).toUpperCase() +
                          teacher.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell>{teacher.role}</TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={teacher.status === "ACTIVE"}
                        onCheckedChange={() => toggleUserStatus(teacher)}
                        aria-label={`Toggle status for ${teacher.teacherName}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredTeachers.length)} of{" "}
              {filteredTeachers.length} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
