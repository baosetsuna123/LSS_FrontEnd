import { useState, useEffect } from "react";
import { fetchAllCategories, updateCurrentUser } from "@/data/api";
import { toast } from "react-hot-toast";
import profile from "../../assets/profilebg.jfif";
import avatar from "../../assets/avatar.png";
import { User, Mail, Phone, BookOpen, Save } from "lucide-react";
import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

export default function Profile() {
  const result = JSON.parse(localStorage.getItem("result") || "{}");
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: result.username || "",
    fullName: result.fullName || "",
    email: result.email || "",
    phoneNumber: result.phoneNumber || "",
    address: result.address || "135 Nguyen xi, Binh Thanh, HCMC",
  });

  const [categoryIds, setCategoryIds] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setAllCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();

    if (result.major && result.major.length > 0) {
      console.log(result.major);
      const savedCategoryIds = result.major.map((major) => major.categoryId);
      setCategoryIds(savedCategoryIds);
    }
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryIds([value]);
  };

  const handleUpdateProfile = async () => {
    if (
      !profileData.fullName ||
      !profileData.address ||
      !profileData.phoneNumber ||
      categoryIds.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (
      profileData.phoneNumber.length < 10 ||
      profileData.phoneNumber.length > 14
    ) {
      toast.error("Phone number must be between 10 and 14 digits.");
      return;
    }

    const updatedProfileData = {
      ...profileData,
      username: result.username,
      email: result.email,
      categoryIds,
    };

    try {
      setLoading(true);
      await updateCurrentUser(token, updatedProfileData);
      toast.success("Profile updated successfully!");
      const updatedMajor = allCategories.filter((category) =>
        categoryIds.includes(category.categoryId)
      );
      // Update localStorage to persist updated data
      const updatedResult = {
        ...result,
        fullName: profileData.fullName,
        address: profileData.address,
        phoneNumber: profileData.phoneNumber,
        major: updatedMajor,
      };
      localStorage.setItem("result", JSON.stringify(updatedResult));

      setProfileData(updatedProfileData);
    } catch (e) {
      console.log(e);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 py-12 px-6 lg:px-8 dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-105 dark:bg-gray-800 dark:text-white">
        <div className="flex justify-center mb-6">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center dark:text-gray-100">
          Update Profile
        </h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
              <label className="text-gray-700 text-lg font-semibold dark:text-gray-300">
                Username
              </label>
            </div>
            <p className="text-gray-900 text-lg dark:text-gray-100 pl-8">
              {profileData.username}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
              <label className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                Full Name
              </label>
            </div>
            <input
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
              <label className="text-gray-700 text-lg font-semibold dark:text-gray-300">
                Email
              </label>
            </div>
            <p className="text-gray-900 text-lg dark:text-gray-100 pl-8">
              {profileData.email}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Phone className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
              <label className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                Phone Number
              </label>
            </div>
            <input
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" />
              <label className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                Choose your Major
              </label>
            </div>
            <FormControl
              variant="outlined"
              className="flex-1"
              style={{ width: "100%" }}
            >
              <Select
                labelId="category-label"
                value={categoryIds[0] || ""} // Display the first selected category or empty
                onChange={handleCategoryChange}
                renderValue={(selected) => {
                  const selectedCategory = allCategories.find(
                    (category) => category.categoryId === selected
                  );
                  return selectedCategory
                    ? selectedCategory.name
                    : "Select a category";
                }}
                displayEmpty
                className="text-lg dark:bg-gray-700 dark:text-white"
              >
                {allCategories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    <Checkbox
                      checked={categoryIds.includes(category.categoryId)}
                    />
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="w-full mt-6 py-3 text-lg font-semibold rounded-lg shadow-xl bg-blue-500 text-white hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
