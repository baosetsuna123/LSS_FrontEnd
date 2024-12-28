import { useEffect, useState } from "react";
import { EllipsisVertical, Search, Edit, Trash, Eye } from "lucide-react";
import { deleteDocument, getDocumentById, updateDocument } from "@/data/api";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
const Documents = ({
  currentPage,
  itemsPerPage,
  documents, // News data passed from parent
  setDocuments, // Function to update news passed from parent
  searchQuery,
  setSearchQuery,
}) => {
  const [dialogOpen, setDialogOpen] = useState(null);
  const [EditmodalOpen, setEditModalOpen] = useState(false); // State for modal visibility
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const DeleteModal = ({ isOpen, document, onClose, onDeleteSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Get token from session storage
        setLoading(true); // Set loading state
        await deleteDocument(document.id, token); // Call the deleteDocument API
        toast.success("Document deleted successfully"); // Show success message
        onDeleteSuccess(document.id); // Notify parent component to update the table
        onClose(); // Close the modal
      } catch (error) {
        toast.error("Error deleting document");
        console.error("Error deleting document:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    return (
      isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-auto">
            <div className="flex items-center mb-4">
              {/* Warning Icon */}
              <div className="text-yellow-500 mr-3">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h2 className="text-lg text-center items-center justify-center font-semibold whitespace-nowrap">
                Are you sure you want to delete this document?
              </h2>
            </div>
            <p className="mt-2 text-center text-red-500 ">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-300 text-black p-2 rounded-md flex items-center"
                onClick={onClose}
              >
                <i className="fas fa-times mr-2"></i> Cancel
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-md flex items-center"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>{" "}
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrashAlt className="mr-2" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the selected item
    setFormData({
      title: item.title || "",
      content: item.content || "",
      file: item.filePath || null, // Reset file input
    });
    console.log(item.filePath);
    setEditModalOpen(true); // Open the modal
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
  const handleCloseModal = () => {
    setEditModalOpen(false); // Close the modal
    setSelectedItem(null); // Clear selected item
  };
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Modal open state
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document); // Set the document to delete
    setDeleteModalOpen(true); // Open the delete modal
  };

  // Function to remove the deleted document from the table
  const handleDeleteSuccess = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id)); // Remove deleted document from state
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file, // Store selected file
    });
  };
  const [loading, setLoading] = useState(false);
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
  const handleButtonClick = (index) => {
    // Toggle dialog for the specific row
    setDialogOpen(dialogOpen === index ? null : index);
  };
  const token = sessionStorage.getItem("token");
  console.log(documents);

  // Calculate the filtered news based on the search query
  const filterDocs = documents.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDetailsClick = async (item) => {
    try {
      // Call the getDocumentById function from api.js
      const data = await getDocumentById(item.id, token); // Use the imported API function
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
  // Paginate the filtered news based on currentPage and itemsPerPage
  const currentData = filterDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            placeholder="Search News by Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                return (
                  <tr
                    key={item.categoryId}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      {item.courseCode}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      title={item.title}
                    >
                      {item.title || "N/A"}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      title={item.content}
                    >
                      {item.content.length > 20
                        ? `${item.content.slice(0, 20) + "..."}` // Strip HTML and then truncate
                        : item.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.filePath ? (
                        <a
                          href={item.filePath} // Link to the file
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View File
                        </a>
                      ) : (
                        <span>No file available</span> // Fallback text if no file exists
                      )}
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
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit size={16} />
                          </div>
                          <div
                            className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-red-500"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash size={16} />
                          </div>
                          <div
                            className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md text-gray-500"
                            onClick={() => handleDetailsClick(item)}
                          >
                            <Eye size={16} />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
          <DeleteModal
            isOpen={isDeleteModalOpen}
            document={documentToDelete}
            onClose={() => setDeleteModalOpen(false)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </table>
      </div>
      {EditmodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Document</h2>

            {/* Title Field */}
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
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Content Field */}
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
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>

            {/* File Field */}
            {/* Show Current File Preview (if no new file is selected) */}
            {selectedItem && selectedItem.filePath && !formData.file && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current File
                </label>
                <div className="mt-2">
                  {selectedItem.filePath.endsWith(".pdf") ? (
                    // For PDF files, use an embed tag to show a preview
                    <embed
                      src={selectedItem.filePath}
                      type="application/pdf"
                      width="100%"
                      height="120px"
                    />
                  ) : selectedItem.filePath.endsWith(".docx") ||
                    selectedItem.filePath.endsWith(".doc") ? (
                    // For Word files, display an icon
                    <div className="text-center text-gray-500">
                      <span>Unsupported File Type</span>
                    </div>
                  ) : selectedItem.filePath.endsWith(".jpg") ||
                    selectedItem.filePath.endsWith(".jpeg") ||
                    selectedItem.filePath.endsWith(".png") ? (
                    // For Image files (JPG, JPEG, PNG), show an image preview
                    <img
                      src={selectedItem.filePath}
                      alt="File Preview"
                      className="w-full h-auto max-w-[60px] mx-auto object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <span>Unsupported File Type</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show Preview of the Selected File (if file is selected) */}
            {formData.file && formData.file instanceof File && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Selected File
                </label>
                <div className="mt-2">
                  {formData.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.file)} // Create object URL for the selected file
                      alt="File Preview"
                      className="w-full h-auto max-w-[150px] mx-auto object-contain"
                    />
                  ) : formData.file.type === "application/pdf" ? (
                    <embed
                      src={URL.createObjectURL(formData.file)}
                      type="application/pdf"
                      width="100%"
                      height="120px"
                    />
                  ) : formData.file.type === "application/msword" ||
                    formData.file.type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                    <div className="flex justify-center items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Microsoft_Office_Word_2013_logo.svg/1200px-Microsoft_Office_Word_2013_logo.svg.png"
                        alt="Word Document"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <span>Unsupported File Type</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload File
              </label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="mt-2 w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* File Input */}

            {/* Loading/Error */}

            {/* Update Button */}
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
            <h2 className="text-xl font-semibold mb-4">Document Details</h2>
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
            <div className="mb-2">
              <strong>File Link:</strong>{" "}
              <a
                href={selectedItem.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View File
              </a>
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
    </div>
  );
};

export default Documents;
