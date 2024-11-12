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
  const token = sessionStorage.getItem("token");

  const [profileData, setProfileData] = useState({
    username: result.username || "",
    fullName: result.fullName || "",
    email: result.email || "",
    phoneNumber: result.phoneNumber || "",
    address: result.address || "",
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
    setCategoryIds(value);
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
      await updateCurrentUser(token, updatedProfileData);
      toast.success("Profile updated successfully!");
      setProfileData(updatedProfileData);
    } catch (e) {
      console.log(e);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 py-12 px-6 lg:px-8"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center">
          Update Profile
        </h1>
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 text-lg font-semibold">
              Username:
            </label>
            <p className="w-2/3 text-gray-900 text-lg">
              {profileData.username}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-lg font-semibold text-gray-800">
              Full Name:
            </label>
            <TextField
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
              className="text-lg"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-1/3 text-gray-700 text-lg font-semibold">
              Email:
            </label>
            <p className="w-2/3 text-gray-900 text-lg">{profileData.email}</p>
          </div>

          <div className="flex items-center mb-4">
            <label className="w-1/3 text-lg font-semibold text-gray-800">
              Phone Number:
            </label>
            <TextField
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
              className="text-lg"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/3 text-lg font-semibold text-gray-800">
              Address:
            </label>
            <TextField
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              fullWidth
              variant="outlined"
              className="text-lg"
            />
          </div>

          <div className="flex items-center space-x-4">
            <InputLabel
              id="category-label"
              className="min-w-fit text-lg font-semibold text-gray-800"
            >
              Choose your Major:
            </InputLabel>
            <FormControl variant="outlined" className="flex-1">
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
                displayEmpty
                className="text-lg"
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
            className="mt-6 py-3 text-lg font-semibold rounded-lg shadow-xl hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
