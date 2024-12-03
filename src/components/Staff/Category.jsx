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
        onUpdatePagination(updatedCategories.length);
        return updatedCategories;
      });
      toast.success("Category created successfully!");
      setNewCategory({ name: "" });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category.");
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name cannot be empty.");
      return;
    }
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
              <Button onClick={handleCreateCategory}>Create</Button>
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
                          <Button onClick={handleEditCategory}>Update</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
    </div>
  );
};

export default CategoryLayout;
