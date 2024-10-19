import { useEffect, useState } from "react";
import { fetchCreateCategory, fetchUpdateCategory } from "@/data/api";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";

const CategoryLayout = ({
  currentPage,
  itemsPerPage,
  initialCategories = [],
  searchQuery,
  onUpdatePagination,
  setSearchQuery, // Receive the search query state
}) => {
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [categories, setCategories] = useState(initialCategories);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const token = sessionStorage.getItem("token");
  // Effect to update categories when initialCategories changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const createdCategory = await fetchCreateCategory(newCategory, token);
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, createdCategory];

        // Check for pagination after creating the category
        onUpdatePagination(updatedCategories.length);

        return updatedCategories;
      });
      toast.success("Category created successfully!");
      setNewCategory({ name: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category.");
    }
  };

  const handleEditCategory = async (id) => {
    if (!newCategory.name) {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const updatedCategory = await fetchUpdateCategory(id, newCategory, token);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.categoryId === id ? updatedCategory : cat
        )
      );

      toast.success("Category updated successfully!");
      setIsEditing(false);
      setNewCategory({ name: "" });
      setEditCategoryId(null);
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category.");
    }
  };

  // Calculate the filtered categories based on search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the current data to display based on pagination and search query
  const currentData = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create New Category
        </button>
        {/* Search Box with Icon */}
        <div
          className="flex items-center border rounded p-2 ml-4"
          style={{ width: "300px" }}
        >
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search Categories By Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Show Create Category Form */}
      {showCreateForm && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Create New Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => {
              const value = e.target.value;
              setNewCategory({ name: value });
            }}
            className="border rounded p-2 mr-2"
          />
          <button
            onClick={handleCreateCategory}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Submit
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            className="px-4 py-2 bg-gray-300 rounded-md ml-2"
          >
            Cancel
          </button>
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((cat, index) => (
                <tr
                  key={cat.categoryId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditCategoryId(cat.categoryId);
                        setNewCategory({ name: cat.name });
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-red-600 font-semibold"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Edit Category</h3>
          <input
            type="text"
            placeholder="Name"
            value={newCategory.name}
            onChange={(e) => {
              const value = e.target.value;
              setNewCategory({ ...newCategory, name: value });
            }}
            className="border rounded p-2 mr-2"
          />
          <button
            onClick={() => handleEditCategory(editCategoryId)}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Update Category
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-300 rounded-md ml-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryLayout;
