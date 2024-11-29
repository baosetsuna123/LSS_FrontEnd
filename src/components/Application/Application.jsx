import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createApplication } from "@/data/api";
import backgroundImage from "../../assets/background2.png";
import { FaInfoCircle, FaSpinner } from "react-icons/fa";
import { AlertTriangle, CircleX } from "lucide-react";

export function Application() {
  const [description, setDescription] = useState("");
  const [certificates, setCertificates] = useState([null, null]); // Initialize with two empty certificates
  const [certificateNames, setCertificateNames] = useState(["", ""]); // Initialize with two empty certificate names
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddCertificate = () => {
    setCertificates((prev) => [...prev, null]);
    setCertificateNames((prev) => [...prev, ""]);
  };

  const handleCertificateChange = (index, file) => {
    const updatedCertificates = [...certificates];
    updatedCertificates[index] = file;
    setCertificates(updatedCertificates);
  };

  const handleCertificateNameChange = (index, name) => {
    const updatedNames = [...certificateNames];
    updatedNames[index] = name;
    setCertificateNames(updatedNames);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
    setCertificateNames((prev) => prev.filter((_, i) => i !== index));
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const handleBackClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmExit = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const applicationData = {
      description,
      status: "PENDING",
    };

    try {
      const result = await createApplication(
        applicationData,
        certificates,
        certificateNames
      );
      toast.success("Application created successfully!");
      console.log("Created Application:", result);
      navigate("/login");
      // Reset form fields after successful submission
      setDescription("");
      setCertificates([null, null]); // Reset certificates to 2 empty values
      setCertificateNames(["", ""]); // Reset certificate names to 2 empty values
    } catch (error) {
      toast.error(error.message || "Failed to create application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6 sm:px-8 lg:px-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "130vh",
      }}
    >
      <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold mb-1 text-center text-gray-800">
          Registration Form
        </h2>
        <p className="text-center text-sm text-gray-600">
          Or{" "}
          <a
            onClick={handleBackClick}
            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Sign in to your existing account
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          {/* Description Section */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="title"
              className="text-gray-700 flex items-center font-semibold"
            >
              Description
              <FaInfoCircle className="ml-2 text-gray-500" />
            </label>
            <textarea
              id="title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              rows="4"
              placeholder="Tell us more about yourself and your major (Describe your certifications, projects, etc.)"
              required
            />
          </div>

          {/* Certificates Section */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Upload Certificates
            </label>
            {certificates.map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center space-y-4 md:space-x-4 mb-4"
              >
                <input
                  type="file"
                  accept=".pdf, .jpg, .png"
                  onChange={(e) =>
                    handleCertificateChange(index, e.target.files[0])
                  }
                  className="hidden"
                  id={`certificate-${index}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById(`certificate-${index}`).click()
                  }
                  className="bg-blue-500 text-white whitespace-nowrap py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600 transition duration-300"
                >
                  Choose File
                </button>
                <span className="text-gray-700 flex-1 whitespace-nowrap">
                  {certificates[index]?.name || "No file chosen"}
                </span>
                <input
                  type="text"
                  value={certificateNames[index]}
                  onChange={(e) =>
                    handleCertificateNameChange(index, e.target.value)
                  }
                  placeholder="Certificate name"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCertificate(index)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <CircleX />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCertificate}
              className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-600 transition duration-300"
            >
              Add Certificate
            </button>
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
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Confirm Exit
                  </h2>
                  <p className="text-gray-600">
                    Are you sure you want to exit? Your signup progress will be
                    lost and you will need to start over.
                  </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
                  <button
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    onClick={() => setShowConfirm(false)}
                  >
                    Stay Here
                  </button>
                  <button
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                    onClick={handleConfirmExit}
                  >
                    Yes, Exit
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
