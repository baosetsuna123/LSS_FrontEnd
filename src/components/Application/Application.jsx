import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createApplication } from "@/data/api";
import backgroundImage from "../../assets/background2.png";
import { FaInfoCircle, FaSpinner } from "react-icons/fa";
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
          Registration Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="title"
              className="text-gray-700 flex items-center font-semibold"
            >
              Title
              <FaInfoCircle className="ml-2 text-gray-500" />
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter the title"
              required
            />
          </div>

          {/* Description Section */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="description"
              className="text-gray-700 flex items-center font-semibold"
            >
              Description
              <FaInfoCircle className="ml-2 text-gray-500" />
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              rows="4"
              placeholder="Enter a detailed description"
              required
            />
          </div>

          {/* Certificate Upload Section */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="certificate"
              className="text-gray-700 font-semibold"
            >
              Upload your certificate (PDF, JPG, or PNG)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="certificate"
                accept=".pdf, .jpg, .png"
                onChange={(e) => setCertificate(e.target.files[0])}
                className="hidden"
              />
              <button
                type="button" // Prevents form submission
                onClick={() => document.getElementById("certificate").click()}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600 transition duration-300"
              >
                Choose File
              </button>
              <span className="text-gray-700">
                {certificate ? certificate.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 ${
                isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 inline-block" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
