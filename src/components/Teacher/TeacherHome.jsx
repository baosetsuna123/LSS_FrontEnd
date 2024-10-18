import { useState, useEffect } from "react";

function TeacherHome() {
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

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchTimetable = async () => {
      // Thay thế bằng API thực tế
      const mockTimetable = {
        "Thứ 2": {
          1: {
            subject: "Thiết kế đồ họa cơ bản",
            code: "GD101",
            class: "K21-DH",
            room: "Lab 101",
          },
          3: {
            subject: "Illustrator nâng cao",
            code: "GD201",
            class: "K20-DH",
            room: "Lab 202",
          },
        },
        "Thứ 3": {
          2: {
            subject: "Photoshop cơ bản",
            code: "GD102",
            class: "K21-DH",
            room: "Lab 101",
          },
          4: {
            subject: "Thiết kế UI/UX",
            code: "GD301",
            class: "K19-DH",
            room: "Lab 303",
          },
        },
        "Thứ 4": {
          1: {
            subject: "3D Modeling",
            code: "GD401",
            class: "K18-DH",
            room: "Lab 404",
          },
          5: {
            subject: "Đồ án tốt nghiệp",
            code: "GD501",
            class: "K18-DH",
            room: "Lab 505",
          },
        },
        "Thứ 5": {
          2: {
            subject: "After Effects cơ bản",
            code: "GD103",
            class: "K20-DH",
            room: "Lab 202",
          },
          4: {
            subject: "Thiết kế logo",
            code: "GD202",
            class: "K19-DH",
            room: "Lab 303",
          },
        },
        "Thứ 6": {
          3: {
            subject: "Nhiếp ảnh kỹ thuật số",
            code: "GD203",
            class: "K20-DH",
            room: "Lab 101",
          },
          5: {
            subject: "Đồ họa chuyển động",
            code: "GD302",
            class: "K19-DH",
            room: "Lab 404",
          },
        },
      };
      setTimetable(mockTimetable);
    };

    fetchTimetable();
  }, [token]);

  const renderTimetableCell = (day, period) => {
    const lesson = timetable[day] && timetable[day][period];
    if (lesson) {
      return (
        <div className="p-2 bg-blue-100 h-full border border-blue-200 rounded">
          <p className="font-bold text-sm">{lesson.subject}</p>
          <p className="text-xs">Mã: {lesson.code}</p>
          <p className="text-xs">Lớp: {lesson.class}</p>
          <p className="text-xs">Phòng: {lesson.room}</p>
          <p className="text-xs font-semibold">
            Tiết: {(period - 1) * 3 + 1}-{(period - 1) * 3 + 3}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thời khóa biểu</h2>
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
                  Ca {period}
                  <br />
                  <span className="text-xs font-normal">
                    (Tiết {(period - 1) * 3 + 1}-{(period - 1) * 3 + 3})
                  </span>
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${period}`}
                    className="border-b border-r p-2"
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

export default TeacherHome;
