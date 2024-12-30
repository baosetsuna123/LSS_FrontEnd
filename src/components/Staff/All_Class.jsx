import { Edit, EllipsisVertical, Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import toast from "react-hot-toast";

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
  const [classDTO, setClassDTO] = useState({
    name: "",
    description: "",
    maxStudents: "",
    price: "",
    courseCode: "",
    dateSlots: [],
  });
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
      const data = await getDocumentById(item.id, token);
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
  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the selected item
    setClassDTO({
      title: item.title || "",
      content: item.content || "",
      file: item.filePath || null, // Reset file input
    });
    console.log(item.filePath);
    setEditModalOpen(true); // Open the modal
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
  const handleUpdate = async () => {
    try {
      setLoading(true);
      // Call the updateDocument API
      const updatedDocument = await updateDocument(selectedItem.id, token);
      toast.success("Document updated successfully"); // Show success message
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === selectedItem.id ? { ...doc, ...updatedDocument } : doc
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassDTO({
      ...classDTO,
      [name]: value,
    });
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
      {EditmodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Class</h2>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={classDTO.title}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={classDTO.content}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>
            <div className="flex justify-between mt-4">
              {/* Update Button */}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-auto"
              >
                {loading ? "Updating..." : "Update"}
              </button>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-md w-auto">
            <h2 className="text-xl font-semibold mb-4">Class Details</h2>
            <div className="mb-2">
              <strong>ID:</strong> {selectedItem.id}
            </div>
            <div className="mb-2">
              <strong>Course Code:</strong> {selectedItem.courseCode}
            </div>
            <div className="mb-2">
              <strong>Title:</strong> {selectedItem.title}
            </div>
            <div className="mb-2 whitespace-nowrap">
              <strong>Content:</strong> {selectedItem.content}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 text-center mx-auto block bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Close
            </button>
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
