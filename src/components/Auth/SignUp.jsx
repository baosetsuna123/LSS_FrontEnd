import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import backgroundImage from "../../assets/background2.png";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSignUpStudent, fetchSignUpTeacher } from "@/data/api"; // Import the teacher registration API
import { toast } from "react-hot-toast";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const initialUserType = location.state?.userType || "student"; // Default to 'student' if not provided
  const [userType, setUserType] = useState(initialUserType);
  const [phoneNumber, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      toast.error("Confirm Password does not match Password.");
      return;
    }
    setIsLoading(true);
    try {
      if (userType === "student") {
        await fetchSignUpStudent(
          username,
          password,
          email,
          fullName,
          phoneNumber
        );
        toast.success("Please verify your email with OTP");
        navigate("/verify-otp");
      } else if (userType === "teacher") {
        await fetchSignUpTeacher(
          username,
          password,
          email,
          fullName,
          phoneNumber
        );
        toast.success("Please complete your application form");
        navigate("/create-application");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup failed");
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
      <div className="max-w-md w-full space-y-8 bg-white p-5 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className=" text-center text-sm text-gray-600">
            Or{" "}
            <a
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Sign in to your existing account
            </a>
          </p>
        </div>
        <div className="flex justify-center space-x-2 mb-4">
          {["student", "teacher"].map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                userType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div
                  style={{ zIndex: 10 }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <UserPlus
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <div className="relative">
                <div
                  style={{ zIndex: 10 }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div
                  style={{ zIndex: 10 }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div
                  style={{ zIndex: 10 }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    style={{ zIndex: 10 }}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  style={{ zIndex: 1 }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
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
                      <Eye
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="confirmpassword" className="sr-only">
                Confirm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound
                    style={{ zIndex: 10 }}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  style={{ zIndex: 1 }}
                  id="confirmpassword"
                  name="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:border-zinc-800"
                  placeholder="Confirm Password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div
                  style={{ zIndex: 1 }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
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
                      <Eye
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-zinc-200 text-sm font-medium rounded-md text-white
    ${
      isLoading
        ? "bg-indigo-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700"
    } 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
    dark:border-zinc-800 transition-colors duration-200`}
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
                  Processing...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>
        <div className="">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
