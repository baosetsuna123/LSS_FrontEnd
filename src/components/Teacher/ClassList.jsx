import { fetchClassbyteacher, fetchCoursesService } from "@/data/api";
import { useState, useEffect } from "react";

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState(null);
  const result = localStorage.getItem("result")
  const [classesUpdated, setClassesUpdated] = useState([]);
  const [courses, setCourses] = useState([])
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      setClasses(res);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  useEffect(() => {
    if (classes.length > 0 && courses.length > 0) {
      const newClasses = classes.map((classItem) => {
        const course = courses.find(course => course.courseCode === classItem.courseCode);
        return {
          ...classItem,
          courseName: course ? course.name : "Khóa học không xác định"
        };
      });
      setClassesUpdated(newClasses);
    }
  }, [classes, courses])



  const fetchCourses = async () => {
    try {
      const res = await fetchCoursesService(token);
      setCourses(res);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // useEffect(() => {
  //   // Giả lập việc lấy dữ liệu từ API
  //   const fetchClasses = async () => {
  //     // Thay thế bằng cuộc gọi API thực tế
  //     const mockClasses = [
  //       {
  //         id: 1,
  //         name: "Thiết kế đồ họa cơ bản",
  //         subject: "Đồ họa",
  //         students: 25,
  //         schedule: "Thứ 2, 4, 6 - 08:00-10:00",
  //         status: "Đang diễn ra",
  //         startDate: "2023-09-01",
  //         endDate: "2023-12-31",
  //         teacher: "Nguyễn Văn A",
  //         room: "Phòng Lab 101",
  //       },
  //       {
  //         id: 2,
  //         name: "Photoshop nâng cao",
  //         subject: "Xử lý ảnh",
  //         students: 20,
  //         schedule: "Thứ 3, 5, 7 - 13:00-15:00",
  //         status: "Sắp diễn ra",
  //         startDate: "2024-01-15",
  //         endDate: "2024-05-30",
  //         teacher: "Trần Thị B",
  //         room: "Phòng Lab 202",
  //       },
  //       {
  //         id: 3,
  //         name: "Illustrator cho người mới bắt đầu",
  //         subject: "Đồ họa vector",
  //         students: 22,
  //         schedule: "Thứ 2, 4, 6 - 14:00-16:00",
  //         status: "Đã kết thúc",
  //         startDate: "2023-03-01",
  //         endDate: "2023-06-30",
  //         teacher: "Lê Văn C",
  //         room: "Phòng Lab 303",
  //       },
  //       {
  //         id: 4,
  //         name: "Thiết kế UI/UX",
  //         subject: "Thiết kế giao diện",
  //         students: 18,
  //         schedule: "Thứ 3, 5, 7 - 09:00-11:00",
  //         status: "Đang diễn ra",
  //         startDate: "2023-10-01",
  //         endDate: "2024-02-28",
  //         teacher: "Phạm Thị D",
  //         room: "Phòng Lab 404",
  //       },
  //       {
  //         id: 5,
  //         name: "Đồ họa 3D cơ bản",
  //         subject: "3D Modeling",
  //         students: 15,
  //         schedule: "Thứ 2, 4, 6 - 18:00-20:00",
  //         status: "Sắp diễn ra",
  //         startDate: "2024-03-01",
  //         endDate: "2024-07-31",
  //         teacher: "Hoàng Văn E",
  //         room: "Phòng Lab 505",
  //       },
  //     ];
  //     setClasses(mockClasses);
  //   };

  //   fetchClasses();
  // }, []);

  const filteredClasses = classesUpdated.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || cls.status === filterStatus)
  );

  const handleShowDetails = (cls) => {
    setSelectedClass(cls);
  };

  const handleClosePopup = () => {
    setSelectedClass(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Danh sách lớp học
      </h2>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang diễn ra</option>
          <option value="INACTIVE">Sắp diễn ra</option>
          <option value="COMPLETED">Đã kết thúc</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Tên lớp</th>
              <th className="py-3 px-6 text-left">Môn học</th>
              <th className="py-3 px-6 text-center">Số học sinh</th>
              <th className="py-3 px-6 text-center">Lịch học</th>
              <th className="py-3 px-6 text-center">Trạng thái</th>
              <th className="py-3 px-6 text-center">Thời gian</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredClasses.map((cls) => (
              <tr
                key={cls.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{cls.name}</span>
                </td>
                <td className="py-3 px-6 text-left">{cls.courseName}</td>
                <td className="py-3 px-6 text-center">{cls.maxStudents}</td>
                <td className="py-3 px-6 text-center">{cls.schedule}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={` bg-${cls.status === "ACTIVE"
                      ? "green"
                      : cls.status === "INACTIVE"
                        ? "yellow"
                        : "red"
                      }-200 text-${cls.status === "ACTIVE"
                        ? "green"
                        : cls.status === "INACTIVE"
                          ? "yellow"
                          : "red"
                      }-600 py-1 px-3 rounded-full text-xs`}
                  >
                    {cls.status === "ACTIVE"
                      ? "Đang diễn ra"
                      : cls.status === "INACTIVE"
                        ? "Sắp diễn ra"
                        : "Đã kết thúc"}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {cls.startDate} - {cls.endDate}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleShowDetails(cls)}
                    className="bg-gray-900 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClass && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedClass.name}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Môn học:</strong> {selectedClass.courseName}
                  <br />
                  <strong>Số học sinh:</strong> {selectedClass.maxStudents}
                  <br />
                  <strong>Lịch học:</strong> {selectedClass.schedule}
                  <br />
                  <strong>Trạng thái:</strong> {selectedClass.status === "ACTIVE"
                    ? "Đang diễn ra"
                    : selectedClass.status === "INACTIVE"
                      ? "Sắp diễn ra"
                      : "Đã kết thúc"}
                  <br />
                  <strong>Thời gian:</strong> {selectedClass.startDate} -{" "}
                  {selectedClass.endDate}
                  <br />
                  <strong>Giáo viên:</strong> {selectedClass.teacherName}
                  <br />
                  <strong>Phòng học:</strong> {selectedClass.location}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleClosePopup}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassList;
