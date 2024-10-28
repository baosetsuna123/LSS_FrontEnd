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
  const [amount, setAmount] = useState(""); // Khởi tạo amount là chuỗi rỗng
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  const token = sessionStorage.getItem("token"); // Get the token from session storage
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
  }, [token, location.state, transactions]);
  // Hàm định dạng số tiền sang tiền Việt Nam
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
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas to the number string
  };
  // Hàm chuyển đổi số thành định dạng "triệu", "nghìn", "đồng"
  const numberToWords = (num, includeZero = false, isThousandPart = false) => {
    const units = [
      "",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const tens = [
      "",
      "mười",
      "hai mươi",
      "ba mươi",
      "bốn mươi",
      "năm mươi",
      "sáu mươi",
      "bảy mươi",
      "tám mươi",
      "chín mươi",
    ];
    const hundreds = [
      "",
      "một trăm",
      "hai trăm",
      "ba trăm",
      "bốn trăm",
      "năm trăm",
      "sáu trăm",
      "bảy trăm",
      "tám trăm",
      "chín trăm",
    ];

    let result = "";

    // Handle case where number is zero but includeZero is true
    if (num === 0 && includeZero) {
      return isThousandPart ? "không trăm lẻ" : "không";
    }

    // Handle hundreds part
    const hundredPart = Math.floor(num / 100);
    const tenPart = Math.floor((num % 100) / 10);
    const unitPart = num % 10;

    // Add hundreds part
    if (hundredPart > 0) {
      result += `${hundreds[hundredPart]} `;
    }

    // Add tens part
    if (tenPart > 0) {
      result += `${tens[tenPart]} `;
    } else if (hundredPart > 0 && unitPart > 0) {
      result += "lẻ "; // Read "lẻ" when tens is 0 but there are units
    }

    // Add units part
    if (unitPart > 0) {
      if (tenPart > 0 && unitPart === 5) {
        result += "lăm "; // Read as "lăm" when unit is 5 and there are tens
      } else {
        result += `${units[unitPart]} `;
      }
    }

    return result.trim();
  };

  const formatAmount = (amount) => {
    if (amount === "" || isNaN(amount) || parseFloat(amount) < 0) return ""; // Validate input

    const num = Math.floor(parseFloat(amount)); // Round down to avoid decimals
    const billion = Math.floor(num / 1_000_000_000);
    const million = Math.floor((num % 1_000_000_000) / 1_000_000);
    const thousand = Math.floor((num % 1_000_000) / 1_000);
    const remainder = Math.floor(num % 1_000);

    let result = "";

    // Handle billions
    if (billion > 0) {
      result += `${numberToWords(billion)} tỷ `;
    }

    // Handle millions
    if (million > 0) {
      result += `${numberToWords(million)} triệu `;
    } else if (billion > 0 && thousand > 0) {
      result += "không trăm lẻ "; // Add "không trăm lẻ" if millions are 0 but there are thousands
    }

    // Handle thousands
    if (thousand > 0) {
      result += `${numberToWords(thousand)} nghìn `;
    } else if ((billion > 0 || million > 0) && remainder > 0) {
      result += "không trăm lẻ "; // Add "không trăm lẻ" if there's billion/million but no thousands
    }

    // Handle remainder (less than 1000)
    if (remainder > 0 || result === "") {
      // Ensure "đồng" is added even for amounts less than 1000
      result += `${numberToWords(remainder, true)} đồng`;
    } else {
      result = result.trim() + " đồng"; // Ensure "đồng" is added if there are no remainder
    }

    return result.trim(); // Remove extra spaces
  };

  // Hàm để lấy số dư
  useEffect(() => {
    // Hàm để lấy số dư
    const getBalance = async () => {
      try {
        const data = await fetchBalance(token); // Gọi hàm fetchBalance
        setBalance(data.balance); // Cập nhật số dư từ dữ liệu trả về
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
  const handleRecharge = async () => {
    if (amount <= 0) {
      setErrorMessage("Số tiền phải lớn hơn 0."); // Hiển thị thông báo lỗi
      return;
    }
    setErrorMessage(""); // Xóa thông báo lỗi nếu hợp lệ
    try {
      const data = await fetchRecharge(amount, token);
      console.log("Recharge data:", data);
      const newTransaction = {
        id: Date.now(), // Use current timestamp as a temporary ID
        amount: amount, // Amount credited (positive value)
        transactionBalance: balance + amount, // New balance after credit
        transactionDate: new Date().toISOString(), // Current date/time
      };

      // Update transactions state
      setTransactions((prev) => [...prev, newTransaction]);
      window.open(data.paymentUrl, "_self"); // Mở trang thanh toán VNPay
    } catch (error) {
      console.error("Recharge failed:", error);
    }
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
              {formatCurrency(balance)} {/* Hiển thị số dư đã định dạng */}
            </p>
          </CardContent>
        </Card>
        <Tabs defaultValue="add-funds" className="mb-6">
          <TabsList className="flex w-full">
            <TabsTrigger
              value="add-funds"
              className="flex-grow w-full hover:bg-gray-200 transition duration-200"
            >
              Add Funds
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add-funds">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds to Your Wallet</CardTitle>
                <CardDescription>
                  Choose an amount to add to your balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="text" // Use "text" instead of "number" to allow formatting with commas
                    placeholder="Enter amount"
                    value={formatWithCommas(amount)} // Display the formatted value
                    onChange={handleInputChange} // Handle input changes
                  />
                  {amount && (
                    <p className="text-gray-600 text-sm">
                      {formatAmount(amount)} {/* Hiển thị định dạng tiền */}
                    </p>
                  )}
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p> // Hiển thị thông báo lỗi
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
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
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {transactions.slice(0, 3).map((transaction) => {
                const isCredit = transaction.amount >= 0; // If amount is positive or zero, it's credit
                const formattedAmount = Math.abs(transaction.amount); // Use absolute value for display

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
                          {formatTransactionDate(transaction.transactionDate)}{" "}
                          {/* Display formatted date */}
                        </p>
                        <p className="text-xs text-gray-400">
                          Transaction ID: {transaction.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p
                        className={`font-medium ${
                          isCredit ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isCredit ? "+" : "-"}${formatCurrency(formattedAmount)}
                      </p>
                      <p className="text-sm text-gray-400">
                        New Balance: $
                        {formatCurrency(transaction.transactionBalance)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              onClick={() => navigate("/all-transactions")} // Navigate to all transactions
            >
              Show All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
