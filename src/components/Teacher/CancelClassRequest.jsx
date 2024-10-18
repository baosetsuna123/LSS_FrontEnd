import { fetchClassbyteacher } from "@/data/api";
import { useState, useEffect } from "react";

function CancelClassRequest() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [reason, setReason] = useState("");
  const [cancelDate, setCancelDate] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [additionalInfo, setAdditionalInfo] = useState("");
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
  }, [token])

  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    const fetchClasses = async () => {
      // Thay thế bằng cuộc gọi API thực tế
      const mockClasses = [
        {
          id: 1,
          name: "Lớp A",
          course: " thiết kế đồ họa",
          schedule: "Thứ 2, 4, 6 - 18:00-20:00",
        },
        {
          id: 2,
          name: "Lớp B",
          course: "Kỹ thuật máy tính",
          schedule: "Thứ 3, 5, 7 - 19:00-21:00",
        },
        {
          id: 3,
          name: "Lớp C",
          course: "Kinh tế thị trường",
          schedule: "Thứ 2, 4, 6 - 14:00-16:00",
        },
      ];
      setClasses(mockClasses);
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Giả lập gửi yêu cầu lên server
    try {
      // chỗ này thay thế bằng dữ liệu gọi api real nhé
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Yêu cầu hủy lớp:", {
        class: selectedClass,
        reason,
        cancelDate,
        urgency,
        additionalInfo,
      });
      setSubmitMessage(
        "Yêu cầu hủy lớp đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể."
      );
      // Reset form
      setSelectedClass("");
      setReason("");
      setCancelDate("");
      setUrgency("normal");
      setAdditionalInfo("");
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu:", error);
      setSubmitMessage("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Gửi yêu cầu hủy lớp
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
          <label
            htmlFor="reason"
            className="block mb-2 font-medium text-gray-700"
          >
            Lý do hủy
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="cancelDate"
            className="block mb-2 font-medium text-gray-700"
          >
            Ngày muốn hủy
          </label>
          <input
            type="date"
            id="cancelDate"
            value={cancelDate}
            onChange={(e) => setCancelDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="urgency"
            className="block mb-2 font-medium text-gray-700"
          >
            Mức độ khẩn cấp
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Bình thường</option>
            <option value="urgent">Khẩn cấp</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="additionalInfo"
            className="block mb-2 font-medium text-gray-700"
          >
            Thông tin bổ sung (nếu có)
          </label>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu hủy"}
        </button>
      </form>
      {submitMessage && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            submitMessage.includes("thành công")
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

export default CancelClassRequest;
