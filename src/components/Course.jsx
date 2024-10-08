import { useEffect, useState } from "react";
import {
  fetchAllCategories,
  fetchCreateCourse,
  fetchDeleteCourse,
  fetchUpdateCourse,
} from "@/data/api";
import { toast } from "react-hot-toast";

export default function CourseLayout({
  currentPage,
  itemsPerPage,
  courses,
  setCourses,
}) {
  const [courseDTO, setCourseDTO] = useState({
    courseCode: "",
    name: "",
    description: "",
    categoryId: 1,
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for editing
  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    setCourseDTO({
      ...courseDTO,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const data = await fetchAllCategories(token);
        console.log("All categories: ", data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCate();
  }, [token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const existingCourse = courses.find(
      (course) => course.courseCode === courseDTO.courseCode
    );
    if (existingCourse) {
      toast.error("Course code already exists. Please choose a different one.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchCreateCourse(courseDTO, image, token);
      toast.success("Course created successfully!");
      let courseData = response;
      if (typeof response === "string" && response.includes("{")) {
        const jsonString = response.substring(response.indexOf("{"));
        courseData = JSON.parse(jsonString);
      }
      setCourses((prevCourses) => [...prevCourses, courseData]);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Failed to create course.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = (courseCode) => {
    const courseToEdit = courses.find(
      (course) => course.courseCode === courseCode
    );
    setCourseDTO(courseToEdit);

    setImage(courseToEdit.image);
    console.log("Course to edit: ", courseToEdit.image);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleSaveUpdateCourse = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetchUpdateCourse(
        courseDTO.courseCode,
        courseDTO,
        image,
        token
      );

      // Extracting JSON data from response string if needed
      let courseData;
      if (typeof response === "string") {
        // Assuming the response is in the format "Course updated successfully: <json>"
        const jsonStartIndex = response.indexOf("{"); // Find the starting index of the JSON part
        if (jsonStartIndex !== -1) {
          const jsonString = response.substring(jsonStartIndex); // Extract the JSON part
          courseData = JSON.parse(jsonString); // Parse it into a JavaScript object
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        courseData = response; // Use the response directly if it's already an object
      }

      // Display success message
      toast.success("Course updated successfully!");

      // Update the courses state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseCode === courseDTO.courseCode ? courseData : course
        )
      );

      setIsFormVisible(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error("Failed to update course.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseCode) => {
    setIsLoading(true);
    try {
      const response = await fetchDeleteCourse(courseCode, token);
      console.log("Course deleted: ", response);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseCode !== courseCode)
      );
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = Array.isArray(courses)
    ? courses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
        onClick={() => {
          setIsFormVisible(!isFormVisible);
          setIsEditing(false);
          setCourseDTO({
            courseCode: "",
            name: "",
            description: "",
            categoryId: 1,
          });
        }}
      >
        Add Course
      </button>
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={isEditing ? handleSaveUpdateCourse : handleCreateCourse}
            className="bg-white shadow-lg rounded-lg p-6 w-1/2 max-w-lg" // Increased width
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isEditing ? "Edit Course" : "Create New Course"}
            </h2>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="courseCode"
              >
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                id="courseCode"
                value={courseDTO.courseCode}
                onChange={handleChange}
                placeholder="Enter Course Code"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isEditing}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={courseDTO.name}
                onChange={handleChange}
                placeholder="Enter Course Name"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={courseDTO.description}
                onChange={handleChange}
                placeholder="Enter Course Description"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3" // Reduced height by limiting rows
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="categoryId"
              >
                Category
              </label>
              <select
                name="categoryId"
                id="categoryId"
                value={courseDTO.categoryId}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="image"
              >
                Course Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                {isEditing ? "Update Course" : "Create Course"}
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400 transition duration-200"
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((course, index) => (
              <tr key={course.courseId}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-10 h-10 object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {categories.find(
                    (cat) => cat.categoryId === course.categoryId
                  )?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.courseCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                    onClick={() => handleUpdateCourse(course.courseCode)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleDelete(course.courseCode)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
