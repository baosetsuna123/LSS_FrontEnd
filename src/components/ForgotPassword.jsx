import { useState } from "react";
import backgroundImage from "../assets/background2.png";
import { ArrowLeft, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useHistory
import { fetchForgotPassword } from "@/data/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [phoneNumber, setPhone] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex =
      // eslint-disable-next-line no-useless-escape
      /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await fetchForgotPassword(phoneNumber);
      console.log("OTP sent successfully:", response);
      toast.success("OTP sent successfully");
      navigate("/verify-otp");
    } catch (error) {
      const errorMessage =
        error.response?.data ||
        error.message ||
        "An error occurred. Please try again.";
      console.error("Error during forgot password:", errorMessage);
      toast.error(errorMessage);
    }
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
          Reset your password
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="sr-only">
              PhoneNumber
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="phone"
                name="phone"
                type="number"
                autoComplete="number"
                required
                className="appearance-none rounded-md pl-10 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send OTP
            </button>
          </div>
        </form>
        <div className="mt-4 flex justify-center">
          <button
            className="group relative flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
