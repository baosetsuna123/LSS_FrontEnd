import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "./Theme-Provider";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };
  const { setTheme } = useTheme();
  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();

    // Preserve "submittedFeedbackOrderIds" before clearing localStorage
    const submittedFeedbackOrderIds = localStorage.getItem(
      "submittedFeedbackOrderIds"
    );

    // Clear all localStorage
    localStorage.clear();

    // Restore the preserved data
    if (submittedFeedbackOrderIds) {
      localStorage.setItem(
        "submittedFeedbackOrderIds",
        submittedFeedbackOrderIds
      );
    }

    // Change theme to light explicitly
    setTheme("light");
  };

  useEffect(() => {}, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
