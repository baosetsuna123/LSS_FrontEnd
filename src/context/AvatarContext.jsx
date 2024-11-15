// AvatarContext.js
import { createContext, useContext, useState } from "react";

const AvatarContext = createContext();

export const useAvatar = () => {
  return useContext(AvatarContext);
};

export const AvatarProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    // Initialize state from localStorage if available
    const storedProfile = localStorage.getItem("result");
    return storedProfile ? JSON.parse(storedProfile) : {};
  });

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem("result", JSON.stringify(updatedProfile));
  };

  return (
    <AvatarContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </AvatarContext.Provider>
  );
};
