/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Users, UserPlus, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Collaborate from "../../assets/collaborator.jpg";
export function AboutMe() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to EduCourse
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Empowering education through seamless class creation and registration
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            At EduCourse, we believe in the power of education to transform
            lives. Our platform bridges the gap between teachers and students,
            making it easier than ever to create, discover, and join classes
            that inspire growth and learning.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Learn More <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <img
            src={Collaborate}
            alt="Students collaborating"
            className="rounded-lg shadow-lg w-[600px] h-[300px]" // This sets the width and height to 18rem, which is 288px
          />
          <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg">
            <p className="font-semibold">
              Join our community of learners today!
            </p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <Card>
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle>Create Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Teachers can easily create and manage classes, set schedules, and
              share resources.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <CardTitle>Discover Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Students can explore a wide range of courses and find the perfect
              fit for their learning goals.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-purple-600 mb-4" />
            <CardTitle>Easy Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Streamlined registration process allows students to quickly enroll
              in their chosen classes.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <Laptop className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <CardTitle>Virtual Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              Access course materials, participate in discussions, and attend
              online sessions seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-gray-100 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Why Choose EduCourse?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              User-Friendly Interface
            </h3>
            <p className="text-gray-600 text-center">
              Intuitive design for both teachers and students
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Real-Time Interaction
            </h3>
            <p className="text-gray-600 text-center">
              Engage in live discussions and collaborative learning
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <svg
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 002 2h10a2 002-2V7a2 00-2-2h-2M9 5a2 2h2a2 002-2M9 012-2h2a2 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Progress Tracking
            </h3>
            <p className="text-gray-600 text-center">
              Monitor your learning journey with detailed analytics
            </p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join EduCourse today and unlock a world of learning opportunities.
          Whether you're a teacher looking to share your knowledge or a student
          eager to learn, we're here to support your educational journey.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              navigate("/signup", { state: { userType: "teacher" } })
            }
          >
            Sign Up as Teacher
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() =>
              navigate("/signup", { state: { userType: "student" } })
            }
          >
            Register as Student
          </Button>
        </div>
      </div>
    </div>
  );
}
