import { useState } from "react";
import backgroundImage from "../../assets/background2.png";
import {
  AlertTriangle,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { resetPassword } from "@/data/api"; // Assuming you have this API method defined

export default function ResetPassword() {
  const [newpass, setNewpass] = useState("");
  const [confirmPass, setConfirmPass] = useState(""); // New state for confirm password
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility of new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle visibility of confirm password
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = async () => {
    if (newpass !== confirmPass) {
      // Check if new password and confirm password match
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const responseMessage = await resetPassword(newpass); // Assuming you pass the new password to the API
      console.log("Reset password successfully:", responseMessage);

      toast.success("Reset password successfully");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data ||
        error.message ||
        "An error occurred. Please try again.";
      console.error("Error during forgot password:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleBackClick = () => {
    setShowConfirm(true); // Show confirmation dialog
  };
  const handleConfirmExit = () => {
    navigate("/login"); // Navigate to login if user confirms exit
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
          Reset Password
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          {/* New Password Field */}
          <div>
            <label htmlFor="newpass" className="sr-only">
              New Password
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <Lock
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                  style={{ zIndex: 10 }}
                />
              </div>
              <input
                id="newpass"
                name="newpass"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                autoComplete="new-password"
                required
                className="appearance-none rounded-md pl-10 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Password"
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmpass" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <KeyRound
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                  style={{ zIndex: 10 }}
                />
              </div>
              <input
                id="confirmpass"
                name="confirmpass"
                type={showConfirmPassword ? "text" : "password"} // Toggle password visibility
                autoComplete="new-password"
                required
                className="appearance-none rounded-md pl-10 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>

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
                    Are you sure you want to exit? Your change-password progress
                    will be lost and you will need to start over.
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
      </div>
    </div>
  );
}
