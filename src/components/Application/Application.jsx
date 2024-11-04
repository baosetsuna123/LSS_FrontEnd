import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createApplication } from "@/data/api";
import backgroundImage from "../../assets/background2.png";
export function Application() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const applicationData = {
      title,
      description,
      status: "PENDING",
    };

    try {
      const result = await createApplication(applicationData, certificate);
      toast.success("Application created successfully!");
      console.log("Created Application:", result);
      navigate("/login");
      // Reset form fields after successful submission
      setTitle("");
      setDescription("");
      setCertificate(null);
    } catch (error) {
      toast.error(error.message || "Failed to create application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Đăng ký giảng dạy
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-gray-700">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="certificate" className="block mb-2 text-gray-700">
              Chứng chỉ (nếu có)
            </label>
            <input
              type="file"
              id="certificate"
              onChange={(e) => setCertificate(e.target.files[0])}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`w-full text-white font-semibold px-4 py-2 rounded transition-colors ${
              isLoading ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-600"
            }`}
          >
            {isLoading ? "Submitting..." : "Gửi đơn"}
          </button>
        </form>
      </div>
    </div>
  );
}
