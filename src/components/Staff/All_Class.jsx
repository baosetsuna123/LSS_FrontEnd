import {
  Book,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  EllipsisVertical,
  Eye,
  FileText,
  ImageIcon,
  Info,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import toast from "react-hot-toast";
import { fetchUpdateClass } from "@/data/api";
import defaults from "../../assets/default.jfif";

const All_Class = ({
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  lessons,
  setLessons,
  resetCurrentPage,
}) => {
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [EditmodalOpen, setEditModalOpen] = useState(false); // State for modal visibility
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleCreateClassForm = () => {
    setShowCreateClassForm(!showCreateClassForm);
  };
  console.log(lessons);
  // Calculate the current data to display based on pagination and search query
  const filteredClass = lessons.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredClass.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [classShow, setClassShow] = useState(null);

  const handleButtonClick = (index) => {
    // Toggle dialog for the specific row
    setDialogOpen(dialogOpen === index ? null : index);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    resetCurrentPage();
  };
  const token = sessionStorage.getItem("token");
  const handleDetailsClick = async (item) => {
    try {
      const data = lessons.find((c) => c.classId === item.classId);
      setSelectedItem(data); // Set the fetched data to display in the modal
      setModalOpen(true); // Open the modal
    } catch (error) {
      toast.error("Failed to fetch document details"); // Set error message
      console.error("Failed to fetch document details:", error); // Log the error
    }
  };
  const closeModal = () => {
    setModalOpen(false); // Close the modal
  };
  const [initialMaxStudents, setInitialMaxStudents] = useState(null);

  const handleEditClick = (item) => {
    setClassShow(item);
    setSelectedItem(item); // Set the selected item

    setInitialMaxStudents(item.maxStudents);
    setEditModalOpen(true); // Open the modal
  };
  const [maxStudentsError, setMaxStudentsError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the state for all fields
    setSelectedItem((prev) => ({ ...prev, [name]: value }));
    if (name === "price") {
      const newPrice = Number(value);
      setSelectedItem((prev) => ({ ...prev, price: newPrice }));
    }
    if (name === "maxStudents") {
      const newMaxStudents = Number(value);

      if (newMaxStudents && newMaxStudents < initialMaxStudents) {
        setMaxStudentsError(
          "Max Students cannot be less than the current number of students"
        );
      } else {
        setMaxStudentsError(""); // Clear error when the value is valid
      }
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const handleCloseModal = () => {
    setEditModalOpen(false); // Close the modal
    setSelectedItem(null); // Clear selected item
  };
  const [loading, setLoading] = useState(false); // State for loading button
  const handleUpdate = async (updatedClass) => {
    if (updatedClass.price < 100000 || updatedClass.price > 500000) {
      toast.error("Price must be between 100,000 and 500,000");
      return; // Exit early if price is invalid
    }

    // If there's a maxStudents error, show the toast and return
    if (maxStudentsError) {
      toast.error(maxStudentsError);
      return;
    }
    if (updatedClass.maxStudents > 10) {
      toast.error("Max students must be less than or equal to 10");
      return; // Exit early if maxStudents is less than 10
    }
    if (updatedClass.maxStudents < classShow.maxStudents) {
      toast.error(
        `Max students cannot be less than the current number of students (${classShow.maxStudents})`
      );
      return; // Exit early if maxStudents is invalid
    }
    console.log(updatedClass, classShow);
    try {
      setLoading(true);

      // Call the updateDocument API
      const updatedClassData = await fetchUpdateClass({
        data: { ...updatedClass },
        token,
      });
      toast.success("Document updated successfully"); // Show success message
      setLessons((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.classId === selectedItem.classId
            ? { ...doc, ...updatedClassData }
            : doc
        )
      );
      handleCloseModal(); // Close the modal after successful update
    } catch (err) {
      toast.error("Error updating document");
      console.error("Error updating document:", err);
    } finally {
      setLoading(false); // Reset loading
    }
  };

  const handleCancel = () => {
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Search Box */}
        <div
          className="flex items-center border rounded p-2"
          style={{ width: "330px" }}
        >
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search Classes by Name"
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
        <button
          className="mr-10 px-4 py-2 bg-blue-500 text-white rounded-md ml-4 flex items-center"
          onClick={toggleCreateClassForm}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Class
        </button>
      </div>
      {showCreateClassForm && (
        <CreateClassForm
          toggleCreateClassForm={toggleCreateClassForm}
          setLessons={setLessons}
          setShowCreateClassForm={setShowCreateClassForm}
        />
      )}
      {EditmodalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-h-[80vh] overflow-y-auto dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-3xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Edit Class Information
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class Name Field */}
              <div className="col-span-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Class Name
                </label>
                <div className="relative">
                  <Book
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="name"
                    name="name"
                    value={selectedItem.name}
                    onChange={handleInputChange}
                    disabled
                    className="pl-10 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:text-white"
                  />
                </div>
              </div>

              {/* Course Field */}
              <div className="col-span-1">
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Course
                </label>
                <div className="relative">
                  <Book
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="course"
                    value={selectedItem.courseCode || ""}
                    onChange={handleInputChange}
                    disabled
                    className="pl-10 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:text-white"
                  />
                </div>
              </div>

              {/* Status Field */}
              <div className="col-span-1">
                <label
                  htmlFor="course-status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <div className="relative">
                  <Info
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <span
                    className={`pl-10 inline-block w-full py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 font-semibold
                ${selectedItem?.status === "PENDING" ? "text-yellow-500" : ""}
                ${selectedItem?.status === "COMPLETED" ? "text-green-500" : ""}
                ${selectedItem?.status === "ACTIVE" ? "text-blue-500" : ""}
                ${selectedItem?.status === "ONGOING" ? "text-orange-500" : ""}
                ${selectedItem?.status === "CANCELED" ? "text-red-500" : ""}

              `}
                  >
                    {selectedItem?.status}
                  </span>
                </div>
              </div>

              {/* Max Students Field */}
              <div className="col-span-1">
                <label
                  htmlFor="maxStudents"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Number of Students
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="maxStudents"
                    name="maxStudents"
                    value={selectedItem.maxStudents}
                    onChange={handleInputChange}
                    placeholder={`Current number of students is ${selectedItem.maxStudents}`}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                {maxStudentsError && (
                  <p className="text-red-500 mt-1 text-sm">
                    {maxStudentsError}
                  </p>
                )}
              </div>

              {/* Price Field */}
              <div className="col-span-1">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={selectedItem.price}
                    onChange={handleInputChange}
                    min="100000"
                    max="500000"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">
                  {formatCurrency(selectedItem.price)}
                </span>
              </div>

              {/* Description Field */}
              <div className="col-span-2" title={selectedItem.description}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <div className="relative">
                  <Info
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    id="description"
                    name="description"
                    value={selectedItem.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Date Slots Table */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Class Schedule
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Slot
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem?.dateSlots?.map((slot, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        }
                      >
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                          <Calendar className="inline-block mr-2" size={16} />
                          {slot.date}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                          {slot.slotIds
                            .sort((a, b) => a - b)
                            .map((slotId) => {
                              const timeRanges = {
                                1: "7h00 - 9h15",
                                2: "9h30 - 11h45",
                                3: "12h30 - 14h45",
                                4: "15h00 - 17h15",
                                5: "17h45 - 20h00",
                              };
                              return (
                                <div
                                  key={slotId}
                                  className="flex items-center mb-1 last:mb-0"
                                >
                                  <Clock className="mr-2" size={16} />
                                  <span>
                                    Slot {slotId} (
                                    {timeRanges[slotId] || "No time available"})
                                  </span>
                                </div>
                              );
                            })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors flex items-center"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(selectedItem)}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white max-h-[80vh] overflow-y-auto dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Class Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Book className="text-gray-400" size={20} />
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </strong>
                  <span className="text-gray-800 dark:text-white">
                    {selectedItem?.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="text-gray-400" size={20} />
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Max Students
                  </strong>
                  <span className="text-gray-800 dark:text-white">
                    {selectedItem?.maxStudents}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="text-gray-400" size={20} />
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </strong>
                  <span className="text-gray-800 dark:text-white">
                    {selectedItem?.price.toLocaleString()} VND
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Book className="text-gray-400" size={20} />
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Course Code
                  </strong>
                  <span className="text-gray-800 dark:text-white">
                    {selectedItem?.courseCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="text-gray-400" size={20} />
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Description
                  </strong>
                  <span
                    className="text-gray-800 dark:text-white"
                    title={selectedItem.description}
                  >
                    {selectedItem?.description
                      ? selectedItem.description.length > 30
                        ? `${selectedItem.description.slice(0, 30)}...`
                        : selectedItem.description
                      : "No description"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 4a1 1 0 011 1v4.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V5a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </strong>
                  <span
                    className={`font-semibold
              ${selectedItem?.status === "PENDING" ? "text-yellow-500" : ""}
              ${selectedItem?.status === "COMPLETED" ? "text-green-500" : ""}
              ${selectedItem?.status === "ACTIVE" ? "text-blue-500" : ""}
              ${selectedItem?.status === "ONGOING" ? "text-orange-500" : ""}
              ${selectedItem?.status === "CANCELED" ? "text-red-500" : ""}
            `}
                  >
                    {selectedItem?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
                <Calendar className="mr-2 text-gray-400" size={20} />
                Class Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Slot
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {selectedItem?.dateSlots?.map((slot, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                        }
                      >
                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                          {slot.date}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300">
                          {slot.slotIds
                            .sort((a, b) => a - b)
                            .map((slotId) => {
                              const timeRanges = {
                                1: "7h00 - 9h15",
                                2: "9h30 - 11h45",
                                3: "12h30 - 14h45",
                                4: "15h00 - 17h15",
                                5: "17h45 - 20h00",
                              };
                              return (
                                <div
                                  key={slotId}
                                  className="flex items-center justify-center text-center mb-1 last:mb-0"
                                >
                                  <Clock
                                    className="mr-2 text-gray-400 text-center"
                                    size={16}
                                  />
                                  <span>
                                    Slot {slotId} (
                                    {timeRanges[slotId] || "No time available"})
                                  </span>
                                </div>
                              );
                            })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center items-center mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center justify-center">
                  <ImageIcon className="mr-2 text-gray-400" size={20} />
                  Class Image
                </h3>
                <img
                  src={selectedItem?.imageUrl || defaults}
                  alt={selectedItem?.name || "Default Image"}
                  className="max-w-[100px] h-auto rounded-lg shadow-md"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg transition duration-200 hover:bg-red-600 hover:text-white flex items-center"
              >
                <X size={20} className="mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                MaxStudents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                CourseCode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((app, index) => (
                <tr
                  key={app.applicationUserId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.maxStudents || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(app.price) || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.courseCode || "N/A"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    title={app.description}
                  >
                    {app.description && app.description.length > 10
                      ? `${app.description.slice(0, 10)}...`
                      : app.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button
                      onClick={() => handleButtonClick(index)}
                      className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      <EllipsisVertical />
                    </button>
                    {dialogOpen === index && (
                      <div className="absolute bottom-full mb-1 left-0 bg-white p-1 shadow-lg rounded-md w-auto z-10 flex space-x-4">
                        <div
                          className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-green-500"
                          onClick={() => handleEditClick(app)}
                        >
                          <Edit size={16} />
                        </div>
                        <div
                          className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-gray-500"
                          onClick={() => handleDetailsClick(app)}
                        >
                          <Eye size={16} />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default All_Class;
