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
import {
  FaUsers,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

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

  useEffect(() => {
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
  console.log(indexOfLastItem, indexOfFirstItem);
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Class List
      </h2>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search class..."
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
                  <th className="py-3 px-2 text-center">Class Name</th>
                  <th className="py-3 px-2 text-center">Subject</th>
                  <th className="py-3 px-2 text-center">Students</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentItems.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 text-center px-6  whitespace-nowrap">
                      <span className="font-medium">{cls.name}</span>
                    </td>
                    <td className="py-3 px-6 text-center">{cls.courseName}</td>
                    <td className="py-3 px-6 text-center">{cls.maxStudents}</td>

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

function DetailsModal({ cls, onClose }) {
  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELED: "bg-red-100 text-red-800",
      ONGOING: "bg-blue-100 text-blue-800",
      ACTIVE: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const timeRanges = {
    1: "7:00 - 9:15",
    2: "9:30 - 11:45",
    3: "12:30 - 14:45",
    4: "15:00 - 17:15",
    5: "17:45 - 20:00",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-900">{cls.name}</h3>
          <p className="text-lg text-gray-600 mt-2">{cls.courseName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoItem
            icon={<FaUsers />}
            label="Max Students"
            value={cls.maxStudents}
          />
          <InfoItem
            icon={<FaUsers />}
            label="Students Joined"
            value={cls.students.length}
          />
          <InfoItem
            icon={<FaChalkboardTeacher />}
            label="Tutor"
            value={cls.teacherName}
          />
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Location</p>
              <button
                onClick={() => window.open(cls.location, "_blank")}
                className="text-blue-500 hover:text-blue-700 transition duration-200 text-sm font-medium"
              >
                Open Meet URL
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              cls.status
            )}`}
          >
            {cls.status}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Class Schedule
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slots
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cls?.dateSlots?.map((slot, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {slot.date}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {slot.slotIds
                        .sort((a, b) => a - b)
                        .map((slotId, idx) => (
                          <div
                            key={idx}
                            className="flex items-center mb-1 last:mb-0"
                          >
                            <FaClock className="text-blue-500 mr-2" />
                            <span>
                              Slot {slotId}:{" "}
                              {timeRanges[slotId] || "No time available"}
                            </span>
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="text-blue-500 mr-3 text-xl">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-gray-600">{value}</p>
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
