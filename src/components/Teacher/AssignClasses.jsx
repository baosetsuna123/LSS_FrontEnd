import { fetchClassbyteacherName } from "@/data/api";
import { useState, useEffect } from "react";

function AssignClasses() {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [teacherSpecialization, setTeacherSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const result = localStorage.getItem("result")
  let token;
  let nameTeacher;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
      nameTeacher = parsedResult.fullName;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchClasses = async () => {
      // Thay thế bằng cuộc gọi API thực tế
      try {
        const res = await fetchClassbyteacherName(nameTeacher,token);
        setAvailableClasses(res);
      } catch (error) {
        console.log(error)
      }
    };

    fetchClasses();
    // Giả lập lấy chuyên môn của giáo viên
    setTeacherSpecialization("Thiết kế đồ họa cơ bản");
  }, [nameTeacher,token]);

  const handleClassSelect = (classId) => {
    const classToSelect = availableClasses.find((cls) => cls.id === classId);
    if (classToSelect.status === "Đã phân công") {
      alert("Lớp học này đã được phân công. Không thể chọn.");
      return;
    }
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSubmit = () => {
    console.log("Các lớp đã chọn:", selectedClasses);
    // Xử lý gửi thông tin lên server
    alert("Đã gửi yêu cầu phân công lớp học thành công!");
  };

  const filteredClasses = availableClasses.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCourse === "" || cls.course === filterCourse) &&
      (filterStatus === "" || cls.status === filterStatus)
  );

  const courses = [...new Set(availableClasses.map((cls) => cls.course))];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Phân công lớp học
      </h2>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          Chuyên môn của bạn: <strong>{teacherSpecialization}</strong>
        </p>
      </div>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả khóa học</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Chưa phân công">Chưa phân công</option>
          <option value="Đã phân công">Đã phân công</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredClasses.map((cls) => (
          <li
            key={cls.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${cls.status === "Đã phân công" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`class-${cls.id}`}
                checked={selectedClasses.includes(cls.id)}
                onChange={() => handleClassSelect(cls.id)}
                disabled={cls.status === "Đã phân công"}
                className={`mr-4 h-5 w-5 ${cls.status === "Đã phân công"
                    ? "text-gray-400"
                    : "text-blue-600"
                  }`}
              />
              <label htmlFor={`class-${cls.id}`} className="flex flex-col">
                <span className="font-semibold">
                  {cls.name} - {cls.course}
                </span>
                <span className="text-sm text-gray-600">{cls.schedule}</span>
                <span className="text-sm text-gray-600">
                  Sĩ số: {cls.enrolled}/{cls.capacity}
                </span>
              </label>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${cls.course === teacherSpecialization
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {cls.course === teacherSpecialization
                  ? "Phù hợp chuyên môn"
                  : "Khác chuyên môn"}
              </span>
              <span
                className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold ${cls.status === "Chưa phân công"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                  }`}
              >
                {cls.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        disabled={selectedClasses.length === 0}
      >
        Xác nhận phân công
      </button>
    </div>
  );
}

export default AssignClasses;
