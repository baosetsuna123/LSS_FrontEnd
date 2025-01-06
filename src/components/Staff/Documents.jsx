import { useEffect, useState } from "react";
import {
  EllipsisVertical,
  Search,
  Edit,
  Eye,
  Save,
  X,
  Upload,
  FileText,
  AlignLeft,
  Type,
  Paperclip,
  Book,
  Tag,
} from "lucide-react";
import { getDocumentById, updateDocument } from "@/data/api";
import toast from "react-hot-toast";
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

  // Function to remove the deleted document from the table

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
            placeholder="Search Documents by Title"
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
                      title={item.content || "N/A"} // Show "N/A" as the title if content is null
                    >
                      {item.content
                        ? item.content.length > 20
                          ? `${item.content.slice(0, 20) + "..."}`
                          : item.content
                        : "N/A"}{" "}
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
                        <span>No file available</span>
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
        </table>
      </div>
      {EditmodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Document
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Title Field */}
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
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Content Field */}
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
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
              </div>

              {/* File Preview */}
              <div>
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
              <div>
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
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
            </form>
          </div>
        </div>
      )}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Document Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Tag className="mr-2 text-gray-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="text-base text-gray-900">{selectedItem.id}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Book
                    className="mr-2 text-gray-400 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Course Code
                    </p>
                    <p className="text-base text-gray-900">
                      {selectedItem.courseCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText
                    className="mr-2 text-gray-400 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Title</p>
                    <p className="text-base text-gray-900">
                      {selectedItem.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <AlignLeft
                    className="mr-2 text-gray-400 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Content</p>
                    <p className="text-base text-gray-900 break-words">
                      {selectedItem.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Paperclip
                    className="mr-2 text-gray-400 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">File</p>
                    <a
                      href={selectedItem.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      View File
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* File Preview */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                File Preview
              </h3>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                {selectedItem.filePath.toLowerCase().endsWith(".pdf") ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <embed
                      src={selectedItem.filePath}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      className="rounded-md"
                    />
                  </div>
                ) : selectedItem.filePath.toLowerCase().endsWith(".docx") ||
                  selectedItem.filePath.toLowerCase().endsWith(".doc") ? (
                  <div className="flex items-center justify-center p-4">
                    <FileText size={48} className="text-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">
                      Word Document
                    </span>
                  </div>
                ) : selectedItem.filePath.toLowerCase().endsWith(".jpg") ||
                  selectedItem.filePath.toLowerCase().endsWith(".jpeg") ||
                  selectedItem.filePath.toLowerCase().endsWith(".png") ? (
                  <img
                    src={selectedItem.filePath}
                    alt="File Preview"
                    className="w-full h-auto max-h-64 object-contain mx-auto rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <FileText size={48} className="text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">
                      Unsupported File Type
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <X size={18} className="mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
