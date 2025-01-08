import { useEffect, useState, useRef } from "react";
import {
  createDocument,
  fetchAllCategories,
  fetchCreateCourse,
  fetchDeleteCourse,
  fetchUpdateCourse,
  getDocumentsByCourseCode,
  updateDocument,
} from "@/data/api";
import { toast } from "react-hot-toast";
import {
  AlertTriangle,
  AlignLeft,
  BookOpen,
  Check,
  ChevronDown,
  Edit2,
  Edit3,
  FileText,
  FolderOpen,
  Hash,
  Image,
  Loader,
  PlusCircle,
  Save,
  Search,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [EditmodalOpen, setEditModalOpen] = useState(false); // State for modal visibility
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); // State for image modal
  const [selectedImage, setSelectedImage] = useState(null); // State for selected course image
  const token = sessionStorage.getItem("token");
  const [status, setStatus] = useState("Create Course");
  const [isCourseCreated, setIsCourseCreated] = useState(false); // Track if course was created
  const [file, setFile] = useState(null); // Document file to upload
  const [selectedItem, setSelectedItem] = useState(null);

  const [documentData, setDocumentData] = useState({
    title: "", // Name of the document
    content: "", // Description of the document
    // You can add other fields here if your form has more fields
  });
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);

  const modalRef = useRef(); // Create a ref for the modal
  const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" }); // State for modal size

  const handleEditClick = async (courseCode) => {
    if (!courseCode) {
      alert("Course code is missing. Cannot fetch documents.");
      return;
    }

    try {
      const documents = await getDocumentsByCourseCode(courseCode, token);

      if (!documents || documents.length === 0) {
        // If no documents exist, set up an empty template for creating a new document
        setSelectedItem({
          title: "", // Default empty fields
          content: "",
        });
      } else {
        // If documents exist, select the first document
        setSelectedItem(documents[0]);
      }

      setEditModalOpen(true); // Open the modal
      setIsFormVisible(false); // Hide the form if needed
    } catch (error) {
      // Handle errors (e.g., network issues, API failures)
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents. Please try again later.");
    }
  };

  useEffect(() => {
    if (isDocumentVisible) {
      setDocumentData({ title: "", content: "" });
    }
  }, [isDocumentVisible]);
  const handleChange = (e) => {
    setCourseDTO({
      ...courseDTO,
      [e.target.name]: e.target.value,
    });
  };
  const handleDocChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChangeDoc = (e) => {
    const { name, value } = e.target;
    setDocumentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true); // Set loading state
      // Call the updateDocument API
      const updatedDocument = await updateDocument(
        selectedItem.id,
        formData,
        formData.file,
        token
      );
      console.log("Document updated:", updatedDocument);
      toast.success("Document updated successfully"); // Show success message
      setEditModalOpen(false); // Close the modal
    } catch (err) {
      toast.error("Error updating document");
      console.error("Error updating document:", err);
    } finally {
      setLoading(false); // Reset loading
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file, // Store selected file
    });
  };
  useEffect(() => {
    const fetchCate = async () => {
      try {
        const data = await fetchAllCategories();
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
  };
  const [showConfirm, setShowConfirm] = useState(false);

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

    // Disable the button for 2 seconds

    try {
      const response = await fetchCreateCourse(courseDTO, image, token);

      let courseData = response;
      if (typeof response === "string" && response.includes("{")) {
        const jsonString = response.substring(response.indexOf("{"));
        courseData = JSON.parse(jsonString);
      }
      toast.success("Done partially! Please create a document for the course.");
      setCourses((prevCourses) => [...prevCourses, courseData]);
      setStatus("Creating Document...");
      setIsFormVisible(false);
      setDocumentData({
        title: "", // Name of the document
        content: "",
      });
      setIsDocumentVisible(true); // Show the document form
      setIsCourseCreated(true);
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Failed to create course.");
    } finally {
      // Ensure that loading state is cleared after 2 seconds
      setIsLoading(false);
    }
  };
  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setIsLoadingDocument(true);
    const documentDTO = {
      title: documentData.title, // Make sure the name matches your documentDTO properties
      content: documentData.content, // Example field, use what you have
      // Add any other fields that are part of your DocumentDTO here
    };
    try {
      // Now, create the document for the course
      await createDocument(documentDTO, file, token); // Call the createDocument API
      toast.success("Course created successfully!");
      setIsDocumentVisible(false); // Hide the document form
      setIsCourseCreated(false);
      setDocumentData({
        title: "", // Reset the form fields
        content: "",
      });
    } catch (error) {
      toast.error("Error creating document");
      console.error(error);
    } finally {
      setIsLoadingDocument(false);
      setStatus("Completed"); // Update status when the operation is complete
    }
  };
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || "",
        content: selectedItem.content || "",
        file: selectedItem.filePath || null, // Set the initial file (filePath) when editing
      });
    }
  }, [selectedItem]);
  const handleUpdateCourse = (courseCode) => {
    const courseToEdit = courses.find(
      (course) => course.courseCode === courseCode
    );
    setCourseDTO(courseToEdit);
    setImage(courseToEdit.image);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleSaveUpdateCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Disable the button for 2 seconds

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
      // Ensure that loading state is cleared after 2 seconds
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
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };
  const closeDocumentModal = () => {
    setIsDocumentVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      setIsLoading(true);
      try {
        await fetchDeleteCourse(courseToDelete.courseCode, token);
        const updatedCourses = courses.filter(
          (course) => course.courseCode !== courseToDelete.courseCode
        );
        setCourses(updatedCourses);
        toast.success("Course deleted successfully");

        const totalPages = Math.ceil(updatedCourses.length / itemsPerPage);
        if (currentPage > totalPages) {
          onDelete();
        }
      } catch (error) {
        console.error("Failed to delete course:", error);
        toast.error("Failed to delete course.");
      } finally {
        setIsLoading(false);
        setShowDeleteModal(false);
      }
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
            setStatus("Creating Course...");
            setCourseDTO({
              courseCode: "",
              name: "",
              description: "",
              categoryId: 1,
            });
            setImage(null); // Reset image
          }}
        >
          Add Course
        </button>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-center mb-4">
              <Trash2 size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirm Deletion
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to delete this course?
              <br />
              <span className="font-semibold">{courseToDelete?.name}</span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isCourseCreated && isDocumentVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto shadow-lg rounded-lg p-6 w-full max-w-2xl">
            {!isEditing && (isFormVisible || isDocumentVisible) && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
                  <div
                    className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-md transition-colors duration-300 ${
                      status === "Creating Course..."
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Edit3 size={20} />
                    <span className="text-sm font-medium">Create Course</span>
                  </div>
                  <div
                    className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-md transition-colors duration-300 ${
                      status === "Creating Document..."
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FileText size={20} />
                    <span className="text-sm font-medium">Create Document</span>
                  </div>
                </div>
              </div>
            )}
            <form
              onSubmit={handleCreateDocument}
              className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Create Document for Course
              </h2>

              {/* Document Form Fields */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <div className="relative">
                    <Type
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={documentData.title}
                      onChange={handleChangeDoc}
                      placeholder="Enter Document Title"
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <div className="relative">
                    <AlignLeft
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <textarea
                      name="content"
                      id="content"
                      value={documentData.content}
                      onChange={handleChangeDoc}
                      placeholder="Enter Document Content"
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="document"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Document
                  </label>
                  <div className="relative">
                    <Upload
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="file"
                      id="document"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 flex items-center"
                  onClick={() => setShowConfirm(true)}
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 flex items-center ${
                    isLoadingDocument ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoadingDocument}
                >
                  {isLoadingDocument ? (
                    <>
                      <FileText size={18} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      Create Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            {/* Status bar logic */}
            {!isEditing && (isFormVisible || isDocumentVisible) && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
                  <div
                    className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-md transition-colors duration-300 ${
                      status === "Creating Course..."
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Edit3 size={20} />
                    <span className="text-sm font-medium">Create Course</span>
                  </div>
                  <div
                    className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-md transition-colors duration-300 ${
                      status === "Creating Document..."
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FileText size={20} />
                    <span className="text-sm font-medium">Create Document</span>
                  </div>
                </div>
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              {isEditing ? "Edit Course" : "Create New Course"}
            </h2>

            <form
              onSubmit={isEditing ? handleSaveUpdateCourse : handleCreateCourse}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="courseCode"
                  >
                    Course Code
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Hash size={18} />
                    </span>
                    <input
                      type="text"
                      name="courseCode"
                      id="courseCode"
                      value={courseDTO.courseCode}
                      onChange={handleChange}
                      placeholder="Enter Course Code"
                      className="pl-10 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <BookOpen size={18} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={courseDTO.name}
                      onChange={handleChange}
                      placeholder="Enter Course Name"
                      className="pl-10 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-gray-500">
                      <AlignLeft size={18} />
                    </span>
                    <textarea
                      name="description"
                      id="description"
                      value={courseDTO.description}
                      onChange={handleChange}
                      placeholder="Enter Course Description"
                      className="pl-10 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="categoryId"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FolderOpen size={18} />
                    </span>
                    <select
                      name="categoryId"
                      id="categoryId"
                      value={courseDTO.categoryId}
                      onChange={handleChange}
                      className="pl-10 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      <ChevronDown size={18} />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="image"
                  >
                    Course Image
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Image size={18} />
                    </span>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      className="pl-10 border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200 flex items-center"
                  onClick={() => setIsFormVisible(false)}
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-200 flex items-center"
                    onClick={() => handleEditClick(courseDTO.courseCode)}
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Document
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save size={18} className="mr-2" />
                      Update Course
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} className="mr-2" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {EditmodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20 p-4">
          <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Document
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Title Field */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <div className="relative">
                <Type
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleDocChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Content Field */}
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <div className="relative">
                <AlignLeft
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleDocChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                />
              </div>
            </div>

            {/* File Preview */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Preview
              </label>
              <div className="mt-2 border border-gray-200 rounded-md p-4 bg-gray-50">
                {formData.file ? (
                  typeof formData.file === "string" ? (
                    // Handle file path string (current file)
                    formData.file.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex items-center justify-center">
                        <FileText size={48} className="text-red-500" />
                        <span className="ml-2 text-sm text-gray-600">
                          PDF Document
                        </span>
                      </div>
                    ) : formData.file.toLowerCase().endsWith(".docx") ||
                      formData.file.toLowerCase().endsWith(".doc") ? (
                      <div className="flex items-center justify-center">
                        <FileText size={48} className="text-blue-500" />
                        <span className="ml-2 text-sm text-gray-600">
                          Word Document
                        </span>
                      </div>
                    ) : formData.file.toLowerCase().endsWith(".jpg") ||
                      formData.file.toLowerCase().endsWith(".jpeg") ||
                      formData.file.toLowerCase().endsWith(".png") ? (
                      <img
                        src={formData.file}
                        alt="File Preview"
                        className="w-full h-auto max-h-32 object-contain mx-auto"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <FileText size={48} className="text-gray-400" />
                        <span className="ml-2 text-sm text-gray-600">
                          Unsupported File Type
                        </span>
                      </div>
                    )
                  ) : // Handle File object (newly selected file)
                  formData.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="File Preview"
                      className="w-full h-auto max-h-32 object-contain mx-auto"
                    />
                  ) : formData.file.type === "application/pdf" ? (
                    <div className="flex items-center justify-center">
                      <FileText size={48} className="text-red-500" />
                      <span className="ml-2 text-sm text-gray-600">
                        PDF Document
                      </span>
                    </div>
                  ) : formData.file.type === "application/msword" ||
                    formData.file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                    <div className="flex items-center justify-center">
                      <FileText size={48} className="text-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">
                        Word Document
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FileText size={48} className="text-gray-400" />
                      <span className="ml-2 text-sm text-gray-600">
                        Unsupported File Type
                      </span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload size={48} className="text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">
                      No file selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File
              </label>
              <div className="relative">
                <Upload
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Course Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((course, index) => (
                <tr
                  key={course.courseId}
                  className="hover:bg-gray-100 transition duration-200 cursor-pointer"
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
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {categories.find(
                      (cat) => cat.categoryId === course.categoryId
                    )?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    {course.courseCode}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    title={course.name}
                  >
                    {course.name.length > 17
                      ? `${course.name.slice(0, 17)}...`
                      : course.name}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    title={course.description}
                  >
                    {course.description.length > 17
                      ? `${course.description.slice(0, 17)}...`
                      : course.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                      onClick={() => handleUpdateCourse(course.courseCode)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                      onClick={() => handleDeleteClick(course)}
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
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 rounded-full p-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Confirm Exit
              </h2>
              <p className="text-gray-600">
                Are you sure you want to exit? Your course-creating progress
                will be lost and you will need to start over.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                onClick={() => setShowConfirm(false)}
              >
                Stay Here
              </button>
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
                onClick={closeDocumentModal}
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
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
