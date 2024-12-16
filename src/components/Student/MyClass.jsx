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
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchAllSlots = async () => {
      setLoading(true);
      try {
        const fetchedSlots = await fetchSlots(token);
        setSlots(fetchedSlots);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setDataFetched(true);
      }
    };
    fetchAllSlots();
  }, [token, selectedWeekData]);
  useEffect(() => {
    if (slots.length > 0 && datesInTheWeek.length > 0) {
      setLoading(false);
    }
  }, [slots, datesInTheWeek, dataFetched]);
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

    return classes.reduce((timetable, contentItem, index) => {
      if (!contentItem || !contentItem.classDTO || !contentItem.orderDTO) {
        console.log(
          `Missing or undefined classDTO/orderDTO at index ${index}`,
          contentItem
        );
        return timetable; // Skip this entry if classDTO or orderDTO is missing
      }
      const classItem = contentItem.classDTO;
      const orderItem = contentItem.orderDTO;

      if (classItem && classItem.dayOfWeek && classItem.slotId) {
        const day = daysOfWeekMap[classItem.dayOfWeek];
        if (!timetable[day]) {
          timetable[day] = {};
        }

        timetable[day][classItem.slotId] = {
          subject: classItem.name,
          code: classItem.courseCode,
          class: classItem.code,
          teacherName: classItem.teacherName,
          room: classItem.location,
          id: classItem.classId,
          orderId: orderItem.orderId, // Get orderId from orderDTO
          orderStatus: orderItem.status, // Get status from orderDTO
        };
      }

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

  const fetchTimetable = async () => {
    try {
      setLoading(true); // Set loading to true before fetching timetable data
      const classes = await fetchOrderClasses(token);
      const [startRangeStr, endRangeStr] =
        selectedWeekData.range.split(" To ");
      const startRange = new Date(startRangeStr);
      const endRange = new Date(endRangeStr);
      setDatesInTheWeek(getDatesInRange(startRange, endRange)); // Set dates in the week

      const filteredClasses = classes.data.content.filter((item) => {
        const classStartDate = new Date(item.classDTO.startDate);
        return classStartDate >= startRange && classStartDate <= endRange;
      });

      const courses = await fetchCoursesService(token); // Fetch courses

      const updatedClasses = filteredClasses.map((contentItem) => {
        const classItem = contentItem.classDTO;
        const matchedCourse = courses.find(
          (course) => course.courseCode === classItem.courseCode
        );

        return {
          ...contentItem,
          classDTO: {
            ...classItem,
            courseName: matchedCourse ? matchedCourse.name : null,
          },
        };
      });

      setTimetable(convertClassesToTimetable(updatedClasses)); // Set timetable
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false); // Set loading to false after timetable data is fetched
    }
  };
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    fetchTimetable();
  }, [selectedWeekData]);

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson && lesson.orderStatus === "CANCELLED") {
      return <div className="min-h-[80px]"></div>; // Empty cell for cancelled classes
    }
    if (lesson) {
      const lessonStatus = lesson.orderStatus; // Use status from orderDTO
      return (
        <div className="p-6 bg-white h-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
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
                <span className="font-semibold">Course Code:</span>{" "}
                {lesson.code}
              </p>
              <p className="text-sm text-gray-600 mb-4 whitespace-nowrap">
                <span className="font-semibold">Tutor:</span>{" "}
                {lesson.teacherName}
              </p>
            </div>

            <div className="mt-auto">
              {lessonStatus === "COMPLETED" &&
                !submittedFeedbackOrderIds.has(lesson.orderId.toString()) ? (
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
                <div className="w-full text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full py-2 px-4 text-center">
                  {lessonStatus || "Upcoming"}
                </div>
              )}
            </div>
          </div>
        </div>
      );
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
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default MyClass;
