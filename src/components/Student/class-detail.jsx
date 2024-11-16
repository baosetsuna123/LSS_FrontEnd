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
  Users,
  UserCheck,
  ChevronsLeftRightEllipsis,
} from "lucide-react"; // Icon for the modal header
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClassbyID, fetchCreateOrder } from "@/data/api"; // Assume createOrder is the API to create an order
import Breadcrumb from "../Home/Breadcrumb";
import toast from "react-hot-toast";
import { useWallet } from "@/context/WalletContext";
import defaults from "../../assets/default.jfif";
import misasa from "../../assets/misasa.jfif";

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
  const handleTeacherClick = () => {
    if (classDetail && classDetail.teacherName) {
      navigate(`/profile/${encodeURIComponent(classDetail.teacherName)}`, {
        state: { classId: classDetail.classId },
      });
    }
  };
  // Confirmation Modal
  function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">
              Confirm class participation
            </h2>
          </div>

          {newBalance < 0 ? (
            <div className="flex justify-between items-center mb-6">
              <p className="text-red-500">
                Your current balance is not enough.
              </p>
              <button
                onClick={() => navigate("/wallet")}
                className="text-blue-500 hover:underline"
              >
                Deposit now
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6">
                You agree to participate in this class with price{" "}
                {formatCurrency(classDetail?.price)}?
              </p>
              <p className="mb-6">New balance: {formatCurrency(newBalance)}</p>
            </>
          )}

          <div className="flex justify-between space-x-4">
            <Button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 px-10 py-3 text-lg"
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-red-500 text-red-500 hover:bg-red-100 px-6 py-3 text-lg"
            >
              No
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const getDayOfWeek = (dayOfWeek) => {
    const days = {
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
      8: "Sunday",
    };
    return days[dayOfWeek] || "Unknown Day";
  };
  const getSlotTime = (slotId) => {
    const slots = {
      1: "1 (7h00 - 9h15)",
      2: "2 (9h30 - 11h45)",
      3: "3 (12h30 - 14h45)",
      4: "4 (15h00 - 17h15)",
      5: "5 (17h45 - 20h00)",
    };
    return slots[slotId] || "Unknown Slot";
  };
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
  const navigate = useNavigate();

  const handleConfirmEnroll = async () => {
    // Close the modal and create the order
    try {
      setIsProcessing(true);
      await fetchCreateOrder(id, token);
      toast.success("Order Class Successfully!");
      setIsEnrolled(true);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Failed to create order";
        console.log(errorMessage);

        if (errorMessage === "User has already registered for this schedule.") {
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
          navigate("/wallet");
        }
      } else if (error.request) {
        toast.error("No response received from the server.");
      } else {
        toast.error(error.message || "Failed to create order");
      }
    } finally {
      setIsProcessing(false);
      setModalOpen(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEnroll}
      />

      <section className="w-full py-4 dark:bg-gray-800 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Class", link: "/class" },
              { label: "Detail" },
            ]}
          />
        </div>
      </section>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="shadow-lg border rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 bg-white dark:bg-gray-900 rounded-t-lg">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={classDetail?.imageUrl || defaults}
                  alt={classDetail?.name}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200 shadow-md dark:border-gray-600"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {classDetail?.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Class Code:{" "}
                  <span className="font-semibold">{classDetail?.code}</span>
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Course Code:{" "}
                  <span className="font-semibold">
                    {classDetail?.courseCode}
                  </span>
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(classDetail?.price)}
                  </p>
                  <Button
                    className={`px-6 py-2 font-semibold rounded-lg ${
                      isEnrolled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    onClick={handleEnrollClick}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll Now"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                {classDetail?.description}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-50 border border-gray-200 shadow-md dark:bg-gray-700 dark:border-gray-600">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                  <CardTitle className="text-lg">Class Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Start Date: {classDetail?.startDate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Day of Week: {getDayOfWeek(classDetail?.dayOfWeek)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Course Code: {classDetail?.courseCode}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Max Students: {classDetail?.maxStudents}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ChevronsLeftRightEllipsis className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Slot: {getSlotTime(classDetail?.slotId)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Students Joined: {classDetail?.students?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border border-gray-200 shadow-md dark:bg-gray-700 dark:border-gray-600">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                  <CardTitle className="text-lg">Instructor</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Instructor Name: {classDetail?.fullName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                    <span
                      className="text-gray-700 dark:text-gray-300"
                      onClick={handleTeacherClick}
                    >
                      Teacher Username: {classDetail?.teacherName}
                    </span>
                  </div>
                  {classDetail?.imageTeacher ? (
                    <div className="mt-4 flex justify-center items-center relative">
                      <img
                        src={classDetail?.imageTeacher}
                        alt={`Instructor: ${classDetail?.fullName}`}
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                        onClick={handleTeacherClick}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 flex justify-center items-center relative">
                      <img
                        src={misasa}
                        alt={`Instructor: ${classDetail?.fullName}`}
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                        onClick={handleTeacherClick}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <span>Duration: 2 hours 15 minutes</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Coins className="mr-2 h-5 w-5 text-blue-600" />
              <span>Price: {formatCurrency(classDetail?.price)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
