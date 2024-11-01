import { fetchCoursesService, fetchOrderClasses } from "@/data/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YearWeekSelector from "../Teacher/YearSelector";

const MyClass = () => {
  const [timetable, setTimetable] = useState({});
  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const [selectedWeekData, setSelectedWeekData] = useState({
    week: null,
    range: ""
  });
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
  const handleWeekChange = (week, range) => {
    setSelectedWeekData({ week, range });
  };

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

    return classes.reduce((timetable, contentItem, index) => {
      if (!contentItem || !contentItem.classDTO) {
        console.log(
          `Missing or undefined classDTO at index ${index}`,
          contentItem
        );
        return timetable; // Skip this entry if classDTO is missing
      }
      const classItem = contentItem.classDTO;
      // Check if classItem and dayOfWeek exist
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
          status: classItem.status,
          orderId: contentItem.orderId, // Get orderId from parent object
        };
      }

      return timetable;
    }, {});
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
      const filteredClasses = classes.data.content.filter(item => {
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
  }, [token,selectedWeekData]);

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
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

          {
            lesson.status === "COMPLETED" ? (
              // Case 1: If the lesson is COMPLETED, show the Feedback button
              <button
                onClick={() => {
                  navigate(`/feedback/${lesson.orderId}`);
                }}
                className="mt-3 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 py-1.5 px-4"
              >
                Feedback
              </button>
            ) : lesson.room ? (
              // Case 2: If the lesson is NOT completed but has a Meet URL, show the Meet URL button
              <button
                onClick={() => window.open(lesson.room, "_blank")}
                className="mt-3 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-1.5 px-4"
              >
                Meet URL
              </button>
            ) : null // Case 3: Show nothing if none of the above conditions are met
          }
        </div>
      );
    }
    return <div className="min-h-[80px]"></div>;
  };

  return (
    <div className="my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Thời khóa biểu của tôi
      </h2>
      <YearWeekSelector onWeekChange={handleWeekChange} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 *:text-center">
              <th className="py-3 px-4 border-b border-r text-left text-gray-700 font-semibold">
                Ca học
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="py-3 px-4 border-b text-left text-gray-700 font-semibold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr
                key={period}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b border-r font-bold text-center text-gray-800">
                  Tiết {period}
                  <br />
                  <span className="text-xs font-medium text-gray-600">
                    {period === 1 && "(7h00 - 9h15)"}
                    {period === 2 && "(9h30 - 11h45)"}
                    {period === 3 && "(12h30 - 14h45)"}
                    {period === 4 && "(15h00 - 17h15)"}
                    {period === 5 && "(17h45 - 20h00)"}
                  </span>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${period}`}
                    className="border-b border-r p-2 max-w-[150px] text-gray-700"
                  >
                    {renderTimetableCell(day, period)}
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
