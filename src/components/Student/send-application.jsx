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
import {
  CreditCard,
  DollarSign,
  User,
  Send,
  Landmark,
  File,
} from "lucide-react";
import { submitOther, submitWithdrawal } from "@/data/api";
import toast from "react-hot-toast";
import { useWallet } from "@/context/WalletContext";
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
  const [showModal, setShowModal] = useState(false);
  const [loadingwd, setLoadingwd] = useState(false);
  const [loadingother, setLoadingother] = useState(false);
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

  const handleConfirmWithdrawal = async () => {
    try {
      setLoadingwd(true);
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
        setShowModal(false);
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
    } finally {
      setLoadingwd(false);
    }
  };
  const handleCancel = () => {
    setShowModal(false); // Close the modal if No is clicked
  };

  const handleOtherRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingother(true);
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
    } finally {
      setLoadingother(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Send Application
      </h1>
      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="withdraw"
            className="text-gray-900 dark:text-white"
          >
            Withdraw Application
          </TabsTrigger>
          <TabsTrigger value="other" className="text-gray-900 dark:text-white">
            Other Application
          </TabsTrigger>
        </TabsList>
        <TabsContent value="withdraw">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Withdraw Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Submit a request to withdraw funds from your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdrawalSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="accountHolderName"
                    className="text-gray-900 dark:text-white"
                  >
                    <User className="w-4 h-4 inline-block mr-2" />
                    Account Holder Name
                  </Label>
                  <Input
                    id="accountHolderName"
                    name="accountHolderName"
                    value={withdrawalData.accountHolderName}
                    onChange={handleWithdrawalChange}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="accountNumber"
                    className="text-gray-900 dark:text-white"
                  >
                    <CreditCard className="w-4 h-4 inline-block mr-2" />
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={withdrawalData.accountNumber}
                    onChange={handleWithdrawalChange}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bank"
                    className="text-gray-900 dark:text-white"
                  >
                    <Landmark className="w-4 h-4 inline-block mr-2" />
                    Bank
                  </Label>
                  <select
                    id="bank"
                    name="bank"
                    value={withdrawalData.bank}
                    onChange={handleWithdrawalChange}
                    required
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  <Label
                    htmlFor="amount"
                    className="text-gray-900 dark:text-white"
                  >
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
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 dark:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Withdrawal Application
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Modal for confirming withdrawal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
                {updatedBalance < 0 ? (
                  // When balance is negative, show the "X" icon and "Deposit now" button
                  <div className="text-center text-red-500">
                    <FaTimesCircle className="text-red-500 w-12 h-12 mb-4 mx-auto" />
                    <p>
                      Your current balance is not enough to withdraw this
                      amount.
                    </p>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleCancel}
                        className="py-2 px-4 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                ) : (
                  // When balance is sufficient, show the confirmation message with "Yes" and "No" buttons
                  <>
                    <div className="flex justify-center mb-4">
                      <FaCheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
                      Are you sure you want to submit the withdrawal request?
                    </h2>
                    <div className="text-center text-green-600">
                      <p>New Balance: {formatCurrency(updatedBalance)}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handleConfirmWithdrawal}
                        disabled={loadingwd}
                        className="py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform duration-200 transform hover:scale-105 px-6"
                      >
                        {loadingwd ? "Loading..." : "Yes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loadingwd}
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
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Other Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Submit a request for other purposes.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleOtherRequestSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="studentName"
                    className="text-gray-900 dark:text-white"
                  >
                    <User className="w-4 h-4 inline-block mr-2" />
                    Name
                  </Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={otherRequestData.studentName}
                    onChange={handleOtherRequestChange}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="reason"
                    className="text-gray-900 dark:text-white"
                  >
                    <File className="w-4 h-4 inline-block mr-2" />
                    Reason for Application
                  </Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={otherRequestData.reason}
                    onChange={handleOtherRequestChange}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loadingother}
                  className="w-full bg-blue-500 dark:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loadingother ? "Submitting..." : "Submit Other Application"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
