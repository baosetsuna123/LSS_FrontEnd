import { useState } from "react";
import backgroundImage from "../../assets/background2.png";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { confirmOtp } from "@/data/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtpRegister() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
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
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      {/* Main Card */}
      <div className="max-w-md w-full mx-auto mt-16 space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        {/* Heading */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify OTP
        </h2>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
          {/* OTP Input */}
          <div className="space-y-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup className="flex justify-center gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      className="w-14 h-14 text-lg font-medium text-gray-800 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
            ${
              isLoading || otp.length !== 6
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

        {/* Back Button */}
        <div className="mt-4 flex justify-center">
          <button
            className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
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
                Are you sure you want to exit? Your signup progress will be lost
                and you will need to start over.
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
    </div>
  );
}
