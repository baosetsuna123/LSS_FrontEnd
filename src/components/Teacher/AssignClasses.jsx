import { fetchClassbyteacherName } from "@/data/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function AssignClasses() {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [teacherSpecialization, setTeacherSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const result = localStorage.getItem("result");
  let token;
  let nameTeacher;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
      nameTeacher = parsedResult.fullName;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetchClassbyteacherName(nameTeacher, token);
        setAvailableClasses(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClasses();
    setTeacherSpecialization("Basic graphic design");
  }, [nameTeacher, token]);

  const handleClassSelect = (classId) => {
    const classToSelect = availableClasses.find((cls) => cls.id === classId);
    if (classToSelect.status === "Assigned") {
      toast.success("This class has been assigned. Cannot select.");
      return;
    }
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSubmit = () => {
    toast.success("Send request successfully!");
  };

  const filteredClasses = availableClasses.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCourse === "" || cls.course === filterCourse) &&
      (filterStatus === "" || cls.status === filterStatus)
  );

  const courses = [...new Set(availableClasses.map((cls) => cls.course))];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Assign Classes
      </h2>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          Your major: <strong>{teacherSpecialization}</strong>
        </p>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search Classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Course</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Not Assign">Not Assign</option>
          <option value="Assigned">Assigned</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredClasses.map((cls) => (
          <li
            key={cls.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${
              cls.status === "Assigned" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`class-${cls.id}`}
                checked={selectedClasses.includes(cls.id)}
                onChange={() => handleClassSelect(cls.id)}
                disabled={cls.status === "Assigned"}
                className={`mr-4 h-5 w-5 ${
                  cls.status === "Assigned" ? "text-gray-400" : "text-blue-600"
                }`}
              />
              <label htmlFor={`class-${cls.id}`} className="flex flex-col">
                <span className="font-semibold">
                  {cls.name} - {cls.course}
                </span>
                <span className="text-sm text-gray-600">{cls.schedule}</span>
                <span className="text-sm text-gray-600">
                  Number: {cls.enrolled}/{cls.capacity}
                </span>
              </label>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  cls.course === teacherSpecialization
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {cls.course === teacherSpecialization
                  ? "Professionally suitable"
                  : "Different expertise"}
              </span>
              <span
                className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  cls.status === "Not Assign"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {cls.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        disabled={selectedClasses.length === 0}
      >
        Submit
      </button>
    </div>
  );
}

export default AssignClasses;
