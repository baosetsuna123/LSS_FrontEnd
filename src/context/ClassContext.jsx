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
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get the token from sessionStorage

    const getClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchClasses(token);
        setClasses(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getClasses(); // Fetch classes if token exists
    }
  }, []); // Run only once when the component mounts

  return (
    <ClassContext.Provider value={{ classes, loading, error }}>
      {children}
    </ClassContext.Provider>
  );
};
