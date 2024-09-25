import { CheckCircle, Star, Users } from "lucide-react";
import webDevelopmentImage from "../assets/bootcamp.jfif";
import data from "../assets/data.png";
import market from "../assets/market.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

export function CourseLandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-zinc-900 dark:bg-zinc-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Unlock Your Potential with EduCourse
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Discover expert-led online courses to boost your skills and
                advance your career.
              </p>
            </div>
            <div className="space-x-4">
              <Button variant="secondary" onClick={() => navigate("/courses")}>
                Browse Courses
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Why Choose EduCourse?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CheckCircle className="w-8 h-8 mb-2 text-zinc-900 dark:text-zinc-50" />
                <CardTitle>Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                Learn from industry professionals with years of experience.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 mb-2 text-zinc-900 dark:text-zinc-50" />
                <CardTitle>Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                Engage with peers and instructors through forums and live
                sessions.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Star className="w-8 h-8 mb-2 text-zinc-900 dark:text-zinc-50" />
                <CardTitle>Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                Learn at your own pace with lifetime access to course materials.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Featured Courses
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Web Development Bootcamp",
                price: "$99",
                image: webDevelopmentImage,
              },
              {
                title: "Data Science Fundamentals",
                price: "$129",
                image: data,
              },
              {
                title: "Digital Marketing Mastery",
                price: "$79",
                image: market,
              },
            ].map((course, index) => (
              <Card key={index}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[200px] object-cover"
                />
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{course.price}</p>
                  <Button className="mt-4 w-full">Enroll Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
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
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{testimonial.name}</CardTitle>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                Join thousands of students and start your learning journey
                today.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1 bg-white"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit" variant="secondary">
                  Get Started
                </Button>
              </form>
              <p className="text-xs text-gray-200">
                By signing up, you agree to our{""}
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
