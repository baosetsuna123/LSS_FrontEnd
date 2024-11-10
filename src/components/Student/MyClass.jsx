import { fetchCoursesService, fetchOrderClasses, fetchSlots } from "@/data/api";
import { useEffect, useState } from "react";
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

  const fetchAllSlots = async () => {
    try {
      const fetchedSlots = await fetchSlots(token);
      setSlots(fetchedSlots);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchAllSlots();
  }, [token, selectedWeekData]);

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
      const classes = await fetchOrderClasses(token);
      const [startRangeStr, endRangeStr] = selectedWeekData.range.split(" To ");
      const startRange = new Date(startRangeStr);
      const endRange = new Date(endRangeStr);
      setDatesInTheWeek(getDatesInRange(startRange, endRange));
      const filteredClasses = classes.data.content.filter((item) => {
        const classStartDate = new Date(item.classDTO.startDate);
        return classStartDate >= startRange && classStartDate <= endRange;
      });
      const courses = await fetchCoursesService(token);
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

      setTimetable(convertClassesToTimetable(updatedClasses));
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedWeekData]);

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];

    if (lesson && lesson.orderStatus === "CANCELLED") {
      return <div className="min-h-[80px]"></div>; // Empty cell for cancelled classes
    }

    if (lesson) {
      const lessonStatus = lesson.orderStatus; // Use status from orderDTO
      return (
        <div className="p-4 bg-white h-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <p
            className="font-bold text-lg text-gray-800 cursor-pointer"
            onClick={() => {
              handleClick(lesson.id);
            }}
          >
            {lesson.subject}
          </p>
          <p className="text-sm text-gray-600">Mã: {lesson.code}</p>
          <p className="text-sm text-gray-600">Lớp: {lesson.class}</p>

          {lessonStatus === "COMPLETED" &&
          !submittedFeedbackOrderIds.has(lesson.orderId.toString()) ? (
            <button
              key={lesson.orderId}
              onClick={() => {
                navigate(`/feedback/${lesson.orderId}`);
              }}
              className="mt-3 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 py-1.5 px-4"
            >
              Feedback
            </button>
          ) : lesson.room &&
            (lessonStatus === "PENDING" ||
              lessonStatus === "ONGOING" ||
              lessonStatus === "ACTIVE") ? (
            // Case 2: Show Meet URL button for status PENDING, ONGOING, or ACTIVE
            <button
              onClick={() => window.open(lesson.room, "_blank")}
              className="mt-3 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-1.5 px-4"
            >
              Meet URL
            </button>
          ) : (
            // Case 3: Show "Ended" if none of the above conditions are met
            <div className="mt-3 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full py-1.5 px-4">
              Ended
            </div>
          )}
        </div>
      );
    }

    return <div className="min-h-[80px]"></div>;
  };

  return (
    <div className="my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My TimeTable</h2>
      <YearWeekSelector onWeekChange={handleWeekChange} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 *:text-center">
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
                  Slot {slot.period}
                  <div className="text-xs text-gray-600">
                    {"(" + slot.start + " - " + slot.end + ")"}
                  </div>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${slot.period}`}
                    className="border-b border-r p-2 text-center max-w-[150px]"
                  >
                    {renderTimetableCell(day, slot.period)}
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
