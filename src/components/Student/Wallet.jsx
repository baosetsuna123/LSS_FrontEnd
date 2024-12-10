import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import wallet from "../../assets/wallet.jpg"; // Ensure the path is correct
import { useEffect, useState } from "react";
import {
  fetchRecharge,
  fetchVNPayReturn,
  fetchBalance,
  fetchWalletHistory,
} from "../../data/api"; // Import the functions
import { toast } from "react-hot-toast"; // Import toast
import { useLocation, useNavigate } from "react-router-dom";

export function MyWallet() {
  const [balance, setBalance] = useState(0); // Initial balance
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const token = sessionStorage.getItem("token"); // Get the token from session storage
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await fetchWalletHistory(token);
        const sortedData = data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        setTransactions(sortedData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [token, location.state, balance]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const handleInputChange = (e) => {
    let value = e.target.value.replace(/,/g, ""); // Remove commas for clean input

    // Check if it's a valid number or empty, allowing for decimal input
    if (!isNaN(value) || value === "") {
      setAmount(value); // Update state with the raw number (without commas)
    }
  };

  // Format the input value with commas
  const formatWithCommas = (num) => {
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    // Function to fetch the balance
    const getBalance = async () => {
      setBalanceLoading(true); // Set loading to true when starting the fetch
      try {
        const data = await fetchBalance(token);
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        toast.error("Failed to fetch balance");
      } finally {
        setBalanceLoading(false); // Set loading to false after fetch finishes
      }
    };
    if (balance === 0 && token) {
      getBalance();
    }
  }, [token]);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const vnpAmount = urlParams.get("vnp_Amount");
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    if (vnpAmount && vnpResponseCode) {
      const fetchPaymentReturn = async () => {
        try {
          setBalanceLoading(true);
          setProcessing(true);

          const params = Object.fromEntries(urlParams.entries());
          await fetchVNPayReturn(params, token);

          if (vnpResponseCode === "00") {
            const creditedAmount = parseFloat(vnpAmount) / 100; // Convert VNPay amount to actual

            // Update balance and transactions
            setBalance((prevBalance) => {
              const updatedBalance = prevBalance + creditedAmount;

              setTransactions((prevTransactions) => [
                ...prevTransactions,
                {
                  id: Date.now(),
                  amount: creditedAmount,
                  transactionBalance: updatedBalance,
                  transactionDate: new Date().toISOString(),
                  note: "Recharge",
                },
              ]);

              return updatedBalance;
            });

            toast.success(
              `Payment successful! Amount: ${formatCurrency(creditedAmount)}`
            );

            // Determine navigation destination
            const classId = localStorage.getItem("classId");
            if (classId) {
              localStorage.removeItem("classId");
              navigate(`/class/${classId}`, { replace: true });
            } else {
              navigate("/wallet", { replace: true });
            }
          } else {
            toast.error("Payment failed or canceled!");
          }
        } catch (error) {
          console.error("Error fetching payment return:", error);
          toast.error("An error occurred while processing the payment.");
        } finally {
          setBalanceLoading(false);
          setProcessing(false);
        }
      };

      fetchPaymentReturn();
    } else {
      setProcessing(false);
    }
  }, [
    location.search,
    token,
    navigate,
    setBalance,
    setTransactions,
    setBalanceLoading,
  ]);
  if (processing) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }
  const SpinnerOverlay = () => {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  };

  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleRecharge = async () => {
    if (amount <= 0) {
      setErrorMessage("Amount must be larger than 0.");
      return;
    }
    setErrorMessage("");
    try {
      const data = await fetchRecharge(amount, token);
      console.log("Recharge data:", data);

      window.open(data.paymentUrl, "_self");
    } catch (error) {
      console.error("Recharge failed:", error);
      toast.error("Failed to initiate recharge. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${wallet})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto p-4 max-w-4xl bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          My Wallet
        </h1>
        <Card className="mb-6 shadow-md dark:bg-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Current Balance
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your available funds
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {balanceLoading ? (
              <SpinnerOverlay />
            ) : (
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(balance)}
              </p>
            )}
          </CardContent>
        </Card>
        <Tabs defaultValue="add-funds" className="mb-6">
          <TabsList className="flex w-full">
            <TabsTrigger
              value="add-funds"
              className="flex-grow w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
            >
              Add Funds
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add-funds">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Add Funds to Your Wallet
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Choose an amount to add to your balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="amount"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="text" // Use "text" instead of "number" to allow formatting with commas
                    placeholder="Enter amount"
                    value={formatWithCommas(amount)} // Display the formatted value
                    onChange={handleInputChange} // Handle input changes
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  {errorMessage && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
                  onClick={handleRecharge} // Call handleRecharge on button click
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Card>
          {transactions.length > 0 && (
            <>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your latest wallet activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {transactions.slice(0, 3).map((transaction, index) => {
                    const isCredit = transaction.amount >= 0;
                    const formattedAmount = Math.abs(transaction.amount);

                    return (
                      <li
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-2 dark:border-gray-600"
                      >
                        <div className="flex items-center">
                          {isCredit ? (
                            <ArrowUpRight className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
                          ) : (
                            <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500 dark:text-red-400" />
                          )}
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {formatTransactionDate(
                                transaction.transactionDate
                              )}{" "}
                              {/* Display formatted date */}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Transaction ID: {index + 1}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Type: {transaction.note} {/* Display the note */}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p
                            className={`font-medium ${
                              isCredit ? "text-green-500" : "text-red-500"
                            } dark:text-green-400`}
                          >
                            {isCredit ? "+ " : "- "}
                            {formatCurrency(formattedAmount)}
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">
                            New Balance:{" "}
                            {formatCurrency(transaction.transactionBalance)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              {transactions.length > 3 && (
                <CardFooter>
                  <Button
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-200"
                    onClick={() => navigate("/all-transactions")} // Navigate to all transactions
                  >
                    Show All Transactions
                  </Button>
                </CardFooter>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
