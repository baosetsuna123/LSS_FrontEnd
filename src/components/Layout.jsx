import { BookOpen, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef(null);

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

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-orange-500 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link to="/" className="flex items-center justify-center">
          {" "}
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
            to="/courses"
          >
            Courses
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
          <Link
            to="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 EduCourse. All rights reserved.
        </p>
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
