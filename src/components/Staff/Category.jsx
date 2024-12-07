import { useEffect, useState } from "react";
import { fetchCreateCategory, fetchUpdateCategory } from "@/data/api";
import { toast } from "react-hot-toast";
import { Search, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CategoryLayout = ({
  currentPage,
  itemsPerPage,
  initialCategories = [],
  searchQuery,
  onUpdatePagination,
  setSearchQuery,
}) => {
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [categories, setCategories] = useState(initialCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const createdCategory = await fetchCreateCategory(newCategory, token);
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, createdCategory];
        onUpdatePagination(updatedCategories.length);
        return updatedCategories;
      });
      toast.success("Category created successfully!");
      setNewCategory({ name: "" });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const updatedCategory = await fetchUpdateCategory(
        editCategoryId,
        newCategory,
        token
      );
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.categoryId === editCategoryId ? updatedCategory : cat
        )
      );
      toast.success("Category updated successfully!");
      setIsEditDialogOpen(false);
      setNewCategory({ name: "" });
      setEditCategoryId(null);
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Enter the name for the new category.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
            />
            <DialogFooter>
              <Button onClick={handleCreateCategory} disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin border-t-2 border-r-2 border-blue-500 border-solid rounded-full h-4 w-4 mr-2"></div>
                    Loading...
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div
          className="flex items-center border rounded p-2 ml-4"
          style={{ width: "300px" }}
        >
          <Search size={16} className="mr-2" />
          <Input
            placeholder="Search Categories By Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin border-t-4 border-r-4 border-blue-500 border-solid rounded-full h-10 w-10"></div>
        </div>
      ) : (
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
              {loading ? (
                <tr>
                  <td colSpan="3">
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((cat, index) => (
                  <tr
                    key={cat.categoryId}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditCategoryId(cat.categoryId);
                              setNewCategory({ name: cat.name });
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Update the name of the category.
                            </DialogDescription>
                          </DialogHeader>
                          <Input
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory({ name: e.target.value })
                            }
                          />
                          <DialogFooter>
                            <Button
                              onClick={handleEditCategory}
                              disabled={loading}
                            >
                              {loading ? (
                                <span className="flex items-center">
                                  <div className="animate-spin border-t-2 border-r-2 border-blue-500 border-solid rounded-full h-4 w-4 mr-2"></div>
                                  Loading...
                                </span>
                              ) : (
                                "Update"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              ) : (
                <td colSpan="3" className="h-40">
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
                  </div>
                </td>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryLayout;
