import { fetchClassbyteacher } from "@/data/api";
import { useState, useEffect } from "react";

function CreateClassroom() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classroomType, setClassroomType] = useState("online");
  const [classroomDetails, setClassroomDetails] = useState("");
  const [platform, setPlatform] = useState("zoom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
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

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      setClasses(res);
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchClasses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Giả lập gửi yêu cầu lên server
    try {
      // Thay thế bằng cuộc gọi API thực tế
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Tạo phòng học:", {
        class: selectedClass,
        type: classroomType,
        details: classroomDetails,
        platform: classroomType === "online" ? platform : null,
        date,
        time,
        duration,
      });
      setSubmitMessage("Phòng học đã được tạo thành công!");
      // Reset form
      setSelectedClass("");
      setClassroomType("online");
      setClassroomDetails("");
      setPlatform("zoom");
      setDate("");
      setTime("");
      setDuration("");
    } catch (error) {
      console.error("Có lỗi xảy ra khi tạo phòng học:", error);
      setSubmitMessage(
        "Có lỗi xảy ra khi tạo phòng học. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Tạo phòng học cho lớp
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="class"
            className="block mb-2 font-medium text-gray-700"
          >
            Chọn lớp
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Loại phòng học
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="online"
                checked={classroomType === "online"}
                onChange={() => setClassroomType("online")}
                className="form-radio text-gray-600"
              />
              <span className="ml-2">Online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="offline"
                checked={classroomType === "offline"}
                onChange={() => setClassroomType("offline")}
                className="form-radio text-gray-600"
              />
              <span className="ml-2">Offline</span>
            </label>
          </div>
        </div>
        {classroomType === "online" && (
          <div>
            <label
              htmlFor="platform"
              className="block mb-2 font-medium text-gray-700"
            >
              Nền tảng
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="zoom">Zoom</option>
              <option value="google-meet">Google Meet</option>
              <option value="microsoft-teams">Microsoft Teams</option>
            </select>
          </div>
        )}
        <div>
          <label
            htmlFor="details"
            className="block mb-2 font-medium text-gray-700"
          >
            Chi tiết phòng học
          </label>
          <input
            type="text"
            id="details"
            value={classroomDetails}
            onChange={(e) => setClassroomDetails(e.target.value)}
            placeholder={
              classroomType === "online"
                ? "Link hoặc ID phòng học"
                : "Địa chỉ phòng học"
            }
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block mb-2 font-medium text-gray-700"
            >
              Ngày học
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="time"
              className="block mb-2 font-medium text-gray-700"
            >
              Giờ học
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="duration"
            className="block mb-2 font-medium text-gray-700"
          >
            Thời lượng (phút)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo phòng học"}
        </button>
      </form>
      {submitMessage && (
        <div
          className={`mt-4 p-4 rounded-lg ${submitMessage.includes("thành công")
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
}

export default CreateClassroom;
