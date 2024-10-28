import { useEffect, useState } from "react";
import backgroundImage from "../../assets/background2.png";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { fetchVerifyOtpApi } from "@/data/api";
import { toast } from "react-hot-toast";
import { LockOutlined } from "@ant-design/icons";
import { confirmOtp } from "@/data/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false); // Added state for confirmation dialog
  useEffect(() => {
    const pendingSignupType = sessionStorage.getItem("pendingSignupType");
    if (!pendingSignupType) {
      // No pending signup, redirect to signup page
      navigate("/signup");
    }
  }, [navigate]);
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await confirmOtp(otp);
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setShowConfirm(true);
  };
  const handleConfirmExit = () => {
    navigate("/login");
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Otp
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Otp
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ zIndex: 10 }}
              >
                {/* <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                 */}
                <LockOutlined />
              </div>
              <input
                id="otp"
                name="otp"
                type="number"
                autoComplete="number"
                required
                className="appearance-none rounded-md pl-10 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
        ${
          isLoading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 flex justify-center">
          <button
            className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleBackClick} // Updated to use handleBackClick
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>

          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
                {/* Warning Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </div>

                {/* Modal Content */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Confirm Exit
                  </h2>
                  <p className="text-gray-600">
                    Are you sure you want to exit? Your signup progress will be
                    lost and you will need to start over.
                  </p>
                </div>

                {/* Buttons */}
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

                {/* Optional: Click outside to close */}
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirm(false)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
