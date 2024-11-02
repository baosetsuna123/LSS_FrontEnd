import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchCreateClass,
  fetchCourseByMajor,
} from "@/data/api";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import ShowDetailTimeTable from "./ShowDetailTimeTable";
import { FaSpinner } from "react-icons/fa";
import YearSelector from "./YearSelector";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function TeacherHome() {
  const [timetable, setTimetable] = useState({});
  const [slots, setSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();
  today.setDate(today.getDate() + 4);
  const minDateString = today.toISOString().split("T")[0];
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [infoClass, setInfoClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [date, setDate] = useState(null);
  const [classesCreate, setClassCreate] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [selectedWeekData, setSelectedWeekData] = useState({
    week: null,
    range: "",
  });
  useEffect(() => {
    const fetchCousesMajor = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const data = await fetchCourseByMajor(token);
        const codes = data.map((course) => course.courseCode);
        setCourseCodes(codes);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCousesMajor();
  }, []);
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
    dayOfWeek: "",
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
  const periods = [
    { id: 1, time: "7h00 - 9h15" },
    { id: 2, time: "9h30 - 11h45" },
    { id: 3, time: "12h30 - 14h45" },
    { id: 4, time: "15h00 - 17h15" },
    { id: 5, time: "17h45 - 20h00" },
  ];
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
      const day = daysOfWeekMap[classItem.dayOfWeek];
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

  const handleWeekChange = (week, range) => {
    setSelectedWeekData({ week, range });
  };
  const formatDateToYMD = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const fetchTimetable = async () => {
    try {
      const classes = await fetchClassbyteacher(token);
      setClassCreate(classes);
      const [startRangeStr, endRangeStr] = selectedWeekData.range.split(" To ");
      console.log(startRangeStr);
      const startRange = formatDateToYMD(new Date(startRangeStr));
      const endRange = formatDateToYMD(new Date(endRangeStr));
      const filteredClasses = classes.filter((item) => {
        const classStartDate = formatDateToYMD(new Date(item.startDate));
        return classStartDate >= startRange && classStartDate <= endRange;
      });
      setClasses(filteredClasses);
      const courses = await fetchCoursesService(token);
      const updatedClasses = filteredClasses.map((classItem) => {
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
      setSlots(fetchedSlots);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchDropdownData();
  }, [token, selectedWeekData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setClassData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreateClass = async () => {
    const requiredFields = [
      "name",
      "code",
      "startDate",
      "dayOfWeek",
      "slotId",
      "courseCode",
      "maxStudents",
      "price",
      "description",
    ];

    for (const field of requiredFields) {
      if (!classData[field]) {
        toast.error(
          `Please fill out the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`
        );
        return;
      }
    }

    if (classData.maxStudents < 15 || classData.maxStudents > 30) {
      return toast.error("Max students must be between 15 and 30");
    }
    if (classData.price < 100000 || classData.price > 500000) {
      return toast.error("Price must be between 100,000 and 500,000");
    }
    try {
      setIsLoading(true);
      await fetchCreateClass(classData, image, token);
      toast.success("Class created successfully");
      setIsModalOpen(false);
      setImage(null);
      fetchTimetable();
    } catch (error) {
      toast.error(error.message || "Failed to create class");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDateChange = async (e) => {
    try {
      const selectedDate = e.target.value;
      const date = new Date(selectedDate);
      setDate(date);
      const classList = classesCreate.filter(
        (c) => c.startDate === formatDate(date)
      );
      setSelectedSlots(classList.map((item) => item.slotId));
      // Ensure selected date is at least two days from today
      const minDate = new Date(minDateString);

      if (date < minDate) {
        toast.error("Start date must be at least 3 days from today");
        return;
      }
      const jsDayOfWeek = date.getDay();
      const dayOfWeekMapping = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 0: 8 };
      const dayOfWeek = dayOfWeekMapping[jsDayOfWeek];
      setDayOfWeek(dayOfWeek - 2);

      setClassData((prevData) => ({
        ...prevData,
        startDate: formatDateToYMD(date),
        dayOfWeek,
      }));
    } catch {
      /* empty */
    }
  };

  const handleShowDetail = (lesson) => {
    const data = classes.find((c) => c.code === lesson.class);
    setShowDetail(true);
    setInfoClass(data);
  };

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
      return (
        <div
          className="p-4 bg-blue-50 h-full border border-blue-200 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleShowDetail(lesson)}
        >
          <p className="font-bold text-base text-blue-800">{lesson.subject}</p>
          <p className="text-sm text-gray-600">Mã: {lesson.code}</p>
          <p className="text-sm text-gray-600">Lớp: {lesson.class}</p>
          {lesson.room && (
            <button
              onClick={() => window.open(lesson.room, "_blank")}
              className="mt-3 inline-flex items-center text-xs font-semibold text-white bg-gray-600 rounded-full hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 py-1 px-3"
            >
              Meet URL
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  // const getPreviousDay = (dateString, daysBefore = 1) => {
  //   const dateObj = new Date(dateString);
  //   dateObj.setDate(dateObj.getDate() - daysBefore);
  //   return dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Thời khóa biểu</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Create Class
        </button>
      </div>
      <YearSelector onWeekChange={handleWeekChange} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b border-r">Ca học</th>
              {days.map((day) => (
                <th key={day} className="py-2 px-4 border-b text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr
                key={period.id}
                className="hover:bg-gray-100 transition duration-150"
              >
                <td className="py-2 px-4 border-b border-r font-bold text-center text-gray-800">
                  Tiết {period.id}
                  <div className="text-xs text-gray-600">
                    {"(" + period.time + ")"}
                  </div>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${period.id}`}
                    className="border-b border-r p-2 text-center max-w-[150px]"
                  >
                    {renderTimetableCell(day, period.id)}
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
        className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl text-center font-bold mb-4 text-gray-800">
          Create Class
        </h2>
        <div className="grid grid-cols-2 gap-4 py-2">
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            onChange={handleInputChange}
            required
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            type="text"
            name="code"
            placeholder="Class Code"
            onChange={handleInputChange}
            required
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            type="date"
            min={minDateString}
            onChange={handleDateChange}
            required
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            type="text"
            name="dayOfWeek"
            disabled
            value={
              [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ][dayOfWeek]
            }
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          <select
            name="slotId"
            onChange={handleInputChange}
            disabled={date ? false : true}
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select Slot</option>
            {slots.map((slot) => (
              <option
                key={slot.slotId}
                value={slot.slotId}
                disabled={selectedSlots.some((item) => item === slot.slotId)}
              >
                {`${slot.period} (${slot.start} - ${slot.end})`}
              </option>
            ))}
          </select>
          <select
            name="courseCode"
            onChange={handleInputChange}
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Select Course</option>
            {courseCodes.map((courseCode) => (
              <option key={courseCode} value={courseCode}>
                {courseCode}{" "}
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
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (100,000 - 500,000)"
            min={100000}
            max={500000}
            onChange={handleInputChange}
            required
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          <input
            type="text"
            name="location"
            placeholder="meeting url..."
            onChange={handleInputChange}
            required
            className="border col-span-2 p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleInputChange}
            className="border p-2 rounded-lg col-span-2 h-24 w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            onChange={handleFileChange}
            accept="image/*"
            type="file"
            className="block w-full text-sm text-slate-500
          file:mr-4 file:py-1 file:px-2
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          transition duration-200
        "
          />
        </div>
        <div className="flex items-center gap-6 justify-center">
          <button
            onClick={handleCreateClass}
            disabled={isLoading}
            className="mt-4 bg-blue-600 text-white px-5 py-1 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Class"
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-white text-gray-800 border border-gray-300 px-5 py-1 rounded-lg hover:bg-gray-100 transition duration-200 shadow-md"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ShowDetailTimeTable
        isOpen={showDetail}
        setIsOpen={setShowDetail}
        data={infoClass}
      />
    </div>
  );
}

export default TeacherHome;
