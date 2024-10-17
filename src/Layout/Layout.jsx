import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BookOpen, LogOut, Search, User, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useClassContext } from "@/context/ClassContext";

export function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const { isLoggedIn, logout } = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const { clearClasses, setLoading } = useClassContext();
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  const togglePopup = (event) => {
    event.stopPropagation();
    setIsPopupVisible((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("result");
    localStorage.removeItem("classes");
    setIsPopupVisible(false);
    clearClasses();
    setLoading(true);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-orange-500 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link to="/" className="flex items-center justify-center">
          <BookOpen className="h-6 w-6 mr-2" />
          <span className="font-bold">EduCourse</span>
        </Link>
        <div className="flex items-center mx-auto">
          <Search
            className="h-6 w-6 mr-2 cursor-pointer"
            onClick={() => searchInputRef.current.focus()}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search course ..."
            className="border rounded px-4 py-1 w-96"
          />
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/class"
          >
            Classes
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/contact"
          >
            Contact
          </Link>
          {isLoggedIn ? (
            <div className="relative">
              <User
                className="h-6 w-6 cursor-pointer"
                onClick={togglePopup}
                aria-hidden="true"
              />
              {isPopupVisible && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                >
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/wallet"
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    My Wallet
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Login
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="flex flex-col bg-orange-500 gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-semibold">
        <p className="text-xs">© 2024 EduCourse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
