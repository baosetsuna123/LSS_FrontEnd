import { useState } from "react";
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

export function SendApplication() {
  const [withdrawalData, setWithdrawalData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bank: "",
    amount: 0,
    applicationTypeId: 1,
  });
  const token = sessionStorage.getItem("token");
  const [otherRequestData, setOtherRequestData] = useState({
    studentName: "",
    studentRollNo: "",
    reason: "",
    applicationTypeId: 2,
  });

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtherRequestChange = (e) => {
    const { name, value } = e.target;
    setOtherRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitWithdrawal(withdrawalData, token);
      console.log("Withdrawal Application Submitted:", response);
      toast.success("Withdrawal application submitted successfully!");
      setWithdrawalData({
        accountHolderName: "",
        accountNumber: "",
        bank: "",
        amount: 0,
        applicationTypeId: 1,
      });
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      alert("Failed to submit withdrawal application.");
    }
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
      alert("Failed to submit other application.");
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
                  <Input
                    id="bank"
                    name="bank"
                    value={withdrawalData.bank}
                    onChange={handleWithdrawalChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    <DollarSign className="w-4 h-4 inline-block mr-2" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={withdrawalData.amount}
                    onChange={handleWithdrawalChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Withdrawal Application
                </Button>
              </CardFooter>
            </form>
          </Card>
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
                    Student Name
                  </Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={otherRequestData.studentName}
                    onChange={handleOtherRequestChange}
                    required
                  />
                </div>
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
