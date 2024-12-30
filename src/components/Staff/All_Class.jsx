import { Edit, EllipsisVertical, Eye, Plus, Search } from "lucide-react";
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 flex items-center justify-center overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <h3 className="text-2xl text-center font-bold mb-4 text-gray-800 dark:text-white">
              Edit Class Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class Name Field */}
              <div className="col-span-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Class Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={selectedItem.name}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* Course Field */}
              <div className="col-span-1">
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Course
                </label>
                <input
                  name="course"
                  value={selectedItem.courseCode || ""}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* Status Field */}
              <div className="col-span-1">
                <label
                  htmlFor="course-status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <span
                  className={`font-semibold
          ${selectedItem?.status === "PENDING" ? "text-yellow-500" : ""}
          ${selectedItem?.status === "COMPLETED" ? "text-green-500" : ""}
          ${selectedItem?.status === "ACTIVE" ? "text-blue-500" : ""}
          ${selectedItem?.status === "ONGOING" ? "text-brown-500" : ""}
        `}
                >
                  {selectedItem?.status}
                </span>
              </div>

              {/* Max Students Field */}
              <div className="col-span-1">
                <label
                  htmlFor="maxStudents"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Number of Students
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={selectedItem.maxStudents}
                  onChange={handleInputChange}
                  placeholder={`Current number of students is ${selectedItem.maxStudents}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
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
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={selectedItem.price}
                  onChange={handleInputChange}
                  min="100000"
                  max="500000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-500 mt-1 block">
                  {formatCurrency(selectedItem.price)}
                </span>
              </div>
              <div className="col-span-1" title={selectedItem.description}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                {selectedItem?.description
                  ? selectedItem.description.length > 8
                    ? `${selectedItem.description.slice(0, 20)}...`
                    : selectedItem.description
                  : "No description"}
              </div>
            </div>

            <div className="col-span-12">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem?.dateSlots?.map((slot, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border text-center">
                        {slot.date}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {slot.slotIds
                          .sort((a, b) => a - b) // Sort slotIds in ascending order
                          .map((slotId) => {
                            // Define time ranges for each slotId
                            const timeRanges = {
                              1: "7h00 - 9h15",
                              2: "9h30 - 11h45",
                              3: "12h30 - 14h45",
                              4: "15h00 - 17h15",
                              5: "17h45 - 20h00",
                            };

                            return `Slot ${slotId} (${
                              timeRanges[slotId] || "No time available"
                            })`;
                          })
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between space-x-2 mt-6">
              <button
                onClick={() => handleUpdate(selectedItem)}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  handleCancel();
                }}
                className="px-4 py-2  bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-md w-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center pb-6 border-b">
              Class Details
            </h2>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <strong>Name:</strong> {selectedItem?.name}
              </div>
              <div className="col-span-4">
                <strong>Max Students:</strong> {selectedItem?.maxStudents}
              </div>
              <div className="col-span-4">
                <strong>Price:</strong> {selectedItem?.price.toLocaleString()}{" "}
                VND
              </div>
              <div className="col-span-4">
                <strong>Course Code:</strong> {selectedItem?.courseCode}
              </div>
              <div className="col-span-4" title={selectedItem.description}>
                <strong>Description:</strong>{" "}
                {selectedItem?.description
                  ? selectedItem.description.length > 8
                    ? `${selectedItem.description.slice(0, 8)}...`
                    : selectedItem.description
                  : "No description"}
              </div>
              <div className="col-span-4">
                <strong>Status: </strong>
                <span
                  className={`font-semibold
      ${selectedItem?.status === "PENDING" ? "text-yellow-500" : ""}
      ${selectedItem?.status === "COMPLETED" ? "text-green-500" : ""}
      ${selectedItem?.status === "ACTIVE" ? "text-blue-500" : ""}
      ${selectedItem?.status === "ONGOING" ? "text-brown-500" : ""}
    `}
                >
                  {selectedItem?.status}
                </span>
              </div>
              <div className="col-span-12">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem?.dateSlots?.map((slot, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border text-center">
                          {slot.date}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {slot.slotIds
                            .sort((a, b) => a - b) // Sort slotIds in ascending order
                            .map((slotId) => {
                              // Define time ranges for each slotId
                              const timeRanges = {
                                1: "7h00 - 9h15",
                                2: "9h30 - 11h45",
                                3: "12h30 - 14h45",
                                4: "15h00 - 17h15",
                                5: "17h45 - 20h00",
                              };

                              return `Slot ${slotId} (${
                                timeRanges[slotId] || "No time available"
                              })`;
                            })
                            .join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Image as the last centered item */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <strong>Image:</strong>
                <img
                  src={selectedItem?.imageUrl || defaults} // Use default if imageUrl is not provided
                  alt={selectedItem?.name || "Default Image"} // Provide a fallback alt text
                  className="mt-0 max-w-[100px] h-auto rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                onClick={closeModal}
                className="mt-4 bg-gray-200 border text-[#333] px-4 py-2 rounded-lg transition duration-200 hover:bg-red-600 hover:text-white"
              >
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
