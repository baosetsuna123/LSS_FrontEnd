import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import wallet from "../../assets/wallet.jpg"; // Ensure the path is correct
import { useEffect, useState } from "react";
import { fetchWalletHistory, fetchWalletTeacher } from "../../data/api"; // Import the functions
import { useLocation } from "react-router-dom";

export function WalletTeacher() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(true); // Loading state for balance
  const [loadingTransactions, setLoadingTransactions] = useState(true); // Loading state for transactions
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true); // Start loading for transactions
      try {
        const data = await fetchWalletHistory(token);
        const sortedData = data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        setTransactions(sortedData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoadingTransactions(false); // End loading for transactions
      }
    };

    fetchTransactions();
  }, [token, location.state]);

  useEffect(() => {
    const getBalance = async () => {
      setLoadingBalance(true); // Start loading for balance
      try {
        const data = await fetchWalletTeacher(token);
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setLoadingBalance(false); // End loading for balance
      }
    };

    getBalance();
  }, [token, location.search]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7); // Convert UTC to GMT+7
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${wallet})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto p-4 max-w-4xl bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          My Wallet
        </h1>

        <Card className="mb-6 shadow-md">
          <CardHeader className="text-center">
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>Your available funds</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {loadingBalance ? (
              <div className="flex justify-center items-center ">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <p className="text-4xl font-bold text-gray-900">
                {formatCurrency(balance)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          {loadingTransactions ? (
            <CardContent className="text-center">
              <p className="text-gray-500 text-lg animate-pulse">
                Loading transactions...
              </p>
            </CardContent>
          ) : transactions.length > 0 ? (
            <>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {transactions.map((transaction, index) => {
                    const isCredit = transaction.amount >= 0;
                    const formattedAmount = Math.abs(transaction.amount);

                    return (
                      <li
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center">
                          {isCredit ? (
                            <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm text-gray-500">
                              {formatTransactionDate(
                                transaction.transactionDate
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              Transaction ID: {index + 1}
                            </p>
                            <p className="text-xs text-gray-400">
                              Type: {transaction.note}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p
                            className={`font-medium ${
                              isCredit ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {isCredit ? "+ " : "- "}
                            {formatCurrency(formattedAmount)}
                          </p>
                          <p className="text-sm text-gray-400">
                            New Balance:{" "}
                            {formatCurrency(transaction.transactionBalance)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </>
          ) : (
            <CardContent className="text-center">
              <p className="text-gray-500 text-lg">No transactions found</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
