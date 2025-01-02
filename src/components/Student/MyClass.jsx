import { fetchCoursesService, fetchOrderClasses, fetchSlots } from "@/data/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import YearWeekSelector from "../Teacher/YearSelector";
import { useFeedback } from "@/context/FeedbackContext";

const MyClass = () => {
  const [timetable, setTimetable] = useState({});
  const [datesInTheWeek, setDatesInTheWeek] = useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedWeekData, setSelectedWeekData] = useState({
    week: null,
    range: "",
  });
  const [slots, setSlots] = useState([]);
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
  const handleWeekChange = (week, range) => {
    setSelectedWeekData({ week, range });
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSlots = async () => {
      try {
        const fetchedSlots = await fetchSlots(token);
        setSlots(fetchedSlots);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchAllSlots();
  }, [token, selectedWeekData]);

  const convertClassesToTimetable = (classes) => {
    const daysOfWeekMap = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };

    return classes.reduce((timetable, item) => {
      const { classDTO, orderDTO } = item;
      classDTO.dateSlots.forEach((item) => {
        const date = new Date(item.date);
        const dayOfWeek = daysOfWeekMap[date.getDay()];

        if (!timetable[dayOfWeek]) {
          timetable[dayOfWeek] = {};
        }
        item.slotIds.forEach((slotId) => {
          timetable[dayOfWeek][slotId] = {
            subject: classDTO.name,
            code: classDTO.courseCode,
            class: classDTO.code,
            teacherName: classDTO.teacherName,
            room: classDTO.location,
            dateSlots: classDTO.dateSlots,
            id: classDTO.classId,
            orderId: orderDTO.orderId, // Get orderId from orderDTO
            orderStatus: orderDTO.status,
          };
        });
      });

      return timetable;
    }, {});
  };
  const { submittedFeedbackOrderIds } = useFeedback();
  console.log("submittedFeedbackOrderIds:", submittedFeedbackOrderIds);

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

  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/class/${id}`);
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
      setLoading(true);
      const res = await fetchOrderClasses(token);
      const classes = res.data.content;
      const [startRangeStr, endRangeStr] = selectedWeekData.range.split(" To ");
      const startRange = formatDateToYMD(new Date(startRangeStr));
      const endRange = formatDateToYMD(new Date(endRangeStr));
      setDatesInTheWeek(getDatesInRange(startRange, endRange)); // Set dates in the week

      const filteredClasses = classes.filter((item) => {
        const { dateSlots } = item.classDTO;

        const hasMatchingSlot = dateSlots.some(
          (slot) => slot.date >= startRange && slot.date <= endRange
        );

        return hasMatchingSlot;
      });

      const courses = await fetchCoursesService(token); // Fetch courses

      const updatedClasses = filteredClasses.map((classItem) => {
        const matchedCourse = courses.find(
          (c) => c.courseCode === classItem.classDTO.courseCode
        );
        if (matchedCourse) {
          return { ...classItem, courseName: matchedCourse.name };
        }
        return classItem;
      });
      console.log(updatedClasses);
      setTimetable(convertClassesToTimetable(updatedClasses)); // Set timetable
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false); // Set loading to false after timetable data is fetched
    }
  };

  console.log(timetable);

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    fetchTimetable();
  }, [selectedWeekData]);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson && lesson.orderStatus === "CANCELLED") {
      return <div className="min-h-[80px]"></div>;
    }
    if (lesson && lesson.dateSlots) {
      const dayIndex = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].indexOf(day);
      const currentDayFormatted = datesInTheWeek[dayIndex];

      // Sort the dateSlots
      const sortedSlots = lesson.dateSlots.sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison !== 0) return dateComparison;

        // Sort the slotIds in descending order within each dateSlot
        const maxSlotA = Math.max(...a.slotIds);
        const maxSlotB = Math.max(...b.slotIds);
        return maxSlotB - maxSlotA; // We want the highest slotId to appear first
      });

      // Find the last slot for that day
      const lastSlot = sortedSlots[sortedSlots.length - 1];

      // Get lesson status and the highest slot ID
      const lessonStatus = lesson.orderStatus;
      const highestSlotId = Math.max(...lastSlot.slotIds);
      console.log(period, highestSlotId);
      const isFinalSlot = Number(period) === Number(highestSlotId);
      console.log(isFinalSlot);
      // Check if the lesson is scheduled for the current day
      const matchingSlot = lesson.dateSlots.some(
        (item) => convertDate(item.date) === currentDayFormatted
      );

      if (matchingSlot) {
        return (
          <div className="p-3 bg-white h-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex justify-center">
                  <h3
                    className="font-bold text-xl text-center whitespace-nowrap text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200 mb-2"
                    onClick={() => handleClick(lesson.id)}
                  >
                    {lesson.subject}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-1 whitespace-nowrap">
                  <span className="font-semibold">Course:</span> {lesson.code}
                </p>
                <p className="text-sm text-gray-600 mb-4 whitespace-nowrap">
                  <span className="font-semibold">Tutor:</span>{" "}
                  {lesson.teacherName}
                </p>
              </div>

              <div className="mt-auto">
                {/* Render feedback button only for the final slot of the day */}
                {lessonStatus === "COMPLETED" &&
                !submittedFeedbackOrderIds.has(lesson.orderId.toString()) &&
                convertDate(lastSlot.date) === currentDayFormatted &&
                isFinalSlot ? (
                  <button
                    key={lesson.orderId}
                    onClick={() => navigate(`/feedback/${lesson.orderId}`)}
                    className="w-full text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 py-2 px-4"
                  >
                    Feedback
                  </button>
                ) : lesson.room && lessonStatus === "ONGOING" ? (
                  <button
                    onClick={() => window.open(lesson.room, "_blank")}
                    className="w-full text-sm font-semibold whitespace-nowrap text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-2 px-4"
                  >
                    Join Meeting
                  </button>
                ) : lessonStatus === "COMPLETED" &&
                  submittedFeedbackOrderIds.has(lesson.orderId.toString()) ? (
                  <div className="w-full text-sm font-semibold text-gray-700 bg-gray-200 rounded-full py-2 px-4 text-center">
                    Ended
                  </div>
                ) : (
                  // Show the lesson status only if it's not the final slot
                  <div className="w-full text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full py-2 px-4 text-center">
                    {lessonStatus || "Upcoming"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    return <div className="min-h-[80px]"></div>;
  };

  return (
    <div className="my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        My TimeTable
      </h2>
      <YearWeekSelector onWeekChange={handleWeekChange} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 text-center">
              <th className="py-2 px-4 border-b border-r text-gray-800 dark:text-gray-300">
                Slot
              </th>
              {days.map((day, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b border-r text-center"
                >
                  <p>{day}</p>
                  {!loading && <p>{datesInTheWeek[index]}</p>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
              >
                <td className="py-2 px-4 border-b border-r font-bold text-center text-gray-800 dark:text-gray-300">
                  Period {slot.period}
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {"(" + slot.start + " - " + slot.end + ")"}
                  </div>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${slot.period}`}
                    className="border-b border-r p-2 text-center"
                  >
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 rounded h-6 w-3/4 mx-auto"></div>
                    ) : (
                      renderTimetableCell(day, slot.period)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClass;
