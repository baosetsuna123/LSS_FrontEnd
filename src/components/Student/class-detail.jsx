import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Code,
  Coins,
  User,
  AlertCircle,
  Users,
  UserCheck,
  TvMinimalPlay,
  School,
  BookA,
} from "lucide-react"; // Icon for the modal header
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClassbyID, fetchCreateOrder } from "@/data/api"; // Assume createOrder is the API to create an order
import Breadcrumb from "../Home/Breadcrumb";
import toast from "react-hot-toast";
import { useWallet } from "@/context/WalletContext";
import defaults from "../../assets/default.jfif";
import avatar from "../../assets/avatar.png";
import { FaFileAlt } from "react-icons/fa";
import EnhancedScheduleTable from "./EnhancedScheduleTable";

// Modal Component for Confirmation

export function ClassDetail() {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false); // State for enrollment status
  const token = sessionStorage.getItem("token");
  const [, setIsProcessing] = useState(false);
  const { balance, loadBalance } = useWallet();
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const navigate = useNavigate();
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
      <div className="fixed inset-0 flex items-center w-auto justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg  w-auto">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirm class participation
            </h2>
          </div>

          {newBalance < 0 ? (
            <div>
              <p className="text-red-500 dark:text-red-400 mb-4">
                Your current balance is not enough.
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    localStorage.setItem("classId", classDetail.classId);
                    navigate("/wallet");
                  }}
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  Deposit now
                </button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-400 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900 px-6 py-3"
                >
                  Got it
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-700 whitespace-nowrap dark:text-gray-300">
                You agree to participate in this lesson with price{" "}
                {formatCurrency(classDetail?.price)}?
              </p>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                New balance: {formatCurrency(newBalance)}
              </p>
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={onConfirm}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500 px-10 py-3 text-lg"
                  disabled={loading} // Disable button when loading is true
                >
                  {loading ? "Processing..." : "Yes"}{" "}
                  {/* Change text when loading */}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-red-500 text-red-500 hover:bg-red-100 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900 px-6 py-3 text-lg"
                  disabled={loading} // Disable button when loading is true
                >
                  No
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
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
  const handleNavigate = (documents) => {
    navigate(`/class/${id}/documents`, {
      state: { documents, classId: classDetail.classId },
    });
  };
  const fetchClassDetail = async (id, token) => {
    try {
      setLoadingAll(true);
      const response = await fetchClassbyID(id, token);
      setClassDetail(response);
      console.log("Class Detail:", response);

      const storedResult = localStorage.getItem("result");
      const currentUserName = storedResult
        ? JSON.parse(storedResult).username
        : null;
      const isUserEnrolled = response?.students?.some(
        (student) => student.userName === currentUserName
      );
      setIsEnrolled(isUserEnrolled); // Set enrollment status
      setTimeout(() => {
        setLoadingAll(false); // Hide spinner after 1 second (or when data is fetched)
      }, 1000);
    } catch (error) {
      console.error("Error fetching class detail:", error);
    }
  };
  useEffect(() => {
    if (id && token) {
      fetchClassDetail(id, token);
    }
  }, [id, token]);
  const SpinnerOverlay = () => {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-16 w-16 mt-36 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  };
  if (loadingAll) {
    return <SpinnerOverlay />;
  }

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
    setLoading(true);
    try {
      // Simulate order creation
      setIsProcessing(true);
      await fetchCreateOrder(id, token);
      toast.success("Order Lesson Successfully!");
      setIsEnrolled(true);

      // Get current user info from local storage
      const storedResult = localStorage.getItem("result");
      const currentUser = storedResult ? JSON.parse(storedResult) : null;

      if (currentUser) {
        // Update the students array locally
        setClassDetail((prevDetail) => ({
          ...prevDetail,
          students: [
            ...prevDetail.students,
            {
              userName: currentUser.username,
              phoneNumber: currentUser.phoneNumber,
              email: currentUser.email,
              fullName: currentUser.fullName,
              address: currentUser.address,
            },
          ],
        }));
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Failed to create order";
        console.log(errorMessage);

        if (errorMessage === "User has already registered for this schedule.") {
          toast.error("You have already registered a lesson with this time.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("No response received from the server.");
      } else {
        toast.error(error.message || "Failed to create order");
      }
    } finally {
      setIsProcessing(false);
      setModalOpen(false);
      setLoading(false);
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
              { label: "Lesson", link: "/class" },
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
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                    } text-white`}
                    onClick={handleEnrollClick}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll Now"}
                  </Button>
                </div>
                {isEnrolled && (
                  <div className="flex ml-20 items-center text-center justify-between mt-20">
                    <button
                      onClick={() => handleNavigate(classDetail?.documents)}
                      className="text-2xl font-bold text-orange-600 dark:text-green-400 flex items-center"
                    >
                      <FaFileAlt className="mr-2" /> {/* Icon */}
                      View Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-6 mt-10">
              {/* Description Card */}
              <Card className="bg-gray-50 border border-gray-200 shadow-md dark:bg-gray-700 dark:border-gray-600 w-full">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                  <CardTitle className="text-lg text-center font-bold flex items-center justify-center">
                    <TvMinimalPlay className="mr-2 h-6 w-6" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p
                    className="text-gray-600 leading-relaxed dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: classDetail?.description?.replace(
                        /\n/g,
                        "<br />"
                      ),
                    }}
                  />
                </CardContent>
              </Card>

              {/* Schedule Details Card */}
              <EnhancedScheduleTable
                classDetail={classDetail}
                getSlotTime={getSlotTime}
              />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-50 border border-gray-200 shadow-md dark:bg-gray-700 dark:border-gray-600">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                  <CardTitle className="text-lg text-center font-bold flex items-center justify-center">
                    <School className="mr-2 h-6 w-6" />
                    Class
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
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
                    <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Students Joined: {classDetail?.students?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border border-gray-200 shadow-md dark:bg-gray-700 dark:border-gray-600">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg p-4">
                  <CardTitle className="text-lg text-center flex items-center justify-center font-bold">
                    <BookA className="mr-2 h-6 w-6" />
                    Tutor
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Tutor Name: {classDetail?.fullName}
                    </span>
                  </div>
                  {classDetail?.imageTeacher ? (
                    <div className="mt-7 flex justify-center items-center relative">
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
                        src={avatar}
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
              <span>Duration: 2 hours 15 minutes / Slot</span>
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
