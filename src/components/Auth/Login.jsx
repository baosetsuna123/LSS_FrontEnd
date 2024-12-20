import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import backgroundImage from "../../assets/background2.png";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "@/data/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useClassContext } from "@/context/ClassContext";
export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { getClasses } = useClassContext();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchLogin(username, password);

      localStorage.setItem("result", JSON.stringify(response.data));
      sessionStorage.setItem("token", response.data.token);
      login();

      // Navigate based on user role
      if (response.data.role === "STAFF") {
        navigate("/dashboard");
      } else if (response.data.role === "TEACHER") {
        navigate("/teacher");
      } else if (response.data.role === "STUDENT") {
        navigate("/");
        getClasses(response.data.token, "STUDENT");
      } else if (response.data.role === "ADMIN") {
        navigate("/admin");
      } // Optionally fetch classes based on the role
      toast.success("Login successful");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 404:
            toast.error("Account does not exist. Please sign up.");
            break;
          case 401:
            toast.error("Invalid username or password.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error("Login failed. Please try again.");
        }
      } else if (error.request) {
        // Network error (no response received)
        toast.error(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        // Something else went wrong
        toast.error("Login failed. Please try again.");
      }
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
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
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  style={{ zIndex: 1 }}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                    style={{ zIndex: 10 }}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  style={{ zIndex: 1 }}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                    className="focus:outline-none"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                onClick={() => navigate("/forgot-password")}
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className=" text-center" style={{ marginTop: "0.5rem" }}>
          {" "}
          <a
            onClick={() => navigate("/signup")}
            className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer underline text-sm"
          >
            Don&apos;t have an account?
          </a>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
