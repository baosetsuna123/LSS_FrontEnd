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
import { fetchRecharge, fetchVNPayReturn, fetchBalance } from "../../data/api"; // Import the functions
import { toast } from "react-hot-toast"; // Import toast
import { useLocation, useNavigate } from "react-router-dom";

export function MyWallet() {
  const [balance, setBalance] = useState(0); // Initial balance
  const [amount, setAmount] = useState(""); // Khởi tạo amount là chuỗi rỗng
  const [transactions] = useState([
    {
      id: 1,
      type: "credit",
      amount: 50,
      description: "Added funds",
      date: "2023-06-15",
    },
    {
      id: 2,
      type: "debit",
      amount: 15.5,
      description: "Cafeteria payment",
      date: "2023-06-14",
    },
    {
      id: 3,
      type: "debit",
      amount: 25,
      description: "Library fine",
      date: "2023-06-12",
    },
    {
      id: 4,
      type: "credit",
      amount: 100,
      description: "Scholarship credit",
      date: "2023-06-10",
    },
  ]);
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  const token = sessionStorage.getItem("token"); // Get the token from session storage
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm định dạng số tiền sang tiền Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm chuyển đổi số thành định dạng "triệu", "nghìn", "đồng"
  const formatAmount = (amount) => {
    if (amount === "") return ""; // Trả về chuỗi rỗng nếu không có giá trị
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) return ""; // Trả về chuỗi rỗng nếu giá trị không hợp lệ

    const million = Math.floor(num / 1_000_000);
    const thousand = Math.floor((num % 1_000_000) / 1_000);
    const remainder = Math.floor(num % 1_000);

    let result = "";
    if (million > 0) {
      result += `${million} triệu `;
    }
    if (thousand > 0) {
      result += `${thousand} nghìn `;
    }
    if (remainder > 0) {
      result += `${remainder} đồng`;
    }

    return result.trim(); // Trả về kết quả đã định dạng
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

  const handleRecharge = async () => {
    if (amount <= 0) {
      setErrorMessage("Số tiền phải lớn hơn 0."); // Hiển thị thông báo lỗi
      return;
    }
    setErrorMessage(""); // Xóa thông báo lỗi nếu hợp lệ
    try {
      const data = await fetchRecharge(amount, token);
      console.log("Recharge data:", data);
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
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} // Giữ nguyên giá trị là chuỗi
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
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center">
                    {transaction.type === "credit" ? (
                      <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${
                      transaction.type === "credit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}$
                    {formatCurrency(transaction.amount)}{" "}
                    {/* Hiển thị số tiền đã định dạng */}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
