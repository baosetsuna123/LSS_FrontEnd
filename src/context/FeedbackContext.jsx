import { createContext, useContext, useEffect, useState } from "react";

const FeedbackContext = createContext();

export const useFeedback = () => {
  return useContext(FeedbackContext);
};

export const FeedbackProvider = ({ children }) => {
  const [submittedFeedbackOrderIds, setSubmittedFeedbackOrderIds] = useState(
    () => {
      // Retrieve the initial state from localStorage
      const storedIds = localStorage.getItem("submittedFeedbackOrderIds");
      return storedIds ? new Set(JSON.parse(storedIds)) : new Set();
    }
  );
  useEffect(() => {
    localStorage.setItem(
      "submittedFeedbackOrderIds",
      JSON.stringify(Array.from(submittedFeedbackOrderIds))
    );
  }, [submittedFeedbackOrderIds]);
  const addFeedbackOrderId = (orderId) => {
    setSubmittedFeedbackOrderIds((prevSet) => new Set(prevSet).add(orderId));
  };
  const clearFeedbackOrderIds = () => {
    setSubmittedFeedbackOrderIds(new Set());
    localStorage.removeItem("submittedFeedbackOrderIds");
  };

  return (
    <FeedbackContext.Provider
      value={{
        submittedFeedbackOrderIds,
        addFeedbackOrderId,
        clearFeedbackOrderIds,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
