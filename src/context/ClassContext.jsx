import { createContext, useContext, useState, useEffect } from "react";
import { fetchClasses } from "../data/api"; // Import the fetchClasses function

// Create the ClassContext
const ClassContext = createContext();

// Create a custom hook to use the ClassContext
export const useClassContext = () => {
  return useContext(ClassContext);
};

// Create a provider component
export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch classes
  const getClasses = async (token) => {
    try {
      const localClasses = localStorage.getItem("classes");

      // Load from localStorage if available
      if (localClasses) {
        setClasses(JSON.parse(localClasses));
      }

      const response = await fetchClasses(token);
      if (response) {
        setClasses(response);
        localStorage.setItem("classes", JSON.stringify(response)); // Cache fresh data
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(true);
    }
  };
  const clearClasses = () => {
    setClasses([]); // Clear classes
    localStorage.removeItem("classes"); // Optionally clear from localStorage
  };
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      getClasses(token);
      setLoading(false);
    } else {
      setLoading(true); // Stop loading if no token
    }
  }, []); // Run only once when the component mounts

  return (
    <ClassContext.Provider
      value={{ classes, loading, setLoading, getClasses, clearClasses }}
    >
      {children}
    </ClassContext.Provider>
  );
};
