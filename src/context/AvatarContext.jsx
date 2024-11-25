import { createContext, useContext, useState, useEffect } from "react";

const AvatarContext = createContext();

export const useAvatar = () => {
  return useContext(AvatarContext);
};

export const AvatarProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const storedProfile = localStorage.getItem("result");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []); // This ensures the effect runs only once on initial mount

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
