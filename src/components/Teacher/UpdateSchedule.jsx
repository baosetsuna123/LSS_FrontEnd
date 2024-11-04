import {
  fetchClassbyteacher,
  fetchCoursesService,
  fetchSlots,
  fetchUpdateClass,
} from "@/data/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaClock } from "react-icons/fa";

function UpdateSchedule() {
  const [classes, setClasses] = useState([]);
  const [classesUpdated, setClassesUpdated] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [classShow, setClassShow] = useState(null);
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

  // const teachers = [
  //   "Nguyễn Văn A",
  //   "Trần Thị B",
  //   "Lê Văn C",
  //   "Phạm Thị D",
  //   "Hoàng Văn E",
  // ];
  // const rooms = [
  //   "Phòng Lab 101",
  //   "Phòng Lab 202",
  //   "Phòng Lab 303",
  //   "Phòng Lab 404",
  //   "Phòng Lab 505",
  // ];

  const daysOfWeek = [
    { value: 2, name: "Monday" },
    { value: 3, name: "Tuesday" },
    { value: 4, name: "Wednesday" },
    { value: 5, name: "Thursday" },
    { value: 6, name: "Friday" },
    { value: 7, name: "Saturday" },
    { value: 8, name: "Sunday" },
  ];
  // const formatSchedule = (startDate, endDate) => {

  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const dayNames = [];

  //   for (let m = new Date(start); m <= end; m.setDate(m.getDate() + 1)) {
  //     const dayIndex = m.getDay();

  //     if (!dayNames.includes(daysOfWeek[dayIndex])) {
  //       dayNames.push(daysOfWeek[dayIndex]);
  //     }
  //   }

  //   const startTime = start.toTimeString().slice(0, 5);
  //   const endTime = end.toTimeString().slice(0, 5);

  //   return `${dayNames.join(', ')} - ${startTime} - ${endTime}`;
  // };

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      console.log(res);
      setClasses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await fetchCoursesService(token);
      setCourses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchSlotList = async () => {
    try {
      const res = await fetchSlots(token);
      setSlots(res);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchSlotList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (classes.length > 0 && courses.length > 0 && slots.length > 0) {
      const newClasses = classes.map((classItem) => {
        const course = courses.find(
          (course) => course.courseCode === classItem.courseCode
        );
        const slot = slots.find((slot) => slot.slotId === classItem.slotId);
        return {
          ...classItem,
          courseName: course ? course.name : "Khóa học không xác định",
          slotStart: slot ? slot.start : "Thời gian không xác định",
          slotEnd: slot ? slot.end : "Thời gian không xác định",
        };
      });

      setClassesUpdated(newClasses);
    }
  }, [classes, courses, slots]);
  const [initialMaxStudents, setInitialMaxStudents] = useState(null);


  const handleEdit = (classInfo) => {
    setClassShow(classInfo)
    setEditingClass({ ...classInfo });
    setInitialMaxStudents(classInfo.maxStudents);
    setMaxStudentsError("");
    setIsPopupOpen(true);
  };
  const [maxStudentsError, setMaxStudentsError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "maxStudents") {
      const newMaxStudents = Number(value);

      if (value && newMaxStudents < initialMaxStudents) {
        console.log(newMaxStudents, initialMaxStudents);
        setMaxStudentsError(
          "Số học sinh không được nhỏ hơn số học sinh hiện tại"
        );
      } else {
        setMaxStudentsError("");
      }
    }
    setEditingClass((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async (updatedClass) => {
    if (maxStudentsError) {
      toast.error(maxStudentsError);
      return;
    }
    try {
      if(updatedClass.maxStudents < classShow.maxStudents){
        toast.error(`Số học sinh đang chỉnh sửa không được nhỏ hơn số học sinh hiện tại`)
        return;
      }

      await fetchUpdateClass({ data: { ...updatedClass }, token });

      fetchCourses();
      fetchClasses();
      setIsPopupOpen(false);
      setEditingClass(null);
      toast.success("Lớp học đã được cập nhật thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setEditingClass(null);
  };
  const filteredClasses = classesUpdated.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Cập nhật thông tin lớp học
      </h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul className="space-y-4">
        {filteredClasses.map((cls) => (
          <li
            key={cls.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Lớp {cls.name}</h3>
                <p className="text-gray-600">Môn học: {cls.courseName}</p>
                <p className="text-gray-600">
                  Số học sinh tối đa: {cls.maxStudents}
                </p>
                <p className="text-gray-600">Ngày học: {cls.startDate}</p>
                <p className="mt-2">
                  <span className="font-medium"></span>
                  {daysOfWeek.find((day) => day.value === Number(cls.dayOfWeek))
                    ?.name || "Unknown"}
                  : {cls.slotStart} - {cls.slotEnd}
                </p>
              </div>
              <button
                onClick={() => handleEdit(cls)}
                className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isPopupOpen && editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <h3 className="text-2xl font-bold mb-4">
              Chỉnh sửa thông tin lớp học
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Tên lớp:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  disabled
                  value={editingClass.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Môn học:
                </label>
                <select
                  id="course"
                  name="course"
                  value={editingClass.courseCode || ""}
                  disabled
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Chọn khóa học
                  </option>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Không có khóa học nào
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="students"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Số học sinh:
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  placeholder={`Số học sinh hiện tại là ${classShow.maxStudents}`}
                  value={editingClass.maxStudents}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {maxStudentsError && (
                  <p className="text-red-500 mt-1 text-sm">
                    {maxStudentsError}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="teacher"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Giáo viên:
                </label>
                <select
                  id="teacher"
                  name="teacher"
                  value={editingClass.teacherName}
                  onChange={handleInputChange}
                  disabled
                  className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))} */}
                  <option>{editingClass.teacherName}</option>
                </select>
              </div>
              <div className="mb-4 col-span-2">
                {/* <label className="block mb-2 font-medium text-gray-700">
                  Thời gian học:
                </label> */}
                <div className="flex items-center space-x-4">
                  {/* <div className="relative flex-1">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      disabled
                      value={startTime}
                      onChange={(e) => handleTimeChange(e, "start")}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                  {/* <span className="text-gray-500">đến</span>
                  <div className="relative flex-1">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      disabled
                      value={endTime}
                      onChange={(e) => handleTimeChange(e, 'end')}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                </div>
              </div>
              <div>
                <label
                  htmlFor="room"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Link phòng học:
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editingClass.location}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="room"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Ngày học
                </label>
                <select
                  id="dayofWeek"
                  name="dayofWeek"
                  disabled
                  value={editingClass.dayOfWeek}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {daysOfWeek.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                  Thời gian học:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      id="slotId"
                      name="slotId"
                      disabled
                      value={editingClass.slotId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {slots.map((slot) => (
                        <option key={slot.slotId} value={slot.slotId}>
                          Tiết {slot.slotId} ({slot.start} - {slot.end})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* <div>
                <label
                  htmlFor="image"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Hình ảnh:
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    className="w-full h-auto max-h-48 object-cover rounded-lg"
                  />
                </div>
              )} */}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleSave(editingClass)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateSchedule;
