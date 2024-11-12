import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { fetchAllCategories, updateCurrentUser } from "@/data/api";
import { toast } from "react-hot-toast";
import profile from "../../assets/profilebg.jfif";

export default function Profile() {
  const result = JSON.parse(localStorage.getItem("result") || "{}");
  const token = sessionStorage.getItem("token"); // Assume token is stored in localStorage

  const [profileData, setProfileData] = useState({
    username: result.username || "",
    fullName: result.fullName || "",
    email: result.email || "",
    phoneNumber: result.phoneNumber || "",
    address: result.address || "",
  });

  const [categoryIds, setCategoryIds] = useState([]); // Selected category IDs
  const [allCategories, setAllCategories] = useState([]); // List of all categories

  // Handle changes in profile input fields
  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryIds(value);
  };

  // Fetch categories on mount
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
  }, []);

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

    const userData = {
      address: profileData.address,
      fullName: profileData.fullName,
      categoryIds,
      phoneNumber: profileData.phoneNumber,
    };

    try {
      await updateCurrentUser(token, userData);
      toast.success("Profile updated successfully!");

      setProfileData(userData);
    } catch (e) {
      console.log(e);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6 lg:px-8"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Profile
        </h1>
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 text-xl font-semibold">
              Username:
            </label>
            <p className="w-2/3 text-gray-900 mr-10 text-xl">
              {profileData.username}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-xl font-semibold text-gray-800">
              Full Name:
            </label>
            <TextField
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 text-xl font-semibold">
              Email:
            </label>
            <p className="w-2/3 text-gray-900 mr-10 text-xl">
              {profileData.email}
            </p>
          </div>

          <div className="flex items-center mb-4">
            <label className="text-xl font-semibold text-gray-800 mr-4 whitespace-nowrap">
              Phone Number:
            </label>
            <TextField
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-xl font-semibold text-gray-800">
              Address:
            </label>
            <TextField
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
            />
          </div>

          <div className="flex items-center space-x-4">
            <InputLabel
              id="category-label"
              className="min-w-fit text-xl font-semibold text-gray-800" // min-w-fit prevents truncation
            >
              Choose your Major:
            </InputLabel>
            <FormControl variant="outlined" className="flex-1">
              {" "}
              {/* flex-1 allows it to take up remaining space */}
              <Select
                labelId="category-label"
                multiple
                value={categoryIds}
                onChange={handleCategoryChange}
                renderValue={(selected) => {
                  const selectedNames = allCategories
                    .filter((category) =>
                      selected.includes(category.categoryId)
                    )
                    .map((category) => category.name);
                  return selectedNames.join(", ");
                }}
                displayEmpty // Ensures the label is visible until items are selected
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

          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
