import { useState } from "react";
import backgroundImage from "../assets/background2.png";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { fetchVerifyOtpApi } from "@/data/api";
import { toast } from "react-hot-toast";
// import { fetchResetPassword } from "@/data/api";

export default function ResetPassword() {
  const [newpass, setNewpass] = useState("");
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const test = 123456;
  const handleResetPassword = async () => {
    try {
      //   const responseMessage = await fetchResetPassword(newpass);
      //   console.log("Reset password successfully:", responseMessage);

      if (newpass == test) {
        toast.success("Reset password successfully");
        navigate("/login");
      }
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
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
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
                type="number"
                autoComplete="number"
                required
                className="appearance-none rounded-md pl-10 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New Password"
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
              />
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
          {showConfirm && ( // Conditional rendering for confirmation dialog
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                <h2 className="text-lg font-semibold mb-4">
                  Bạn có chắc là muốn thoát?
                </h2>
                <div className="flex justify-around">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={() => navigate("/login")} // Navigate to login on "Thoat"
                  >
                    Thoát
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    onClick={() => setShowConfirm(false)} // Close dialog on "Khong"
                  >
                    Không
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
