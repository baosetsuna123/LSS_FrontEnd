import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchCreateApplication } from "@/data/api";
import backgroundImage from "../../assets/background2.png";
export function Application() {
  const [formData, setFormData] = useState({
    title: "",
    major: "",
    experience: "",
    cv: "",
    certificate: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const status = "PENDING";
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const requestBody = { status: status, ...formData };
    try {
      const response = await fetchCreateApplication(requestBody);
      console.log("Application created successfully:", response);
      toast.success("Application created successfully");
      setFormSubmitted(true);
      navigate("/login");
    } catch (error) {
      console.error(
        "Application creation failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Application creation failed");
    } finally {
      setIsLoading(false); // Stop loading after request completes
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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="major" className="block mb-2 text-gray-700">
                Chuyên ngành <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block mb-2 text-gray-700">
                Môn đăng ký dạy <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="experience" className="block mb-2 text-gray-700">
              Kinh nghiệm giảng dạy
            </label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="certificate" className="block mb-2 text-gray-700">
              Chứng chỉ (nếu có)
            </label>
            <textarea
              id="certificate"
              name="certificate"
              value={formData.certificate}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="cv" className="block mb-2 text-gray-700">
              Link CV (nếu có)
            </label>
            <input
              type="url"
              id="cv"
              name="cv"
              value={formData.cv}
              onChange={handleChange}
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
        {formSubmitted && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Đơn của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và liên hệ
            lại với bạn sớm.
          </div>
        )}
      </div>
    </div>
  );
}
