import { useEffect, useState, useRef } from "react";
import {
  fetchAllCategories,
  fetchCreateCourse,
  fetchDeleteCourse,
  fetchUpdateCourse,
} from "@/data/api";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

export default function CourseLayout({
  currentPage,
  itemsPerPage,
  courses,
  setCourses,
  searchQuery,
  setSearchQuery,
  onDelete, // Receive the reset function
}) {
  const [courseDTO, setCourseDTO] = useState({
    courseCode: "",
    name: "",
    description: "",
    categoryId: 1,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [categories, setCategories] = useState([]);
  const [, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); // State for image modal
  const [selectedImage, setSelectedImage] = useState(null); // State for selected course image
  const token = sessionStorage.getItem("token");

  const modalRef = useRef(); // Create a ref for the modal
  const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" }); // State for modal size

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
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCate();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview
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
    setImagePreview(courseToEdit.image); // Set image preview for editing
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

      let courseData;
      if (typeof response === "string") {
        const jsonStartIndex = response.indexOf("{");
        if (jsonStartIndex !== -1) {
          const jsonString = response.substring(jsonStartIndex);
          courseData = JSON.parse(jsonString);
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        courseData = response;
      }

      toast.success("Course updated successfully!");

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
      await fetchDeleteCourse(courseCode, token); // Assuming you have a delete function
      const updatedCourses = courses.filter(
        (course) => course.courseCode !== courseCode
      );
      setCourses(updatedCourses);
      toast.success("Course deleted successfully");

      // Check if the current page is now empty
      const totalPages = Math.ceil(updatedCourses.length / itemsPerPage);
      if (currentPage > totalPages) {
        onDelete(); // Call the reset function to navigate to page 1
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCloseModal = (e) => {
    // Check if the click is outside the modal
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowImageModal(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the modal
    document.addEventListener("mousedown", handleCloseModal);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);

  const handleImageClick = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Set modal size based on image dimensions
      const aspectRatio = img.width / img.height;
      const maxWidth = window.innerWidth * 0.8; // 80% of the viewport width
      const maxHeight = window.innerHeight * 0.8; // 80% of the viewport height

      if (aspectRatio > 1) {
        // Landscape
        setModalSize({
          width: Math.min(maxWidth, img.width),
          height: "auto",
        });
      } else {
        // Portrait or square
        setModalSize({
          width: "auto",
          height: Math.min(maxHeight, img.height),
        });
      }
    };

    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex items-center border rounded p-2"
          style={{ width: "330px" }}
        >
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search Courses by Code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
        <button
          className="mr-10 px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setIsEditing(false);
            setCourseDTO({
              courseCode: "",
              name: "",
              description: "",
              categoryId: 1,
            });
            setImage(null); // Reset image
            setImagePreview(null); // Reset image preview
          }}
        >
          Add Course
        </button>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={isEditing ? handleSaveUpdateCourse : handleCreateCourse}
            className="bg-white shadow-lg rounded-lg p-6 w-1/2 max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isEditing ? "Edit Course" : "Create New Course"}
            </h2>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
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
              <div className="w-full md:w-1/2 px-2 mb-4">
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
              <div className="w-full md:w-1/2 px-2 mb-4">
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
                  rows="3"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
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
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full px-2 mb-4">
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
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
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
        <table className="min-w-full divide-y divide-gray-200">
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
            {currentData.length > 0 ? (
              currentData.map((course, index) => (
                <tr
                  key={course.courseId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-10 h-10 object-cover cursor-pointer"
                      onClick={() => handleImageClick(course.image)}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-red-500 font-semibold"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef} // Attach the ref to the modal
            className="bg-white p-0 rounded-md" // Remove padding to eliminate whitespace
            style={{ width: modalSize.width, height: modalSize.height }} // Set dynamic size
          >
            <img
              src={selectedImage}
              alt="Selected Course"
              className="max-w-full max-h-full object-contain" // Scale image to fit within the modal
            />
          </div>
        </div>
      )}
    </div>
  );
}
