import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", token); // Log the token
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    console.log("Logging in..."); // Log when login is called
    setIsLoggedIn(true);
    console.log("isLoggedIn after login:", isLoggedIn); // Log the value after setting
  };
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Clear token on logout
  };
  useEffect(() => {
    console.log("isLoggedIn updated:", isLoggedIn);
  }, [isLoggedIn]);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, setIsLoggedIn }}>
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
