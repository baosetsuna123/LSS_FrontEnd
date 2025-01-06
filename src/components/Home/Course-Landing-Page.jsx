import { CheckCircle, Loader, Star, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useClassContext } from "@/context/ClassContext";
import { useAuth } from "@/context/AuthContext";
import { fetchMajorClassByStudent, fetchCommentsHome } from "@/data/api";
import { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import home1 from "../../assets/home-carousel-1.png";
import home2 from "../../assets/home-2.png";
import home3 from "../../assets/home-3.jpg";
import defaults from "../../assets/default.jfif";
import "./Course-Landing-Page.css";

export function CourseLandingPage() {
  const [majorClasses, setMajorClasses] = useState([]);
  const [loadingm, setLoadingm] = useState(false);
  const [average, setAverage] = useState(0);
  const token = sessionStorage.getItem("token");
  const { classes, loading } = useClassContext();

  useEffect(() => {
    const fetchMajorClasses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        setLoadingm(true);
        const classes = await fetchMajorClassByStudent(token);

        const sortedClasses = classes.sort(
          (a, b) => a?.startDate - b?.startDate
        );

        setMajorClasses(sortedClasses);
      } catch (error) {
        console.error("Error fetching major classes:", error);
      } finally {
        setLoadingm(false);
      }
    };

    fetchMajorClasses();
  }, []);
  const [comments, setComments] = useState([]);
  const [loadingc, setLoadingc] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingc(true);
        const data = await fetchCommentsHome();
        setComments(data);
      } catch (error) {
        console.error("Error fetching major classes:", error);
      } finally {
        setLoadingc(false);
      }
    };

    fetchComments();
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
  const [sortedClasses, setSortedClasses] = useState([]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      // Sort the classes by the number of students in descending order
      const sorted = [...classes].sort((a, b) => a?.startDate - b?.startDate);
      setSortedClasses(sorted);
    }
  }, [classes]);
  const { isLoggedIn } = useAuth();
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
  useEffect(() => {
    const fetchAverages = async () => {
      try {
        const feedbackAverages = sortedClasses
          .filter(
            (course) =>
              course.status === "PENDING" || course.status === "ACTIVE"
          )
          .map((course) => course.teacherFeedback || null); // Use null if teacherFeedback is undefined

        setAverage(feedbackAverages); // Update state with the feedback averages
      } catch (error) {
        console.error("Error fetching average feedback:", error);
      }
    };

    fetchAverages();
  }, [token, sortedClasses]);
  const [averageMajor, setAverageMajor] = useState(0);
  useEffect(() => {
    const fetchAveragesMajor = async () => {
      try {
        const feedbackAverages = majorClasses
          .filter(
            (course) =>
              course.status === "PENDING" || course.status === "ACTIVE"
          )
          .map((course) => course.teacherFeedback || null); // Use null if teacherFeedback is undefined

        setAverageMajor(feedbackAverages); // Update state with the feedback averages
      } catch (error) {
        console.error("Error fetching average feedback:", error);
      }
    };

    fetchAveragesMajor();
  }, [token, majorClasses]);
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
        <section className="w-full py-3 md:py-6 lg:py-12 bg-background">
          <div className="container px-4 mx-auto md:px-6">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
              Why Choose EduCourse?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-transform transform hover:scale-105 bg-card shadow-md rounded-lg p-4">
                <CardHeader>
                  <CheckCircle className="w-10 h-10 mb-2 text-green-500 hover:text-green-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-card-foreground">
                    Expert Instructors
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Learn from industry professionals with years of experience.
                </CardContent>
              </Card>
              <Card className="transition-transform transform hover:scale-105 bg-card shadow-md rounded-lg p-4">
                <CardHeader>
                  <Users className="w-10 h-10 mb-2 text-blue-500 hover:text-blue-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-card-foreground">
                    Interactive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Engage with peers and instructors through forums and live
                  sessions.
                </CardContent>
              </Card>

              <Card className="transition-transform transform hover:scale-105 bg-card shadow-md rounded-lg p-4">
                <CardHeader>
                  <Star className="w-10 h-10 mb-2 text-yellow-500 hover:text-yellow-700 transition duration-300" />
                  <CardTitle className="text-xl font-semibold text-card-foreground">
                    Flexible Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Learn at your own pace with lifetime access to course
                  materials.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {isLoggedIn &&
          majorClasses.length > 0 &&
          majorClasses.some(
            (classItem) =>
              classItem.status === "PENDING" || classItem.status === "ACTIVE"
          ) && (
            <section className="w-full py-4 md:py-16 lg:py-24">
              <div className="container px-4 mx-auto md:px-6">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
                  Related Lessons
                </h2>
                {loadingm ? (
                  <div className="flex justify-center">
                    <Loader className="w-10 h-10 animate-spin" />
                  </div>
                ) : (
                  <Carousel
                    ref={carouselRef}
                    responsive={responsive}
                    arrows={true}
                    className={
                      majorClasses.filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      ).length <= 2
                        ? "flex justify-center"
                        : ""
                    }
                  >
                    {majorClasses
                      .filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      )
                      .map((course, index) => {
                        const rating = averageMajor[index]; // Get the average rating for the current class
                        if (!rating) return null; // Skip rendering if no rating is available

                        const fullStars = Math.floor(rating); // Number of full stars
                        const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Either 1 half star or none
                        const emptyStars = Math.max(
                          6 - fullStars - halfStar,
                          0
                        ); // Ensure non-negative

                        return (
                          <Card
                            key={index}
                            onClick={() => handleClassClick(course.classId)}
                            className="transition-transform transform hover:scale-105 mx-2"
                          >
                            <img
                              src={course.imageUrl || defaults}
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
                                <p className="text-lg text-gray-500 dark:text-gray-300 font-medium">
                                  {course.teacherName}
                                </p>
                              </div>

                              {/* Display the average rating */}
                              <div className="mt-4">
                                <div className="flex justify-center mt-2 gap-x-2">
                                  {/* Render full stars */}
                                  {[...Array(fullStars)].map((_, i) => (
                                    <svg
                                      key={`full-${i}`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="#fdd835"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  ))}

                                  {/* Render half star if applicable */}
                                  {halfStar === 1 && (
                                    <svg
                                      key="half-star"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="#fdd835"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  )}

                                  {/* Render empty stars */}
                                  {[...Array(emptyStars)].map((_, i) => (
                                    <svg
                                      key={`empty-${i}`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>

                              <Button className="mt-4 w-full dark:bg-orange-500 dark:hover:bg-orange-700">
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </Carousel>
                )}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => navigate("/class")}
                    className={`dark:bg-orange-500 dark:hover:bg-orange-600 ${
                      majorClasses.filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      ).length <= 2
                        ? "w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                        : "w-full px-6 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                    }`}
                  >
                    View All
                  </Button>
                </div>
              </div>
            </section>
          )}

        {isLoggedIn &&
          sortedClasses.length > 0 &&
          sortedClasses.some(
            (classItem) =>
              classItem.status === "PENDING" || classItem.status === "ACTIVE"
          ) && (
            <section className="w-full py-3 md:py-6 lg:py-12">
              <div className="container px-4 mx-auto md:px-6">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
                  Featured Lessons
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
                    className={
                      classes.filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      ).length <= 2
                        ? "flex justify-center"
                        : ""
                    }
                  >
                    {sortedClasses
                      .filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      )
                      .map((course, index) => {
                        const rating = average[index]; // Get the average rating for the current class
                        if (!rating) return null; // Skip rendering if no rating is available

                        const fullStars = Math.floor(rating); // Number of full stars
                        const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Either 1 half star or none
                        const emptyStars = Math.max(
                          6 - fullStars - halfStar,
                          0
                        ); // Ensure non-negative

                        return (
                          <Card
                            key={index}
                            onClick={() => handleClassClick(course.classId)}
                            className="transition-transform transform hover:scale-105 mx-2"
                          >
                            <img
                              src={course.imageUrl || defaults}
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
                                <p className="text-lg text-gray-500 dark:text-gray-300 font-medium">
                                  {course.teacherName}
                                </p>
                              </div>

                              {/* Display the average rating */}
                              <div className="mt-4">
                                <div className="flex justify-center mt-2 gap-x-2">
                                  {/* Render full stars */}
                                  {[...Array(fullStars)].map((_, i) => (
                                    <svg
                                      key={`full-${i}`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="#fdd835"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  ))}

                                  {/* Render half star if applicable */}
                                  {halfStar === 1 && (
                                    <svg
                                      key="half-star"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="#fdd835"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  )}

                                  {/* Render empty stars */}
                                  {[...Array(emptyStars)].map((_, i) => (
                                    <svg
                                      key={`empty-${i}`}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      stroke="#fbc02d"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4"
                                    >
                                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.906 1.464 8.307L12 18.896l-7.4 3.623 1.464-8.307-6.064-5.906 8.332-1.151z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>

                              <Button className="mt-4 w-full dark:bg-orange-500 dark:hover:bg-orange-700">
                                View Details
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </Carousel>
                )}
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => navigate("/class")}
                    className={`dark:bg-orange-500 dark:hover:bg-orange-600 ${
                      classes.filter(
                        (course) =>
                          course.status === "PENDING" ||
                          course.status === "ACTIVE"
                      ).length <= 2
                        ? "w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                        : "w-full px-6 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded"
                    }`}
                  >
                    View All
                  </Button>
                </div>
              </div>
            </section>
          )}

        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800">
          <div className="container px-4 md:px-8 lg:px-12 mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-center mb-12 text-zinc-800 dark:text-zinc-100">
              What Our Students Say
            </h2>
            {loadingc ? (
              <div className="flex justify-center">
                <Loader className="w-10 h-10 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {comments
                  .filter(
                    (_, index) => index === 1 || index === 7 || index === 13
                  )
                  .map((testimonial, index) => (
                    <Card
                      key={index}
                      className="transition-transform transform hover:scale-105 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-lg shadow-lg hover:shadow-xl p-8 relative border border-gray-200 dark:border-zinc-700"
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center rounded-full shadow-md">
                        <span className="text-xl font-bold uppercase">
                          {testimonial.username[0]}
                        </span>
                      </div>
                      <CardHeader className="mt-6 text-center">
                        <CardTitle className="text-xl font-semibold tracking-wide">
                          {testimonial.username}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="relative text-zinc-500 dark:text-zinc-400 italic text-lg leading-relaxed before:content-['“'] before:text-4xl before:font-bold before:absolute before:-top-2 before:-left-6 before:text-blue-500 after:content-['”'] after:text-4xl after:font-bold after:absolute after:-bottom-2 after:-right-6 after:text-purple-500 transition-transform duration-300 hover:scale-105">
                          {testimonial.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Ready to Start Learning?
                </h2>
                <p className="mx-auto max-w-[600px] text-white md:text-xl">
                  Join thousands of students and start your learning journey
                  today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={() => navigate("/signup")}
                  className="rounded-lg text-center dark:bg-orange-500 dark:hover:bg-orange-700 shadow-md bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
