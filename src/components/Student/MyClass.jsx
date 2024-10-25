import { fetchCoursesService, fetchOrderClasses } from "@/data/api";
import { useEffect, useState } from "react";

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
  const periods = Array.from({ length: 5 }, (_, i) => i + 1);
  const result = localStorage.getItem("result")

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
      8: "Chủ nhật"
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
        room: classItem.location
      };

      return timetable;
    }, {});
  };

  const fetchTimetable = async () => {
    try {
      const classes = await fetchOrderClasses(token);
      const courses = await fetchCoursesService(token);
      const updatedClasses = classes.data.content.map((classItem) => {
        const matchedCourse = courses.find((c) => c.courseCode === classItem.courseCode);
        if (matchedCourse) {
          return { ...classItem, courseName: matchedCourse.name};
        }
        return classItem;
      });
      setTimetable(convertClassesToTimetable(updatedClasses))
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    fetchTimetable();
  }, [token]);

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
      return (
        <div className="p-2 bg-blue-100 h-full border border-blue-200 rounded ">
          <p className="font-bold text-sm">{lesson.subject}</p>
          <p className="text-xs">Mã: {lesson.code}</p>
          <p className="text-xs">Lớp: {lesson.class}</p>
          <p className="text-xs">Phòng: {lesson.room}</p>
          {/* <p className="text-xs font-semibold">
              Tiết: {(period - 1) * 3 + 1}-{(period - 1) * 3 + 3}
            </p> */}
        </div>
      );
    }
    return <div className="min-h-[80px]"></div>;
  };
  return (
    <div className="my-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Thời khóa biểu của tôi</h2>
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
                  <br />
                  {/* <span className="text-xs font-normal">
                      (Tiết {(period - 1) * 3 + 1}-{(period - 1) * 3 + 3})
                    </span> */}
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
    </div>
  );
}

export default MyClass;