import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchUpdateClass,
} from "@/data/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaClock, FaSearch } from "react-icons/fa";

function UpdateSchedule() {
  const [classes, setClasses] = useState([]);
  const [classesUpdated, setClassesUpdated] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [classShow, setClassShow] = useState(null);
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

  const daysOfWeek = [
    { value: 2, name: "Monday" },
    { value: 3, name: "Tuesday" },
    { value: 4, name: "Wednesday" },
    { value: 5, name: "Thursday" },
    { value: 6, name: "Friday" },
    { value: 7, name: "Saturday" },
    { value: 8, name: "Sunday" },
  ];

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);

      const filteredClasses = res.filter(
        (classItem) =>
          classItem.status === "PENDING" || classItem.status === "ACTIVE"
      );
      const sortedData = filteredClasses.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setClasses(sortedData);
      console.log(filteredClasses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

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

  const fetchSlotList = async () => {
    try {
      const res = await fetchSlots(token);
      setSlots(res);
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    fetchSlotList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (classes.length > 0 && courses.length > 0 && slots.length > 0) {
      const newClasses = classes.map((classItem) => {
        const course = courses.find(
          (course) => course.courseCode === classItem.courseCode
        );
        const slot = slots.find((slot) => slot.slotId === classItem.slotId);
        return {
          ...classItem,
          courseName: course ? course.name : "Course not specified",
          slotStart: slot ? slot.start : "Time not specified",
          slotEnd: slot ? slot.end : "Time not specified",
        };
      });

      setClassesUpdated(newClasses);
    }
  }, [classes, courses, slots]);
  const [initialMaxStudents, setInitialMaxStudents] = useState(null);

  const handleEdit = (classInfo) => {
    setClassShow(classInfo);
    setEditingClass({ ...classInfo });
    console.log(classInfo);
    setInitialMaxStudents(classInfo.maxStudents);
    setMaxStudentsError("");
    setIsPopupOpen(true);
  };
  const [maxStudentsError, setMaxStudentsError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the state for all fields
    setEditingClass((prev) => ({ ...prev, [name]: value }));
    if (name === "price") {
      const newPrice = Number(value);
      setEditingClass((prev) => ({ ...prev, price: newPrice }));
    }
    if (name === "maxStudents") {
      const newMaxStudents = Number(value);

      if (newMaxStudents && newMaxStudents < initialMaxStudents) {
        setMaxStudentsError(
          "Max Students cannot be less than the current number of students"
        );
      } else {
        setMaxStudentsError(""); // Clear error when the value is valid
      }
    }
  };

  const handleSave = async (updatedClass) => {
    console.log(updatedClass);
    // Validate price range inside handleSave
    if (updatedClass.price < 100000 || updatedClass.price > 500000) {
      toast.error("Price must be between 100,000 and 500,000");
      return; // Exit early if price is invalid
    }

    // If there's a maxStudents error, show the toast and return
    if (maxStudentsError) {
      toast.error(maxStudentsError);
      return;
    }

    try {
      // Check if maxStudents is less than the current number of students
      if (updatedClass.maxStudents < classShow.maxStudents) {
        toast.error(
          `Max students cannot be less than the current number of students (${classShow.maxStudents})`
        );
        return; // Exit early if maxStudents is invalid
      }

      // Proceed with saving the updated class
      await fetchUpdateClass({ data: { ...updatedClass }, token });

      // Fetch the updated data after saving
      fetchCourses();
      fetchClasses();

      // Close the popup and reset editing class state
      setIsPopupOpen(false);
      setEditingClass(null);

      // Show success toast
      toast.success("Update Class Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the class. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setEditingClass(null);
  };
  const filteredClasses = classesUpdated.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Update Lesson Information
      </h2>
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a lesson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul className="space-y-6">
        {filteredClasses.map((cls) => (
          <li
            key={cls.id}
            className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
                  {cls.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Subject: {cls.courseName}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Max students: {cls.maxStudents}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Students Joined: {cls.students.length}{" "}
                  {cls.students.length > 0 && (
                    <span>
                      (
                      {cls.students.map((student, index) => (
                        <span key={student.userName}>
                          {student.userName}
                          {index < cls.students.length - 1 && ", "}
                        </span>
                      ))}
                      )
                    </span>
                  )}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  Start date:{" "}
                  {new Date(cls.startDate).toLocaleDateString("en-GB")}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-200">
                  <span className="font-medium">
                    {daysOfWeek.find(
                      (day) => day.value === Number(cls.dayOfWeek)
                    )?.name || "Unknown"}
                    :
                  </span>{" "}
                  {cls.slotStart} - {cls.slotEnd}
                </p>
              </div>
              <button
                onClick={() => handleEdit(cls)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isPopupOpen && editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit Lesson Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Lesson Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={editingClass.name}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <select
                    name="course"
                    value={editingClass.courseCode || ""}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="maxStudents"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Number of Students
                  </label>
                  <input
                    type="number"
                    id="maxStudents"
                    name="maxStudents"
                    value={editingClass.maxStudents}
                    onChange={handleInputChange}
                    placeholder={`Current number of students is ${editingClass.maxStudents}`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  {maxStudentsError && (
                    <p className="text-red-500 mt-1 text-sm">
                      {maxStudentsError}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="teacher"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Teacher
                  </label>
                  <input
                    id="teacher"
                    name="teacher"
                    value={editingClass.teacherName}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Lesson Room Link
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={editingClass.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dayofWeek"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Day of the Week
                  </label>
                  <select
                    name="dayofWeek"
                    value={editingClass.dayOfWeek}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value.toString()}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="slotId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Class Time
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="slotId"
                      value={editingClass.slotId}
                      onChange={handleInputChange}
                      disabled
                      className="mt-1 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      {slots.map((slot) => (
                        <option
                          key={slot.slotId}
                          value={slot.slotId.toString()}
                        >
                          Slot {slot.slotId} ({slot.start} - {slot.end})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={editingClass.price}
                    onChange={handleInputChange}
                    min="100000"
                    max="500000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-500 mt-1 block">
                    {formatCurrency(editingClass.price)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => handleSave(editingClass)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setIsPopupOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateSchedule;
