import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchCreateClass,
  fetchCourseByMajor,
  fetchSystemParam,
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
  const [minDateString, setMinDateString] = useState("");
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
  const token = sessionStorage.getItem("token");
  const [selectedWeekData, setSelectedWeekData] = useState({
    week: null,
    range: "",
  });
  const [datesInTheWeek, setDatesInTheWeek] = useState([]);
  useEffect(() => {
    const fetchParam = async () => {
      try {
        const data = await fetchSystemParam(token);

        const param = data.find((p) => p.name === "check_time_before_start");
        console.log(param.value);
        if (param) {
          let baseDays = parseInt(param.value, 10); // Parse the value as an integer
          if (isNaN(baseDays)) {
            console.warn(
              "The parameter 'check_time_before_start' value is not a valid number. Defaulting to 0."
            );
            baseDays = 0;
          }
          const today = new Date();
          today.setDate(today.getDate() + baseDays + 2); // Add base days and 2 days buffer
          const formattedMinDate = today.toISOString().split("T")[0];
          setMinDateString(formattedMinDate); // Set the minimum date
        } else {
          console.warn(
            "Parameter 'check_time_before_start' not found. Defaulting to 2 days from today."
          );
          const today = new Date();
          today.setDate(today.getDate() + 2); // Default to 2 days buffer
          const formattedMinDate = today.toISOString().split("T")[0];
          setMinDateString(formattedMinDate); // Set the default minimum date
        }
      } catch (error) {
        console.error("Error fetching parameters:", error);
        toast.error(
          "Failed to fetch system parameters. Defaulting to 2 days from today."
        );
        const today = new Date();
        today.setDate(today.getDate() + 2); // Default to 2 days buffer
        const formattedMinDate = today.toISOString().split("T")[0];
        setMinDateString(formattedMinDate); // Set the default minimum date
      }
    };

    fetchParam();
  }, [token]);

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
    price: "",
    slotId: "1",
    startDate: "",
    courseCode: "",
    dayOfWeek: "",
  });
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const handleInput = (e) => {
    let value = e.target.value.replace(/,/g, ""); // Remove commas for clean input

    if (!isNaN(value) || value === "") {
      setClassData((prevData) => ({ ...prevData, price: value })); // Update state with the raw number
    }
  };

  // Format the input value with commas
  const formatWithCommas = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Convert num to string and add commas
  };
  const convertClassesToTimetable = (classes) => {
    const daysOfWeekMap = {
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
      8: "Sunday",
    };
    return classes.reduce((timetable, classItem) => {
      const day = daysOfWeekMap[classItem.dayOfWeek];
      if (!timetable[day]) {
        timetable[day] = {};
      }
      timetable[day][classItem.slotId] = {
        subject: classItem.courseName,
        code: classItem.courseCode,
        class: classItem.name,
        room: classItem.location,
      };
      return timetable;
    }, {});
  };

  const handleWeekChange = (week, range) => {
    setSelectedWeekData({ week, range });
  };
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    let endCurrentDate = new Date(endDate);
    while (currentDate <= endCurrentDate) {
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      dates.push(`${day}/${month}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
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
      const startRange = formatDateToYMD(new Date(startRangeStr));
      const endRange = formatDateToYMD(new Date(endRangeStr));
      setDatesInTheWeek(getDatesInRange(startRange, endRange));
      const filteredClasses = classes.filter((item) => {
        const classStartDate = formatDateToYMD(new Date(item.startDate));
        return (
          classStartDate >= startRange &&
          classStartDate <= endRange &&
          ["ACTIVE", "ONGOING", "PENDING"].includes(item.status)
        );
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
    const file = e.target.files[0];
    console.log(file); // Log the file object to ensure it's correctly selected
    if (file) {
      setImage(file); // Store the file object instead of just the name
    } else {
      setImage(null); // Reset when no file is selected
    }
  };

  const handleCreateClass = async () => {
    const requiredFields = [
      "name",
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
      if (error.message && error.message.includes("duplicate")) {
        toast.error("Code is already in use");
      } else {
        toast.error(error.message || "Failed to create lesson");
      }
      console.log(error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDateChange = async (e) => {
    try {
      const selectedDate = e.target.value;
      const date = new Date(selectedDate);
      console.log(date);
      setDate(date);
      const classList = classesCreate.filter(
        (c) => c.startDate === formatDate(date) && c.status !== "CANCELED"
      );
      setSelectedSlots(classList.map((item) => item.slotId));

      const jsDayOfWeek = date.getDay();
      const dayOfWeekMapping = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 0: 8 };
      const dayOfWeek = dayOfWeekMapping[jsDayOfWeek];
      setDayOfWeek(dayOfWeek - 2);

      setClassData((prevData) => ({
        ...prevData,
        startDate: formatDateToYMD(date),
        dayOfWeek,
      }));
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  const handleShowDetail = (lesson) => {
    // Ensure `classes` exists and is an array
    if (!classes || !Array.isArray(classes)) {
      console.error("Classes array is not available or not an array.");
      return;
    }
    const data = classes.find((c) => c.name === lesson.class);
    if (data) {
      setInfoClass(data);
      setShowDetail(true);
    } else {
      console.warn("No matching class found for lesson:", lesson);
      setShowDetail(false);
    }
  };

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
      return (
        <div
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer inline-block"
          onClick={() => handleShowDetail(lesson)}
        >
          <p className="font-bold text-base text-blue-800 whitespace-nowrap">
            {lesson.class}
          </p>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            Course: {lesson.code}
          </p>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            CourseName: {lesson.subject}
          </p>
          {lesson.room && (
            <button
              onClick={() => window.open(lesson.room, "_blank")}
              className="mt-3 whitespace-nowrap inline-flex items-center text-xs font-semibold text-white bg-gray-600 rounded-full hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 py-1 px-3"
            >
              Meet URL
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Timetable</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Create a Lesson
        </button>
      </div>
      <YearSelector onWeekChange={handleWeekChange} />
      <div className="w-full">
        <table className="table-auto w-full text-sm bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b border-r">Slot</th>
              {datesInTheWeek.map((date, index) => {
                const dayOfWeek = days[index % 7];
                return (
                  <th key={index} className="py-2 px-4 border-b text-center">
                    <p>{dayOfWeek}</p>
                    <p>{date}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-150"
              >
                <td className="py-2 px-4 border-b border-r font-bold text-center text-gray-800">
                  Period {slot.period}
                  <div className="text-xs text-gray-600">
                    {"(" + slot.start + " - " + slot.end + ")"}
                  </div>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${slot.period}`}
                    className="border-b border-r p-2 text-center"
                  >
                    {renderTimetableCell(day, slot.period)}
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
          Create Lesson
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
            type="text"
            name="price"
            placeholder="Price (100,000 - 500,000)"
            min={100000}
            max={500000}
            value={formatWithCommas(classData.price)}
            onChange={handleInput}
            required
            className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          <input
            type="text"
            name="location"
            placeholder="Meeting Url"
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
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4 whitespace-nowrap">
              Upload File
            </label>
            <div className="w-3/4 flex items-center">
              {/* Custom button to trigger file input */}
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                className="p-2 border ml-4 border-gray-300 rounded-lg whitespace-nowrap bg-gray-200 hover:bg-gray-300"
              >
                Choose File
              </button>

              <input
                id="fileInput"
                onChange={handleFileChange}
                accept="image/*"
                type="file"
                className="hidden whitespace-nowrap"
              />

              {/* Display selected file name or default message */}
              <span className="ml-2 text-gray-900 whitespace-nowrap">
                {image ? `Selected File: ${image.name}` : "No file selected"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 justify-center">
          <button
            onClick={handleCreateClass}
            disabled={isLoading}
            className="mt-4 bg-blue-600 text-white px-5 py-1 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                <span>Creating...</span>
              </div>
            ) : (
              "Create"
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
