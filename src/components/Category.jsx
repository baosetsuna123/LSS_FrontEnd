import { useEffect, useState } from "react";
import { fetchCreateCategory, fetchUpdateCategory } from "@/data/api";
import { toast } from "react-hot-toast";

const CategoryLayout = ({
  currentPage,
  itemsPerPage,
  initialCategories = [],
}) => {
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [categories, setCategories] = useState(initialCategories); // Set state using the new prop name
  const token = sessionStorage.getItem("token");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  // Effect to update categories when initialCategories changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCreateCategory = async () => {
    try {
      const createdCategory = await fetchCreateCategory(newCategory, token);
      setCategories((prevCategories) => [...prevCategories, createdCategory]);
      toast.success("Category created successfully!");
      setNewCategory({ name: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category.");
    }
  };

  const handleEditCategory = async (id) => {
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

  // Calculate the current data to display based on pagination
  const currentData = Array.isArray(categories)
    ? categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create New Category
        </button>
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
              if (value.trim() === "") {
                alert("Tên danh mục không được để trống!"); // Thông báo nếu tên danh mục trống
                return;
              }
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
        <table className="min-w-full">
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
            {currentData.map((cat, index) => (
              <tr key={cat.categoryId}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
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
            ))}
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
              if (value.trim() === "") {
                alert("Tên danh mục không được để trống!"); // Thông báo nếu tên danh mục trống
                return;
              }
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
