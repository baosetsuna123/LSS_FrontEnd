import { fetchAllCategories } from "@/data/api";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import profile from "../../assets/profilebg.jfif";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateTeacherProfile } from "@/data/api";
import misasa from "../../assets/misasa.jfif";
import { useAvatar } from "@/context/AvatarContext";
const ProfileTeacher = () => {
  const result = JSON.parse(localStorage.getItem("result"));
  const [profileData, setProfileData] = useState({
    username: result?.username || "",
    fullName: result?.fullName || "",
    phoneNumber: result?.phoneNumber || "",
    email: result?.email || "",
    address: result?.address || "", // Add address field
    description: result?.description || "",
    avatarImage: result?.avatarImage || "",
  });
  const [categoryIds, setCategoryIds] = useState([]); // Selected category IDs
  const [allCategories, setAllCategories] = useState([]); // List of all categories
  const [avatar, setAvatar] = useState(null);

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

    // Set categoryIds from result.majors if available
    if (result.major && result.major.length > 0) {
      const savedCategoryIds = result.major.map((major) => major.categoryId);
      setCategoryIds(savedCategoryIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes in profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [avatarName, setAvatarName] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  useEffect(() => {
    const storedAvatar = JSON.parse(
      localStorage.getItem("result")
    )?.avatarImage;
    if (storedAvatar) {
      const imageName = storedAvatar.split("/").pop(); // Extract image name from URL
      setAvatarImage(imageName); // Set the image name for display
    }
  }, []);

  // Handle file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Get the file selected by the user
    if (file) {
      setAvatar(file); // Update avatar file state
      setAvatarName(file.name); // Update avatar name with the file's name (not the URL)
    }
  };
  // Handle avatar file selection

  // Handle category selection
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryIds(value);
  };

  const [loading, setLoading] = useState(false); // State to track loading
  const { updateUserProfile } = useAvatar();
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true); // Start loading when submitting

      const token = sessionStorage.getItem("token");
      if (
        !profileData.fullName ||
        !profileData.phoneNumber ||
        !avatar ||
        !profileData.address ||
        !profileData.description // Ensure description is filled
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false); // Stop loading if validation fails
        return;
      }

      const backgroundImage = null; // If no background image is being updated
      const response = await updateTeacherProfile(
        profileData,
        avatar,
        backgroundImage,
        token
      );

      if (response) {
        // Prepare the updated user profile object
        const updatedResult = {
          ...result,
          avatarImage: response.avatarImage,
          fullName: profileData.fullName,
          phoneNumber: profileData.phoneNumber,
          address: profileData.address,
          description: profileData.description,
        };

        localStorage.setItem("result", JSON.stringify(updatedResult));

        setProfileData(updatedResult);

        updateUserProfile(updatedResult);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data === "Maximum upload size exceeded" // 413 indicates payload too large
      ) {
        toast.error("Upload failed: Maximum file size exceeded.");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false); // Stop loading when API call finishes
    }
  };

  const avatarImages = JSON.parse(localStorage.getItem("result")).avatarImage;

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-6 lg:px-8"
      style={{
        backgroundImage: `url(${profile})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teacher Profile</h1>
          {avatarImage ? (
            <img
              src={avatarImages}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
          ) : (
            <img
              src={misasa}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
          )}
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">
              Username
            </label>
            <p className="text-gray-900 w-3/4">{profileData.username}</p>
          </div>

          {/* Full Name */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              className="w-3/4 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              className="w-3/4 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Email */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">Email</label>
            <p className="text-gray-900 w-3/4">{profileData.email}</p>
          </div>

          {/* Address */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">Address</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              className="w-3/4 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">
              Description
            </label>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleProfileChange}
              className="w-3/4 p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-semibold w-1/4">
              Upload Avatar
            </label>
            <div className="w-3/4 flex items-center">
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput").click()}
                className="p-2 border border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Choose File
              </button>
              <input
                id="avatarInput"
                type="file"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <span className="ml-2 text-gray-900">
                {avatarName
                  ? `Selected Avatar: ${avatarName}`
                  : "No file selected"}
              </span>
            </div>
          </div>

          {/* Major Select */}
          <div className="mb-4 flex items-center">
            <InputLabel
              id="category-label"
              className="text-xl font-semibold text-gray-800 w-1/4"
            >
              Your Major:
            </InputLabel>
            <FormControl variant="outlined" className="flex-1" disabled>
              <Select
                labelId="category-label"
                multiple
                value={categoryIds} // Ensure this is an array
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

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-blue-600 text-white rounded-lg"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTeacher;
