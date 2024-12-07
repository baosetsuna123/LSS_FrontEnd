import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, LogOut } from "lucide-react";
import { fetchWalletHistory } from "@/data/api";
import { toast } from "react-hot-toast"; // Ensure you have this import for the toast

export function WalletHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchWalletHistory(token);
        console.log("Transactions:", data);
        const sortedData = data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );

        setTransactions(sortedData);
        setFilteredTransactions(sortedData); // Set initial filtered transactions
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filterTransactions = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be greater than end date.");
      return;
    }

    let filtered = transactions;

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) >= new Date(startDate)
      );
    }

    // Filter by end date
    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); // Set time to end of the day

      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) <= adjustedEndDate
      );
    }

    // Filter by transaction type
    if (transactionType !== "all") {
      filtered = filtered.filter((t) =>
        transactionType === "credit" ? t.amount >= 0 : t.amount < 0
      );
    }

    // Update the state with filtered transactions
    setFilteredTransactions(filtered);
  };

  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setTransactionType("all");
    fetchWalletHistory(token).then((data) => {
      setTransactions(data);
      setFilteredTransactions(data); // Reset filtered transactions
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Wallet History
        </h1>
        <Button
          onClick={() => navigate("/wallet")}
          className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Back to Wallet
        </Button>
      </div>
      <Card className="mb-6 bg-white dark:bg-gray-800">
        <CardHeader className="flex justify-between items-center w-full">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filter Transactions
            </CardTitle>
          </div>
          <div className="flex-none">
            <Button
              onClick={clearFilters}
              className="bg-red-600 text-white hover:bg-red-700 transition duration-200"
            >
              Clear All Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Start Date
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              End Date
            </label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="transaction-type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Transaction Type
            </label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger id="transaction-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Button
              onClick={filterTransactions}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? ( // Show spinner or loading message while loading
            <div className="flex items-center justify-center h-48">
              <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              <p className="text-lg text-gray-600 font-semibold ml-4">
                Loading...
              </p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-lg text-red-500 font-semibold">No Data</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredTransactions.map((transaction, index) => {
                const isCredit = transaction.amount >= 0;
                const formattedAmount = Math.abs(transaction.amount);
                const transactionDate = formatTransactionDate(
                  transaction.transactionDate
                );

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
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {transactionDate}
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
                        }`}
                      >
                        {isCredit ? "+" : "-"}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
