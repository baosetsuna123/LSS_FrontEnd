import { fetchClassbyteacher, fetchCoursesService } from "@/data/api";
import { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Separate states for the two modals
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    class: null,
  });
  const [studentsListModal, setStudentsListModal] = useState({
    isOpen: false,
    class: null,
  });

  const result = localStorage.getItem("result");
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classesRes, coursesRes] = await Promise.all([
          fetchClassbyteacher(token),
          fetchCoursesService(token),
        ]);

        const newClasses = classesRes.map((classItem) => {
          const course = coursesRes.find(
            (course) => course.courseCode === classItem.courseCode
          );
          return {
            ...classItem,
            courseName: course ? course.name : "Undefined course",
          };
        });
        const sortedData = newClasses.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setClasses(sortedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleShowDetails = (cls) => {
    setDetailsModal({ isOpen: true, class: cls });
  };

  const handleShowStudentList = (cls) => {
    setStudentsListModal({ isOpen: true, class: cls });
  };

  const handleCloseDetailsModal = () => {
    setDetailsModal({ isOpen: false, class: null });
  };

  const handleCloseStudentListModal = () => {
    setStudentsListModal({ isOpen: false, class: null });
  };

  const dayOfWeekMap = {
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
    8: "Sunday",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const slotTimeMap = {
    1: "7h00 - 9h15",
    2: "9h30 - 11h45",
    3: "12h30 - 14h45",
    4: "15h00 - 17h15",
    5: "17h45 - 20h00",
  };

  const filteredClasses = classes.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "ALL" || cls.status === filterStatus)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Lesson List
      </h2>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search lesson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Ongoing</option>
          <option value="ONGOING">Active</option>
          <option value="CANCELED">Canceled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-2 text-center">Lesson Name</th>
                  <th className="py-3 px-2 text-center">Subject</th>
                  <th className="py-3 px-2 text-center">Students</th>
                  <th className="py-3 px-2 text-center">Schedule</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-center">Time</th>
                  <th className="py-3 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentItems.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{cls.name}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{cls.courseName}</td>
                    <td className="py-3 px-6 text-center">{cls.maxStudents}</td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {`${formatDate(cls.startDate)} (${
                        dayOfWeekMap[cls.dayOfWeek] || "Unknown"
                      })`}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-bold ${
                          cls.status === "PENDING"
                            ? "bg-yellow-200 text-yellow-600"
                            : cls.status === "ACTIVE"
                            ? "bg-purple-200 text-purple-600"
                            : cls.status === "ONGOING"
                            ? "bg-blue-200 text-blue-600"
                            : cls.status === "CANCELED"
                            ? "bg-red-200 text-red-600"
                            : cls.status === "COMPLETED"
                            ? "bg-green-200 text-green-600"
                            : ""
                        }`}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <span className="bg-blue-200 text-blue-800 rounded-full py-1 px-4 text-xs font-semibold">
                        {slotTimeMap[cls.slotId] || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleShowDetails(cls)}
                        className="text-white font-bold bg-blue-600 hover:bg-blue-700 border border-blue-600 px-4 py-2 rounded-md mr-2"
                      >
                        Details
                      </button>
                      {
                        <button
                          onClick={() => handleShowStudentList(cls)}
                          className="text-white font-bold bg-green-600 hover:bg-green-700 border border-green-600 px-4 py-2 rounded-md"
                        >
                          List
                        </button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {detailsModal.isOpen && (
        <DetailsModal
          cls={detailsModal.class}
          onClose={handleCloseDetailsModal}
          dayOfWeekMap={dayOfWeekMap}
          formatDate={formatDate}
          slotTimeMap={slotTimeMap}
        />
      )}
      {studentsListModal.isOpen && (
        <StudentsListModal
          cls={studentsListModal.class}
          onClose={handleCloseStudentListModal}
        />
      )}
    </div>
  );
}

function DetailsModal({ cls, onClose, dayOfWeekMap, formatDate, slotTimeMap }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900">{cls.name}</h3>
          <div className="mt-4 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Subject:</strong> {cls.courseName}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Students:</strong> {cls.maxStudents}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Schedule:</strong>{" "}
              {`${formatDate(cls.startDate)} (${
                dayOfWeekMap[cls.dayOfWeek] || "Unknown"
              })`}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`
                  ${
                    cls.status === "COMPLETED" ? "font-bold text-green-500" : ""
                  }
                  ${cls.status === "PENDING" ? "font-bold text-yellow-500" : ""}
                  ${cls.status === "CANCELED" ? "font-bold text-red-500" : ""}
                  ${cls.status === "ONGOING" ? "font-bold text-blue-500" : ""}
                  ${cls.status === "ACTIVE" ? "font-bold text-orange-500" : ""}
                `}
              >
                {cls.status}
              </span>
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Students Joined:</strong> {cls.students.length}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Teacher:</strong> {cls.teacherName}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Time:</strong> {slotTimeMap[cls.slotId] || "Unknown"}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Location:</strong>
              <button
                onClick={() => window.open(cls.location, "_blank")}
                className="ml-2 text-gray-700 bg-gray-200 py-1 px-3 rounded-md text-xs font-medium hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Meet URL
              </button>
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full font-medium shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsListModal({ cls, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Student List</h3>
        <ScrollArea>
          {cls.students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cls.students.map((student, index) => (
                  <TableRow key={student.email}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{student.userName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-gray-500">
              No students have ordered yet.
            </p>
          )}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="destructive">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClassList;
