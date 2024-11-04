import { createContext, useContext, useState, useEffect } from "react";

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

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();

    const submittedFeedbackOrderIds = localStorage.getItem(
      "submittedFeedbackOrderIds"
    );
    localStorage.clear(); // Clear everything first

    if (submittedFeedbackOrderIds) {
      localStorage.setItem(
        "submittedFeedbackOrderIds",
        submittedFeedbackOrderIds
      );
    }
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
