import { useState } from "react";
import { Search } from "lucide-react";
import { getNewsById, updateNews, createNews } from "@/data/api";
import toast from "react-hot-toast";
import ReactQuill from "react-quill"; // Import ReactQuill editor
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
const News = ({
  currentPage,
  itemsPerPage,
  news, // News data passed from parent
  setNews, // Function to update news passed from parent
  searchQuery,
  setSearchQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for Create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Modal state for Create New
  const [selectedNews, setSelectedNews] = useState(null); // Selected news for the update modal
  const [updatedTitle, setUpdatedTitle] = useState(""); // Updated title in the modal
  const [updatedContent, setUpdatedContent] = useState(""); // Updated content in the modal
  const [newTitle, setNewTitle] = useState(""); // New title for Create News
  const [newContent, setNewContent] = useState(""); // New content for Create News

  const token = sessionStorage.getItem("token");

  const sortedData = news.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateB - dateA; // Sort by most recent date
    }

    // If dates are the same, compare by time
    const timeA = new Date(`1970-01-01T${a.time}`);
    const timeB = new Date(`1970-01-01T${b.time}`);
    return timeB - timeA; // Sort by most recent time
  });

  // Calculate the filtered news based on the search query
  const filteredNews = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredNews);
  // Paginate the filtered news based on currentPage and itemsPerPage
  const currentData = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateClick = async (id) => {
    try {
      const fetchedNews = await getNewsById(id, token); // Fetch news by ID (replace with real API call)
      setSelectedNews(fetchedNews);
      setUpdatedTitle(fetchedNews.title); // Pre-fill modal title
      setUpdatedContent(fetchedNews.content); // Pre-fill modal content
      setIsModalOpen(true); // Open update modal
    } catch (error) {
      console.error("Failed to fetch news data:", error);
    }
  };
  function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateModalOpen = () => {
    setNewTitle("");
    setNewContent("");
    setIsCreateModalOpen(true);
  };
  const handleCreateModalClose = () => {
    setNewTitle("");
    setNewContent("");
    setIsCreateModalOpen(false);
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["link"],
      ["clean"], // Remove formatting
    ],
  };

  // Define allowed formats (inline formatting only)
  const formats = [
    "header",
    "font",
    "list",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "link",
  ];
  const handleCreateSubmit = async () => {
    // Validate title and content for creating news
    if (!newTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!newContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const newNewsData = {
        title: newTitle,
        content: newContent, // Save formatted content directly
      };
      const data = await createNews(newNewsData, token);
      setNews((prevNews) => [...prevNews, { ...data }]);
      setIsCreateModalOpen(false);
      toast.success("News created successfully!");
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("Failed to create news.");
    }
  };

  const handleUpdateSubmit = async () => {
    // Validate title and content
    if (!updatedTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!updatedContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const updatedNewsData = {
        ...selectedNews,
        title: updatedTitle,
        content: updatedContent, // Save formatted content directly
      };

      await updateNews(selectedNews.id, updatedNewsData, token);

      setIsModalOpen(false);

      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === selectedNews.id
            ? { ...item, title: updatedTitle, content: updatedContent }
            : item
        )
      );

      toast.success("News updated successfully!");
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news.");
    }
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
            placeholder="Search News by Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
        <button
          onClick={handleCreateModalOpen}
          className="px-4 py-2 mr-10 text-white bg-green-500 hover:bg-green-600 rounded-md"
        >
          Create New
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                const formattedDate =
                  item.date && item.time
                    ? `${new Date(`${item.date}T${item.time}Z`).toLocaleString(
                        "en-GB",
                        {
                          timeZone: "Asia/Bangkok", // GMT+7 timezone
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}`
                    : "N/A";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      {formattedDate}
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
                        ? `${stripHtml(item.content).slice(0, 20) + "..."}` // Strip HTML and then truncate
                        : stripHtml(item.content)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleUpdateClick(item.id)}
                        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                      >
                        Update
                      </button>
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

      {/* Modal for updating news */}
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Update News</h2>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Content
              </label>
              <ReactQuill
                value={updatedContent}
                onChange={setUpdatedContent}
                theme="snow"
                className="mb-4"
                modules={modules}
                formats={formats}
              />
            </div>
            <button
              onClick={handleUpdateSubmit}
              className="px-4 py-2 mr-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for creating news */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Create News</h2>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Content
              </label>
              <ReactQuill
                value={newContent}
                onChange={setNewContent}
                theme="snow"
                className="mb-4"
              />
            </div>
            <button
              onClick={handleCreateSubmit}
              className="px-4 py-2 mr-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Create
            </button>
            <button
              onClick={handleCreateModalClose}
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
