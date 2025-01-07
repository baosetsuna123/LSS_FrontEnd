import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchSystemParam,
  getClassesWithoutTeacher,
} from "@/data/api";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ShowDetailTimeTable from "./ShowDetailTimeTable";
import YearSelector from "./YearSelector";

import ModalRegisterClass from "./ModalRegisterClass";

function TeacherHome() {
  const [timetable, setTimetable] = useState({});
  const [slots, setSlots] = useState([]);

  const [classesWithout, setClassesWithout] = useState([]);

  const [showDetail, setShowDetail] = useState(false);
  const [infoClass, setInfoClass] = useState(null);
  const [classes, setClasses] = useState([]);

  const token = sessionStorage.getItem("token");
  const [selectedWeekData, setSelectedWeekData] = useState({
    week: null,
    range: "",
  });
  const [showModalRegister, setShowModalRegister] = useState(false);

  const [datesInTheWeek, setDatesInTheWeek] = useState([]);
  useEffect(() => {
    const fetchParam = async () => {
      try {
        const data = await fetchSystemParam(token);

        const param = data.find((p) => p.name === "check_time_before_start");
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
        } else {
          console.warn(
            "Parameter 'check_time_before_start' not found. Defaulting to 2 days from today."
          );
          const today = new Date();
          today.setDate(today.getDate() + 2); // Default to 2 days buffer
        }
      } catch (error) {
        console.error("Error fetching parameters:", error);
        toast.error(
          "Failed to fetch system parameters. Defaulting to 2 days from today."
        );
        const today = new Date();
        today.setDate(today.getDate() + 2); // Default to 2 days buffer
      }
    };

    fetchParam();
  }, [token]);

  const fetchClassesWithTeacher = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await getClassesWithoutTeacher(token);
      setClassesWithout(res);
    } catch {
      toast.error("Failed server");
    }
  };

  useEffect(() => {
    fetchClassesWithTeacher();
  }, []);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

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

    return classes.reduce((timetable, classItem) => {
      classItem.dateSlots.forEach((item) => {
        const date = new Date(item.date);
        const dayOfWeek = daysOfWeekMap[date.getDay()];

        if (!timetable[dayOfWeek]) {
          timetable[dayOfWeek] = {};
        }
        item.slotIds.forEach((slotId) => {
          timetable[dayOfWeek][slotId] = {
            subject: classItem.courseName,
            code: classItem.courseCode,
            classId: classItem.classId,
            class: classItem.name,
            room: classItem.location,
            dateSlots: classItem.dateSlots,
          };
        });
      });

      return timetable;
    }, {});
  };
  const handleWeekChange = (week, range) => {
    setSelectedWeekData((prev) => {
      if (prev.week === week && prev.range === range) {
        return prev;
      }
      return { week, range };
    });
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
    setLoading(true);
    try {
      const classes = await fetchClassbyteacher(token);
      const [startRangeStr, endRangeStr] = selectedWeekData.range.split(" To ");
      const startRange = formatDateToYMD(new Date(startRangeStr));
      const endRange = formatDateToYMD(new Date(endRangeStr));
      setDatesInTheWeek(getDatesInRange(startRange, endRange));

      const filteredClasses = classes.filter((item) => {
        const { dateSlots } = item;

        const hasMatchingSlot = dateSlots.some(
          (slot) =>
            ["ACTIVE", "ONGOING", "PENDING", "COMPLETED"].includes(
              item.status
            ) &&
            slot.date >= startRange &&
            slot.date <= endRange
        );

        return hasMatchingSlot;
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
      console.log(updatedClasses);
      setTimetable(convertClassesToTimetable(updatedClasses));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      setDataFetched(true);
      const fetchedSlots = await fetchSlots(token);
      setSlots(fetchedSlots);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setDataFetched(false); // Stop loading when finished
    }
  };

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    fetchTimetable();
    fetchDropdownData();
  }, [selectedWeekData]);

  const handleShowDetail = (lesson) => {
    // Ensure `classes` exists and is an array
    if (!classes || !Array.isArray(classes)) {
      console.error("Classes array is not available or not an array.");
      return;
    }
    const data = classes.find((c) => c.classId === lesson.classId);
    if (data) {
      setInfoClass(data);
      setShowDetail(true);
    } else {
      console.warn("No matching class found for lesson:", lesson);
      setShowDetail(false);
    }
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };
  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];

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

      const matchingSlot = lesson.dateSlots.some(
        (item) => convertDate(item.date) === currentDayFormatted
      );

      if (matchingSlot) {
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
    }

    return null;
  };

  const handleCloseRegister = () => {
    fetchClassesWithTeacher();
    setShowModalRegister(false);
  };
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Timetable</h2>
        <button
          onClick={() => setShowModalRegister(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Register for Class
        </button>
      </div>
      <YearSelector onWeekChange={handleWeekChange} />
      <div className="w-full">
        <>
          <table className="table-auto w-full text-sm bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b border-r">Slot</th>
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
            <tbody className="relative">
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
                      {loading || dataFetched ? (
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
        </>
      </div>
      <ModalRegisterClass
        data={classesWithout}
        open={showModalRegister}
        handleClose={handleCloseRegister}
        fetchTimetable={fetchTimetable}
      />
      <ShowDetailTimeTable
        isOpen={showDetail}
        setIsOpen={setShowDetail}
        data={infoClass}
      />
    </div>
  );
}

export default TeacherHome;
