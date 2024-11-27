import { fetchClassbyteacher, fetchCoursesService } from "@/data/api";
import { useState, useEffect } from "react";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedClass, setSelectedClass] = useState(null);
  const result = localStorage.getItem("result");
  const [classesUpdated, setClassesUpdated] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      setClasses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  useEffect(() => {
    if (classes.length > 0 && courses.length > 0) {
      const newClasses = classes.map((classItem) => {
        const course = courses.find(
          (course) => course.courseCode === classItem.courseCode
        );
        return {
          ...classItem,
          courseName: course ? course.name : "Undefined course",
        };
      });
      setClassesUpdated(newClasses);
    }
  }, [classes, courses]);

  const fetchCourses = async () => {
    try {
      const res = await fetchCoursesService(token);
      setCourses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleShowDetails = (cls) => {
    setSelectedClass(cls);
    console.log("Selected class details:", cls);
  };

  const handleClosePopup = () => {
    setSelectedClass(null);
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const slotTimeMap = {
    1: "7h00 - 9h15",
    2: "9h30 - 11h45",
    3: "12h30 - 14h45",
    4: "15h00 - 17h15",
    5: "17h45 - 20h00",
  };

  const filteredClasses = classesUpdated.filter(
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
      {filteredClasses.length === 0 ? (
        <div className="text-red-600 text-center font-semibold text-lg">
          No Class matches with your filter.
        </div>
      ) : (
        <div>
          <table className="min-w-full bg-white w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left w-1/6">Lesson Name</th>
                <th className="py-3 px-6 text-left w-1/6">Subject</th>
                <th className="py-3 px-6 text-center w-1/6">Students</th>
                <th className="py-3 px-6 text-center w-1/6">Schedule</th>
                <th className="py-3 px-6 text-center w-1/6">Status</th>
                <th className="py-3 px-6 text-center w-1/6">Time</th>
                <th className="py-3 px-6 text-center w-1/6">Action</th>
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
                      {cls.status === "PENDING"
                        ? "Pending"
                        : cls.status === "ACTIVE"
                        ? "Active"
                        : cls.status === "ONGOING"
                        ? "Ongoing"
                        : cls.status === "CANCELED"
                        ? "Canceled"
                        : cls.status === "COMPLETED"
                        ? "Completed"
                        : ""}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    <span
                      className={`bg-blue-200 text-blue-800 rounded-full py-1 px-4 text-xs font-semibold`}
                    >
                      {slotTimeMap[cls.slotId] || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleShowDetails(cls)}
                      className="bg-gray-900 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      Details
                    </button>
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
        </div>
      )}

      {selectedClass && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          id="my-modal"
        >
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                {selectedClass.name}
              </h3>
              <div className="mt-4 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Subject:</strong> {selectedClass.courseName}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Students:</strong> {selectedClass.maxStudents}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Schedule:</strong>{" "}
                  {`${formatDate(selectedClass.startDate)} (${
                    dayOfWeekMap[selectedClass.dayOfWeek] || "Unknown"
                  })`}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`
      ${selectedClass.status === "COMPLETED" ? "font-bold text-green-500" : ""}
      ${selectedClass.status === "PENDING" ? "font-bold text-yellow-500" : ""}
      ${selectedClass.status === "CANCELED" ? "font-bold text-red-500" : ""}
      ${selectedClass.status === "ONGOING" ? "font-bold text-blue-500" : ""}
      ${selectedClass.status === "ACTIVE" ? "font-bold text-orange-500" : ""}
    `}
                  >
                    {selectedClass.status.charAt(0).toUpperCase() +
                      selectedClass.status.slice(1).toLowerCase()}
                  </span>
                </p>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Students Joined:</strong>{" "}
                  {selectedClass.students.length}{" "}
                  {selectedClass.students.length > 0 && (
                    <span>
                      (
                      {selectedClass.students.map((student, index) => (
                        <span key={student.userName}>
                          {student.userName}
                          {index < selectedClass.students.length - 1 && ", "}
                        </span>
                      ))}
                      )
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Teacher:</strong> {selectedClass.teacherName}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Time:</strong>{" "}
                  {slotTimeMap[selectedClass.slotId] || "Unknown"}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Location:</strong>
                  <button
                    onClick={() =>
                      window.open(selectedClass.location, "_blank")
                    }
                    className="ml-2 text-gray-700 bg-gray-200 py-1 px-3 rounded-md text-xs font-medium hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Meet URL
                  </button>
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleClosePopup}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full font-medium shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassList;
