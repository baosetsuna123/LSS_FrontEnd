import { createContext, useState, useContext, useCallback } from "react";
import { fetchBalance } from "../data/api";

// Create the WalletContext
const WalletContext = createContext();

// Create a provider component
export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBalance = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBalance(token);
      setBalance(data.balance);
    } catch (err) {
      setError(err.message || "Error fetching balance");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ balance, loadBalance, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the WalletContext
export const useWallet = () => useContext(WalletContext);
