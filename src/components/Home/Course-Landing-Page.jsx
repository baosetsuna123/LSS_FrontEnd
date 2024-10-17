import { CheckCircle, Loader, Star, Users } from "lucide-react";
import webDevelopmentImage from "../../assets/bootcamp.jfif";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useClassContext } from "@/context/ClassContext";

export function CourseLandingPage() {
  const navigate = useNavigate();
  const { classes, loading } = useClassContext();
  console.log(classes);
  const handleClassClick = (id) => {
    navigate(`/class/${id}`);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-zinc-900 dark:bg-zinc-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Unlock Your Potential with EduCourse
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Discover expert-led online courses to boost your skills and
                advance your career.
              </p>
            </div>
            <div className="space-x-4">
              <Button variant="secondary" onClick={() => navigate("/class")}>
                Browse Classes
              </Button>
              <Button
                variant="outline"
                className="bg-white text-zinc-900 hover:bg-gray-100 dark:text-zinc-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
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
                Learn at your own pace with lifetime access to course materials.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-8">
            Featured Classes
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center">
                <Loader className="w-10 h-10 animate-spin" />
              </div>
            ) : (
              classes.map((course, index) => (
                <Card
                  key={index}
                  onClick={() => handleClassClick(course.classId)}
                  className="transition-transform transform hover:scale-105"
                >
                  <img
                    src={course.image || webDevelopmentImage}
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
                    <Button className="mt-4 w-full">Enroll Now</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {/* Xem tất cả button */}
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

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
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
        <div className="container px-4 md:px-6">
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
    </>
  );
}
