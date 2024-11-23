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
import {
  fetchVNPayReturn,
  fetchWalletHistory,
  fetchWalletTeacher,
} from "../../data/api"; // Import the functions
import { toast } from "react-hot-toast"; // Import toast
import { useLocation, useNavigate } from "react-router-dom";

export function WalletTeacher() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await fetchWalletHistory(token);
        console.log("Transactions:", data);
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [token, location.state]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const getBalance = async () => {
      try {
        const data = await fetchWalletTeacher(token);
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    // ... existing code ...
    getBalance();
  }, [token, location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const vnpAmount = urlParams.get("vnp_Amount");
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    // Only proceed if vnp_Amount and vnp_ResponseCode are present
    if (vnpAmount && vnpResponseCode) {
      const fetchPaymentReturn = async () => {
        try {
          const params = Object.fromEntries(urlParams.entries());
          const result = await fetchVNPayReturn(params, token);

          // Check for successful payment and navigate
          if (vnpResponseCode === "00") {
            console.log("Payment result:", result);

            toast.success(
              `Payment successful! Amount: ${formatCurrency(vnpAmount / 100)}`
            );
            navigate("/wallet"); // Redirect to the wallet page after successful payment
          } else {
            toast.error("Payment failed or canceled!");
          }
        } catch (error) {
          console.error("Error fetching payment return:", error);
          toast.error("An error occurred while processing the payment.");
        }
      };

      fetchPaymentReturn();
    }
  }, [location.search, token, navigate]);
  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
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
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>

        <Card>
          {transactions.length > 0 && (
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
                              )}{" "}
                              {/* Display formatted date */}
                            </p>
                            <p className="text-xs text-gray-400">
                              Transaction ID: {index + 1}
                            </p>
                            <p className="text-xs text-gray-400">
                              Type: {transaction.note} {/* Display the note */}
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
          )}
        </Card>
      </div>
    </div>
  );
}
