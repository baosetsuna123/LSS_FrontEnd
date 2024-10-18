/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import misasa from "../../assets/misasa.jfif";
import {
  Book,
  GraduationCap,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import profile from "../../assets/profilebg.jfif";
export default function Profile() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const result = localStorage.getItem("result");
  const projects = [
    {
      title: "Machine Learning Image Classifier",
      description:
        "Developed a CNN-based image classifier using TensorFlow and Keras.",
      technologies: ["Python", "TensorFlow", "Keras"],
      link: "#",
    },
    {
      title: "E-commerce Web Application",
      description:
        "Built a full-stack e-commerce platform with React and Node.js.",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "#",
    },
    {
      title: "Mobile Fitness Tracker",
      description:
        "Created a React Native app for tracking workouts and nutrition.",
      technologies: ["React Native", "Firebase", "Redux"],
      link: "#",
    },
  ];

  const nextProject = () => {
    setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 sm:h-48"></div>
        <CardContent className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-end sm:space-x-5">
            <div className="flex -mt-16 sm:-mt-24">
              <img
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white object-cover"
                src={misasa}
                alt="Student Profile"
              />
            </div>
            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {result ? JSON.parse(result).username : "Misasa"}
                </h1>
                <p className="text-sm text-gray-500">
                  Software Engineer | Class of 2024
                </p>
                <p className="text-sm text-gray-500">
                  Email: {result ? JSON.parse(result).email : null}
                </p>
                <p className="text-sm text-gray-500">
                  FullName: {result ? JSON.parse(result).fullName : "Misasa"}
                </p>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button>
                  <Book className="mr-2 h-4 w-4" />
                  View Portfolio
                </Button>
                <Button variant="outline">Contact</Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About Me
            </h2>
            <p className="text-gray-700 mb-4">
              I'm a passionate Computer Science student with a focus on machine
              learning and web development. I love tackling complex problems and
              building innovative solutions. Currently seeking internship
              opportunities to apply my skills in a real-world setting.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>Python</Badge>
              <Badge>JavaScript</Badge>
              <Badge>React</Badge>
              <Badge>Node.js</Badge>
              <Badge>TensorFlow</Badge>
              <Badge>SQL</Badge>
              <Badge>Git</Badge>
              <Badge>Agile Methodologies</Badge>
              <Badge>Data Structures</Badge>
              <Badge>Algorithms</Badge>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Education
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">BSc in Computer Science</p>
                  <p className="text-sm text-gray-500">
                    Tech University, 2020 - 2024
                  </p>
                </div>
              </li>
            </ul>
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
              Achievements
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-700">Dean's List (2021, 2022)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-700">Hackathon Winner (2023)</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Current Courses</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700">
                  Advanced Algorithms
                </span>
                <span className="text-sm font-medium text-blue-700">70%</span>
              </div>
              <Progress value={70} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700">
                  Machine Learning
                </span>
                <span className="text-sm font-medium text-blue-700">85%</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700">
                  Web Development
                </span>
                <span className="text-sm font-medium text-blue-700">90%</span>
              </div>
              <Progress value={90} className="w-full" />
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Featured Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {projects[currentProjectIndex].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {projects[currentProjectIndex].description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {projects[currentProjectIndex].technologies.map(
                      (tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                  <Button asChild>
                    <a href={projects[currentProjectIndex].link}>
                      View Project
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2">
              <Button size="icon" variant="ghost" onClick={prevProject}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2">
              <Button size="icon" variant="ghost" onClick={nextProject}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium">Software Development Intern</p>
                <p className="text-sm text-gray-500">
                  TechCorp Inc., Summer 2023
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Worked on developing new features for the company's main web
                  application using React and Node.js.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium">Research Assistant</p>
                <p className="text-sm text-gray-500">
                  AI Lab, Tech University, Fall 2022 - Present
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Assisting in research on natural language processing and
                  contributing to open-source machine learning projects.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
