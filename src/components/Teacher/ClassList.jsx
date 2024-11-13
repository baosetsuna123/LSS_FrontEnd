import { fetchClassbyteacher, fetchCoursesService } from "@/data/api";
import { useState, useEffect } from "react";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState(null);
  const result = localStorage.getItem("result")
  const [classesUpdated, setClassesUpdated] = useState([]);
  const [courses, setCourses] = useState([])
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
      console.log(error)
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  useEffect(() => {
    if (classes.length > 0 && courses.length > 0) {
      const newClasses = classes.map((classItem) => {
        const course = courses.find(course => course.courseCode === classItem.courseCode);
        return {
          ...classItem,
          courseName: course ? course.name : "Undefined course"
        };
      });
      setClassesUpdated(newClasses);
    }
  }, [classes, courses])

  const fetchCourses = async () => {
    try {
      const res = await fetchCoursesService(token);
      setCourses(res);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredClasses = classesUpdated.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || cls.status === filterStatus)
  );

  const handleShowDetails = (cls) => {
    setSelectedClass(cls);
  };

  const handleClosePopup = () => {
    setSelectedClass(null);
  };

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
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Ongoing</option>
          <option value="INACTIVE">Upcoming</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Class Name</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-center">Students</th>
              <th className="py-3 px-6 text-center">Schedule</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Time</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredClasses.map((cls) => (
              <tr
                key={cls.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{cls.name}</span>
                </td>
                <td className="py-3 px-6 text-left">{cls.courseName}</td>
                <td className="py-3 px-6 text-center">{cls.maxStudents}</td>
                <td className="py-3 px-6 text-center">{cls.schedule}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={` bg-${cls.status === "ACTIVE"
                      ? "green"
                      : cls.status === "INACTIVE"
                        ? "yellow"
                        : "red"
                      }-200 text-${cls.status === "ACTIVE"
                        ? "green"
                        : cls.status === "INACTIVE"
                          ? "yellow"
                          : "red"
                      }-600 py-1 px-3 rounded-full text-xs`}
                  >
                    {cls.status === "ACTIVE"
                      ? "Ongoing"
                      : cls.status === "INACTIVE"
                        ? "Upcoming"
                        : "Completed"}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {cls.startDate.split('T')[0]} {'->'} {" "}
                  {cls.endDate.split('T')[0]}
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
      </div>

      {selectedClass && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedClass.name}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Subject:</strong> {selectedClass.courseName}
                  <br />
                  <strong>Students:</strong> {selectedClass.maxStudents}
                  <br />
                  <strong>Schedule:</strong> {selectedClass.schedule}
                  <br />
                  <strong>Status:</strong> {selectedClass.status === "ACTIVE"
                    ? "Ongoing"
                    : selectedClass.status === "INACTIVE"
                      ? "Upcoming"
                      : "Completed"}
                  <br />
                  <strong>Time:</strong> {selectedClass.startDate.split('T')[0]} {'->'} {" "}
                  {selectedClass.endDate.split('T')[0]}
                  <br />
                  <strong>Teacher:</strong> {selectedClass.teacherName}
                  <br />
                  <strong>Location:</strong> {selectedClass.location}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleClosePopup}
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
