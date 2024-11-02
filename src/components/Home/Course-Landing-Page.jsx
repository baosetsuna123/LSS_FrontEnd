import { CheckCircle, Loader, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useClassContext } from "@/context/ClassContext";
import { useAuth } from "@/context/AuthContext";
import { fetchMajorClassByStudent } from "@/data/api";
import { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import home1 from "../../assets/home-carousel-1.png";
import home2 from "../../assets/home-2.png";
import home3 from "../../assets/home-3.jpg";

export function CourseLandingPage() {
  const [majorClasses, setMajorClasses] = useState([]);

  useEffect(() => {
    const fetchMajorClasses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const classes = await fetchMajorClassByStudent(token);
          setMajorClasses(classes);
          console.log(classes);
        }
      } catch (error) {
        console.error("Error fetching major classes:", error);
      }
    };

    fetchMajorClasses();
  }, []);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  const navigate = useNavigate();
  const { classes, loading } = useClassContext();
  const { isLoggedIn } = useAuth();
  const storedResult = localStorage.getItem("result");
  const currentUserName = storedResult
    ? JSON.parse(storedResult).username
    : null;
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    if (classes.length > 0 && currentUserName) {
      const status = {};
      classes.forEach((course) => {
        const classDetail = classes.find(
          (cls) => cls.classId === course.classId
        );
        if (classDetail && classDetail.students) {
          status[course.classId] = classDetail.students.some(
            (student) => student.userName === currentUserName
          );
        }
      });
      setEnrollmentStatus(status);
    }
  }, [classes, currentUserName]);
  const handleClassClick = (id) => {
    navigate(`/class/${id}`);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const carouselRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.next(); // Assuming your Carousel component exposes a `next` method
      }
    }, 3000); // 3000 ms = 3 seconds

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);
  const carouselItems = [
    {
      imageUrl: home1,
      title: "Unlock Your Potential",
      description: "Discover expert-led online courses to boost your skills.",
    },
    {
      imageUrl: home2,
      title: "Achieve Your Goals",
      description: "Take your career to new heights with our tailored courses.",
    },
    {
      imageUrl: home3,
      title: "Join a Community",
      description: "Become part of a vibrant learning community and network.",
    },
  ];
  const [, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Slide every 4 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  return (
    <>
      <div className="w-full overflow-x-hidden">
        <section className="relative w-full h-screen">
          <Carousel
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
            }}
            arrows={false}
            infinite={true}
            autoPlay={true} // Enable auto-play
            autoPlaySpeed={3000} // Set the speed of auto-play
            customTransition="transform 0.5s ease-in-out" // Smooth transition
            transitionDuration={500} // Transition duration
            itemClass="carousel-item-padding-40-px"
            beforeChange={(nextIndex) => setCurrentIndex(nextIndex)}
            // Disable user interaction
            draggable={false} // Prevent dragging
            swipeable={false} // Prevent swiping on touch devices
          >
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center h-screen"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover" // Cover entire section
                />
                <div className="absolute inset-0 bg-black opacity-30" />{" "}
                {/* Dark overlay */}
                <div className="relative flex flex-col items-center justify-center text-white bg-transparent p-4 h-full">
                  <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mt-4">
                    {item.title}
                  </h1>
                  <p className="mx-auto max-w-[700px] text-red-500 mt-2 font-bold md:text-xl">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 mx-auto md:px-6">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
              Why Choose EduCourse?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-transform transform hover:scale-105 bg-white shadow-md rounded-lg p-4">
                <CardHeader>
                  <CheckCircle className="w-10 h-10 mb-2 text-green-500 hover:text-green-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Expert Instructors
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Learn from industry professionals with years of experience.
                </CardContent>
              </Card>

              <Card className="transition-transform transform hover:scale-105 bg-white shadow-md rounded-lg p-4">
                <CardHeader>
                  <Users className="w-10 h-10 mb-2 text-blue-500 hover:text-blue-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Interactive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Engage with peers and instructors through forums and live
                  sessions.
                </CardContent>
              </Card>

              <Card className="transition-transform transform hover:scale-105 bg-white shadow-md rounded-lg p-4">
                <CardHeader>
                  <Star className="w-10 h-10 mb-2 text-yellow-500 hover:text-yellow-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Flexible Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Learn at your own pace with lifetime access to course
                  materials.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {isLoggedIn && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 mx-auto md:px-6">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
                Hot Topic
              </h2>
              {loading ? (
                <div className="flex justify-center">
                  <Loader className="w-10 h-10 animate-spin" />
                </div>
              ) : (
                <Carousel
                  ref={carouselRef}
                  responsive={responsive}
                  arrows={true}
                >
                  {majorClasses.map((course, index) => (
                    <Card
                      key={index}
                      onClick={() => handleClassClick(course.classId)}
                      className="transition-transform transform hover:scale-105 mx-2" // Add margin here
                    >
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-[200px] object-cover rounded-t-lg"
                      />
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl font-semibold">
                            {course.name}
                          </CardTitle>
                          <p className="text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300">
                            {course.courseCode}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(course.price)}
                          </p>
                          <p className="text-lg font-light text-gray-500">
                            Created by {course.teacherName}
                          </p>
                        </div>
                        <Button
                          className="mt-4 w-full"
                          disabled={enrollmentStatus[course.classId]}
                        >
                          {enrollmentStatus[course.classId]
                            ? "Enrolled"
                            : "Enroll Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Carousel>
              )}
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigate("/class")}
                  className="w-full px-6 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                >
                  Xem tất cả
                </Button>
              </div>
            </div>
          </section>
        )}
        {isLoggedIn && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 mx-auto md:px-6">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
                Featured Classes
              </h2>
              {loading ? (
                <div className="flex justify-center">
                  <Loader className="w-10 h-10 animate-spin" />
                </div>
              ) : (
                <Carousel
                  ref={carouselRef}
                  responsive={responsive}
                  arrows={true}
                >
                  {classes.map((course, index) => (
                    <Card
                      key={index}
                      onClick={() => handleClassClick(course.classId)}
                      className="transition-transform transform hover:scale-105 mx-2" // Add margin here
                    >
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-[200px] object-cover rounded-t-lg"
                      />
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl font-semibold">
                            {course.name}
                          </CardTitle>
                          <p className="text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300">
                            {course.courseCode}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(course.price)}
                          </p>
                          <p className="text-lg font-light text-gray-500">
                            Created by {course.teacherName}
                          </p>
                        </div>
                        <Button
                          className="mt-4 w-full"
                          disabled={enrollmentStatus[course.classId]}
                        >
                          {enrollmentStatus[course.classId]
                            ? "Enrolled"
                            : "Enroll Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Carousel>
              )}
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigate("/class")}
                  className="w-full px-6 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                >
                  Xem tất cả
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
              What Our Students Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  text: "The Web Development Bootcamp was exactly what I needed to switch careers. Highly recommended!",
                },
                {
                  name: "Sarah Lee",
                  text: "Data Science Fundamentals gave me a solid foundation. The instructors were knowledgeable and supportive.",
                },
                {
                  name: "Mike Brown",
                  text: "Digital Marketing Mastery helped me take my business to the next level. Great practical insights!",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="transition-transform transform hover:scale-105"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {testimonial.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-900 dark:bg-zinc-50">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Ready to Start Learning?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                  Join thousands of students and start your learning journey
                  today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-white rounded-lg shadow-md"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="rounded-lg shadow-md"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-300">
                  By signing up, you agree to our{" "}
                  <a className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
