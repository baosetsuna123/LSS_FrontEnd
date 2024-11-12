import { useState } from "react";

const ProfileTeacher = () => {
  // Retrieve result from localStorage
  const result = JSON.parse(localStorage.getItem("result"));

  // Initialize state for the avatar file and form data
  const [profileData, setProfileData] = useState({
    username: result?.username || "",
    fullName: result?.fullName || "",
    phoneNumber: result?.phoneNumber || "",
    email: result?.email || "",
  });

  const [avatar, setAvatar] = useState(null);

  // Handle changes in profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Normally, you would submit the form data to the API here
    console.log("Profile Updated:", profileData);
    console.log("Avatar:", avatar);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Teacher Profile
        </h1>

        <div className="space-y-4">
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Username
            </label>
            <p className="text-gray-900">{profileData.username}</p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <p className="text-gray-900">{profileData.email}</p>
          </div>

          {/* Avatar File Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Avatar</label>
            <input
              type="file"
              onChange={handleAvatarChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {avatar && (
              <div className="mt-2">
                <p className="text-gray-900">Selected File: {avatar.name}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-blue-600 text-white rounded-lg"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTeacher;
