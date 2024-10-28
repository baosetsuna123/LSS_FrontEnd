import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Code,
  Coins,
  GraduationCap,
  User,
  AlertCircle,
  MapPin,
  Users,
  UserCheck,
} from "lucide-react"; // Icon for the modal header
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClassbyID, fetchCreateOrder } from "@/data/api"; // Assume createOrder is the API to create an order
import Breadcrumb from "../Home/Breadcrumb";
import toast from "react-hot-toast";
import { useWallet } from "@/context/WalletContext";

// Modal Component for Confirmation

export function ClassDetail() {
  const { id } = useParams(); // Get the class id from the URL
  const [classDetail, setClassDetail] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // State for controlling modal visibility
  const [isEnrolled, setIsEnrolled] = useState(false); // State for enrollment status
  const token = sessionStorage.getItem("token");
  const [, setIsProcessing] = useState(false);
  const { balance, loadBalance } = useWallet();
  useEffect(() => {
    if (token) {
      loadBalance(token);
    }
  }, [token, loadBalance]);
  const newBalance = balance - classDetail?.price;
  // Confirmation Modal
  function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">Xác nhận tham gia lớp học</h2>
          </div>
          <p className="mb-6">
            Bạn đồng ý tham gia vào lớp học này với giá{" "}
            {formatCurrency(classDetail?.price)}?
          </p>
          <p className="mb-6">Số dư mới: {formatCurrency(newBalance)}</p>
          <div className="flex justify-between space-x-4">
            <Button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 text-lg"
            >
              Có
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-red-500 text-red-500 hover:bg-red-100 px-6 py-3 text-lg"
            >
              Không
            </Button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchClassDetail = async () => {
      const response = await fetchClassbyID(id, token); // Replace with your API
      console.log(response);
      setClassDetail(response);
      const storedResult = localStorage.getItem("result");
      const currentUserName = storedResult
        ? JSON.parse(storedResult).username
        : null;
      const isUserEnrolled = response?.students?.some(
        (student) => student.userName === currentUserName
      );
      setIsEnrolled(isUserEnrolled); // Set enrollment status
    };

    fetchClassDetail();
  }, [id, token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEnrollClick = () => {
    // Open the modal when "Enroll Now" is clicked
    setModalOpen(true);
  };

  const handleConfirmEnroll = async () => {
    // Close the modal and create the order
    try {
      setIsProcessing(true);
      const result = await fetchCreateOrder(id, token); // Call the API
      toast.success("Đăng ký lớp học thành công!");
      console.log(result);
      setIsEnrolled(true); // Update enrollment status after successful enrollment
    } catch (error) {
      alert(error.message || "Failed to create order");
    } finally {
      setIsProcessing(false);
      setModalOpen(false); // Close the modal after the process
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)} // Close modal if "Không" is clicked
        onConfirm={handleConfirmEnroll} // Trigger API call if "Có" is clicked
      />

      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Class", link: "/class" },
              { label: "Detail" }, // No link for the current page
            ]}
          />
        </div>
      </section>
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={classDetail?.imageUrl}
                  alt={classDetail?.name}
                  className="w-full rounded-lg object-cover"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl font-bold">{classDetail?.name}</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  Class Code: {classDetail?.code}
                </p>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  Course Code: {classDetail?.courseCode}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    {formatCurrency(classDetail?.price)}
                  </p>
                  <Button onClick={handleEnrollClick} disabled={isEnrolled}>
                    {isEnrolled ? "Enrolled" : "Enroll Now"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p>{classDetail?.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Class Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Start Date: {classDetail?.startDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Day of Week: {classDetail?.dayofWeek}</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="mr-2 h-4 w-4" />
                      <span>Course Code: {classDetail?.courseCode}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Max Students: {classDetail?.maxStudents}</span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="mr-2 h-4 w-4" />
                      <span>
                        Students Joined: {classDetail?.students?.length || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Instructor Name: {classDetail?.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>Teacher Username: {classDetail?.teacherName}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>
                        Location:{" "}
                        <a
                          href={classDetail?.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Join Meeting
                        </a>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Duration: 3 hours</span>
            </div>
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              <span>Price: {formatCurrency(classDetail?.price)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
