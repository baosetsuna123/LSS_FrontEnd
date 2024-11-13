// QuestionContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { fetchQuestionFeedback } from "../data/api"; // Adjust the path as needed

// Create the QuestionContext
const QuestionContext = createContext();

// Create a custom hook for easy access to the context
export const useQuestionContext = () => useContext(QuestionContext);

// QuestionProvider Component
export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch questions when the provider mounts
    const getQuestions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const data = await fetchQuestionFeedback(token);
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching feedback questions:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  // Provide the questions, loading state, and error to the context
  return (
    <QuestionContext.Provider value={{ questions, loading, error }}>
      {children}
    </QuestionContext.Provider>
  );
};
