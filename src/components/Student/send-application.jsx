import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, User, FileText, Send } from "lucide-react";
import { submitOther, submitWithdrawal } from "@/data/api";
import toast from "react-hot-toast";
import { useWallet } from "@/context/WalletContext";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export function SendApplication() {
  const banks = [
    "ABBANK",
    "ACB",
    "Agribank",
    "ANZVL",
    "BAOVIET Bank",
    "Bac A Bank",
    "BIDV",
    "CB",
    "CIMB",
    "Co-opBank",
    "DongA Bank",
    "Eximbank",
    "GPBank",
    "HDBank",
    "HLBVN",
    "HSBC",
    "IVB",
    "Kienlongbank",
    "LienVietPostBank",
    "MBBANK",
    "MSB",
    "Nam A Bank",
    "NCB",
    "OceanBank",
    "OCB",
    "PBVN",
    "PG Bank",
    "PVcomBank",
    "Sacombank",
    "SAIGONBANK",
    "SCB",
    "SCBVL",
    "SeABank",
    "SHB",
    "SHBVN",
    "Techcombank",
    "TPBank",
    "UOB",
    "VDB",
    "VIB",
    "VietABank",
    "Vietbank",
    "Viet Capital Bank",
    "Vietcombank",
    "VietinBank",
    "VPBank",
    "VRB",
    "Woori",
  ];
  const { balance, loadBalance } = useWallet();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate(); // For navigation to "/wallet"
  const [showModal, setShowModal] = useState(false);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    if (token) {
      loadBalance(token);
    }
  }, [token, loadBalance]);
  const [updatedBalance, setUpdatedBalance] = useState(balance);
  const [withdrawalData, setWithdrawalData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bank: "",
    amount: null,
    applicationTypeId: 1,
  });
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();

    const calculatedNewBalance = balance - withdrawalData.amount;
    setUpdatedBalance(calculatedNewBalance);

    // Open the confirmation modal
    setShowModal(true);
  };
  const formatWithCommas = (num) => {
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas to the number string
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Remove commas to keep the raw value clean for the state
    let rawValue = value.replace(/,/g, "");

    // Ensure only valid numbers or empty string
    if (!isNaN(rawValue) || rawValue === "") {
      // Update the state with the raw value (without commas)
      setWithdrawalData((prev) => ({
        ...prev,
        [name]: rawValue,
      }));
    }
  };

  const [otherRequestData, setOtherRequestData] = useState({
    studentName: "",
    studentRollNo: "",
    reason: "",
    applicationTypeId: 2,
  });

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountHolderName") {
      // Capitalize the account holder name
      setWithdrawalData((prev) => ({
        ...prev,
        accountHolderName: value.toUpperCase(),
      }));
    } else if (name === "accountNumber") {
      // Validate the account number length
      setWithdrawalData((prev) => ({ ...prev, accountNumber: value }));
    } else {
      setWithdrawalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOtherRequestChange = (e) => {
    const { name, value } = e.target;
    setOtherRequestData((prev) => ({ ...prev, [name]: value }));
  };
  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedData = localStorage.getItem("result");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setRole(parsedData.role);
    }
  }, []);
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

    return result.trim();
  };
  const handleConfirmWithdrawal = async () => {
    setShowModal(false); // Close the modal

    if (
      withdrawalData.accountNumber.length < 8 ||
      withdrawalData.accountNumber.length > 15
    ) {
      toast.error("Account number must be between 8 and 15 digits.");
      return;
    }

    if (withdrawalData.amount < 50000) {
      toast.error("Amount must be higher or equal than 50,000đ");
      return;
    }

    try {
      const response = await submitWithdrawal(withdrawalData, token);
      console.log(response);
      if (response) {
        loadBalance(token);
        toast.success(
          "Withdrawal application submitted successfully!\nNew balance: " +
            formatCurrency(updatedBalance)
        );
        setWithdrawalData({
          accountHolderName: "",
          accountNumber: "",
          bank: "",
          amount: null,
          applicationTypeId: 1,
        });
      }
    } catch (error) {
      if (error.response && typeof error.response.data === "string") {
        const errorMessage = error.response.data;

        if (errorMessage.includes("Số dư không đủ để rút tiền")) {
          toast.error("Your current balance is not enough to withdraw money");
        } else {
          toast.error("An error occurred while processing the withdrawal.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  const handleCancel = () => {
    setShowModal(false); // Close the modal if No is clicked
  };

  const handleOtherRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitOther(otherRequestData, token);
      console.log("Other Application Submitted:", response);
      toast.success("Other application submitted successfully!");
      setOtherRequestData({
        studentName: "",
        studentRollNo: "",
        reason: "",
        applicationTypeId: 2,
      });
    } catch (error) {
      console.error("Error submitting other request:", error);
      toast.error("Failed to submit other application.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Send Application</h1>
      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="withdraw">Withdraw Application</TabsTrigger>
          <TabsTrigger value="other">Other Application</TabsTrigger>
        </TabsList>
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Application</CardTitle>
              <CardDescription>
                Submit a request to withdraw funds from your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdrawalSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">
                    <User className="w-4 h-4 inline-block mr-2" />
                    Account Holder Name
                  </Label>
                  <Input
                    id="accountHolderName"
                    name="accountHolderName"
                    value={withdrawalData.accountHolderName}
                    onChange={handleWithdrawalChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    <CreditCard className="w-4 h-4 inline-block mr-2" />
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={withdrawalData.accountNumber}
                    onChange={handleWithdrawalChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <select
                    id="bank"
                    name="bank"
                    value={withdrawalData.bank}
                    onChange={handleWithdrawalChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="" disabled>
                      Select a bank
                    </option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    <DollarSign className="w-4 h-4 inline-block mr-2" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    value={formatWithCommas(withdrawalData.amount)}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {withdrawalData.amount && (
                  <p className="text-gray-600 text-sm">
                    {formatAmount(withdrawalData.amount)}{" "}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Withdrawal Application
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Modal for confirming withdrawal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                {updatedBalance < 0 ? (
                  // When balance is negative, show the "X" icon and "Deposit now" button
                  <div className="text-center text-red-500">
                    <FaTimesCircle className="text-red-500 w-12 h-12 mb-4 mx-auto" />{" "}
                    {/* Center the X icon */}
                    <p>
                      Your current balance is not enough to withdraw this
                      amount.
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => navigate("/wallet")}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Deposit now
                      </button>
                      <button
                        onClick={handleCancel} // Close modal action
                        className="py-2 px-4 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  // When balance is sufficient, show the confirmation message with "Yes" and "No" buttons
                  <>
                    <div className="flex justify-center mb-4">
                      <FaCheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                    <h2 className="text-xl font-semibold text-center mb-4">
                      Are you sure you want to submit the withdrawal request?
                    </h2>
                    <div className="text-center text-green-600">
                      <p>New Balance: {formatCurrency(updatedBalance)}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handleConfirmWithdrawal}
                        className="py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform duration-200 transform hover:scale-105 px-6"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400 transition-transform duration-200 transform hover:scale-105 px-6"
                      >
                        No
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Other Application</CardTitle>
              <CardDescription>
                Submit a request for other purposes.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleOtherRequestSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">
                    <User className="w-4 h-4 inline-block mr-2" />
                    Name
                  </Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={otherRequestData.studentName}
                    onChange={handleOtherRequestChange}
                    required
                  />
                </div>
                {role != "TEACHER" && (
                  <div className="space-y-2">
                    <Label htmlFor="studentRollNo">
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      Student Roll Number
                    </Label>
                    <Input
                      id="studentRollNo"
                      name="studentRollNo"
                      value={otherRequestData.studentRollNo}
                      onChange={handleOtherRequestChange}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Application</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={otherRequestData.reason}
                    onChange={handleOtherRequestChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Other Application
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
