import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchCreateClass,
} from "@/data/api";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";

function TeacherHome() {
  const [timetable, setTimetable] = useState({});
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null); // Separate image state
  const [classData, setClassData] = useState({
    name: "",
    code: "",
    description: "",
    status: "ACTIVE",
    maxStudents: 15,
    price: 100000,
    slotId: "1",
    startDate: "",
    courseCode: "",
    dayofWeek: "",
  });
  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const periods = Array.from({ length: 5 }, (_, i) => i + 1);
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

  const convertClassesToTimetable = (classes) => {
    const daysOfWeekMap = {
      2: "Thứ 2",
      3: "Thứ 3",
      4: "Thứ 4",
      5: "Thứ 5",
      6: "Thứ 6",
      7: "Thứ 7",
      8: "Chủ nhật",
    };
    return classes.reduce((timetable, classItem) => {
      const day = daysOfWeekMap[classItem.dayofWeek];
      if (!timetable[day]) {
        timetable[day] = {};
      }
      timetable[day][classItem.slotId] = {
        subject: classItem.courseName,
        code: classItem.courseCode,
        class: classItem.code,
        room: classItem.location,
      };
      return timetable;
    }, {});
  };

  const fetchTimetable = async () => {
    try {
      const classes = await fetchClassbyteacher(token);
      const courses = await fetchCoursesService(token);
      const updatedClasses = classes.map((classItem) => {
        const matchedCourse = courses.find(
          (c) => c.courseCode === classItem.courseCode
        );
        if (matchedCourse) {
          return { ...classItem, courseName: matchedCourse.name };
        }
        return classItem;
      });
      setTimetable(convertClassesToTimetable(updatedClasses));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const fetchedSlots = await fetchSlots(token);
      const fetchedCourses = await fetchCoursesService(token);
      setSlots(fetchedSlots);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchDropdownData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Log the name and value
    setClassData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the image in a separate state
  };

  const handleCreateClass = async () => {
    if (classData.maxStudents < 15 || classData.maxStudents > 30) {
      return toast.error("Max students must be between 15 and 30");
    }
    if (classData.price < 100000 || classData.price > 500000) {
      return toast.error("Price must be between 100,000 and 500,000");
    }

    try {
      console.log("Creating class with data:", classData, image);
      await fetchCreateClass(classData, image, token); // Use the separate image state
      toast.success("Class created successfully");
      setIsModalOpen(false);
      setImage(null); // Reset image state
      fetchTimetable();
    } catch (error) {
      toast.error(error.message || "Failed to create class");
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const date = new Date(selectedDate);
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);

    if (date < minDate) {
      toast.error("Start date must be at least 2 days from today");
      return;
    }

    // Format date as ISO string with time component
    const formattedDate = `${selectedDate}T00:00:00`; // Add time component

    const jsDayOfWeek = date.getDay();
    const dayOfWeekMapping = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 0: 8 };
    const dayofWeek = dayOfWeekMapping[jsDayOfWeek];

    setClassData((prevData) => ({
      ...prevData,
      startDate: formattedDate, // Use formatted date with time
      dayofWeek,
    }));
  };

  const today = new Date();
  today.setDate(today.getDate() + 2); // Set minimum date to two days from today
  const minDateString = today.toISOString().split("T")[0];

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
      return (
        <div className="p-2 bg-blue-100 h-full border border-blue-200 rounded">
          <p className="font-bold text-sm">{lesson.subject}</p>
          <p className="text-xs">Mã: {lesson.code}</p>
          <p className="text-xs">Lớp: {lesson.class}</p>
          <p className="text-xs">Phòng: {lesson.room}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Thời khóa biểu</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Class
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b border-r">Ca học</th>
              {days.map((day) => (
                <th key={day} className="py-2 px-4 border-b">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period}>
                <td className="py-2 px-4 border-b border-r font-bold text-center">
                  Tiết {period}
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${period}`}
                    className="border-b border-r p-2 max-w-[150px]"
                  >
                    {renderTimetableCell(day, period)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create Class"
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Create Class</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="code"
            placeholder="Class Code"
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <select
            name="slotId"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            {slots.map((slot) => (
              <option key={slot.slotId} value={slot.slotId}>
                {`${slot.period} (${slot.start} - ${slot.end})`}
              </option>
            ))}
          </select>
          <select
            name="courseCode"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.courseCode}>
                {course.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="maxStudents"
            placeholder="Max Students (15-30)"
            min={15}
            max={30}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (100,000 - 500,000)"
            min={100000}
            max={500000}
            onChange={handleInputChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            min={minDateString}
            onChange={handleDateChange}
            required
            className="border p-2 rounded w-full"
          />
          <select
            name="dayOfWeek"
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Day</option>
            {days.map((day, index) => (
              <option key={index} value={index + 2}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleCreateClass}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </Modal>
    </div>
  );
}

export default TeacherHome;
