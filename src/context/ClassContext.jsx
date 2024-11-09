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
  // Initialize classes state with sessionStorage data if available
  const [classes, setClasses] = useState(() => {
    const storedClasses = sessionStorage.getItem("classes");
    return storedClasses ? JSON.parse(storedClasses) : [];
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch classes
  const getClasses = async (token, role) => {
    if (role !== "STUDENT") return;
    setLoading(true);
    try {
      const response = await fetchClasses(token);
      console.log("Fetched classes:", response); // Log the response to verify it's correct
      if (response) {
        const newClasses = response;
        if (JSON.stringify(newClasses) !== JSON.stringify(classes)) {
          setClasses(newClasses);
          sessionStorage.setItem("classes", JSON.stringify(newClasses));
        }
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearClasses = () => {
    setClasses([]); // Clear classes
    sessionStorage.removeItem("classes"); // Remove from sessionStorage
  };

  // Fetch classes on mount if user role is STUDENT
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const result = JSON.parse(sessionStorage.getItem("result") || "{}");
    const role = result.role;

    if (token && role === "STUDENT") {
      // Only fetch if classes are not in sessionStorage
      if (classes.length === 0) {
        getClasses(token, role);
      } else {
        setLoading(false); // Classes are already loaded from sessionStorage
      }
    } else {
      setLoading(false);
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
