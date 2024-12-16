import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  fetchOrderClasses,
  CancelOrder,
  getOrderDetailsByOrderId,
} from "@/data/api";
import toast from "react-hot-toast";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { useWallet } from "@/context/WalletContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.png";

const statusColors = {
  COMPLETED:
    "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700",
  PENDING:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700",
  ACTIVE:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700",
  CANCELLED:
    "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700",
  ONGOING:
    "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-800 dark:text-orange-100 dark:hover:bg-orange-700",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedOrder, setSelectedOrder] = useState(null); // Order to cancel
  const [newBalance, setNewBalance] = useState(null); // New balance after cancellation
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const { balance, loadBalance } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loadBalance(token);
    }
  }, [token, loadBalance]);
  const [orderDetails, setOrderDetails] = useState(null);
  const handleShowDetails = async (order) => {
    setSelectedOrder(order);
    try {
      const data = await getOrderDetailsByOrderId(
        order.orderDTO.orderId,
        token
      );
      console.log(data);
      setOrderDetails(data.content[0]);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    }
  };
  const handleNavigate = (name) => {
    navigate(`/profile/${encodeURIComponent(name)}`, {
      state: { classId: orderDetails.classDTO.classId },
    });
  };
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchOrderClasses(token);
        const sortedData = response.data.content.sort(
          (a, b) =>
            new Date(b.classDTO.startDate) - new Date(a.classDTO.startDate)
        );
        setOrders(sortedData);
        console.log(response.data.content);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      // Cancel the order
      await CancelOrder(selectedOrder.orderDTO.orderId, token);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderDTO.orderId === selectedOrder.orderDTO.orderId
            ? { ...order, orderDTO: { ...order.orderDTO, status: "CANCELLED" } }
            : order
        )
      );
      loadBalance(token);

      const updatedBalance = balance + selectedOrder.classDTO.price;
      console.log(selectedOrder.classDTO.price, balance, updatedBalance);
      setNewBalance(updatedBalance);

      toast.success("Order canceled successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order.");
      setShowModal(false);
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.classDTO.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered orders
  const currentData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination control
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    if (selectedOrder && balance !== null) {
      const updatedBalance = balance + selectedOrder.classDTO.price;
      setNewBalance(updatedBalance);
    }
  }, [balance, selectedOrder]);

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          {/* Search Input */}
          <div className="flex items-center border rounded p-2 dark:bg-gray-700">
            <input
              type="text"
              placeholder="Search by Lesson Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm dark:text-white dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Display message if no orders */}

        {loading ? ( // Check if data is being loaded
          <div className="flex justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white pl-7">
                  Order ID
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white pl-10">
                  Start Date
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white pl-10">
                  Lesson Name
                </TableHead>
                <TableHead className="text-right text-gray-900 dark:text-white">
                  Total Price
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white pl-20">
                  Tutor Name
                </TableHead>
                <TableHead className="text-center text-gray-900 dark:text-white">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((order, index) => (
                <TableRow key={order.orderDetailId}>
                  <TableCell className="font-medium text-gray-900 dark:text-white pl-7">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white pl-10">
                    {new Date(order.classDTO.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white pl-10">
                    {order.classDTO.name}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-white">
                    {formatCurrency(order.price)}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white pl-20">
                    {order.classDTO.teacherName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`flex items-center justify-center ${
                        statusColors[order.orderDTO.status]
                      } w-24 h-8 rounded-lg`}
                    >
                      {order.orderDTO.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.orderDTO.status === "PENDING" && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 w-24"
                      >
                        Cancel
                      </button>
                    )}
                    {order.orderDTO.status === "COMPLETED" && (
                      <Button
                        onClick={() => handleShowDetails(order)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-24"
                      >
                        Detail
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300">
            No orders available.
          </div>
        )}

        {orders.length > itemsPerPage && !searchQuery && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out mr-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              <FaChevronLeft />
            </button>
            <span className="px-4 py-2 text-lg font-medium text-gray-900 dark:text-white">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out ml-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      {showDetailsModal && orderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Order Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mt-4">
              {/* Name Centered Across Both Columns */}
              <h3 className="font-bold text-center mb-4">
                {orderDetails.classDTO.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Left Column */}
                <div>
                  <p className="mb-2">
                    Course: {orderDetails.classDTO.courseCode}
                  </p>
                  <p className="mb-2">
                    StartDate:{" "}
                    {new Date(
                      orderDetails.classDTO.startDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    Price: {formatCurrency(orderDetails.price)}
                  </p>
                  <p className="mb-2">
                    Status:{" "}
                    <span className="capitalize text-green-600">
                      {orderDetails.orderDTO.status.toLowerCase()}
                    </span>
                  </p>
                </div>
                {/* Right Column */}
                <div className="flex flex-col justify-center items-center group">
                  {/* Teacher Name */}
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {orderDetails.classDTO.teacherName}
                  </p>
                  {/* Avatar Image */}
                  <div className="w-20 h-20 rounded-full bg-transparent group-hover:border-[3px] hover:border-blue-400 flex items-center justify-center transition-all duration-100">
                    <img
                      src={orderDetails.classDTO.imageTeacher || avatar}
                      alt="Teacher Avatar"
                      onClick={() =>
                        handleNavigate(orderDetails.classDTO.teacherName)
                      }
                      className="w-16 h-16 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full dark:bg-gray-800">
            <div className="flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
              Are you sure you want to cancel this order?
            </h2>
            <div className="mt-4 text-center">
              <p className="mb-4 text-lg font-medium text-green-600 dark:text-green-400">
                Current Balance: {formatCurrency(balance)}
              </p>
              <p className="mb-6 text-lg font-medium text-green-600 dark:text-green-400">
                New Balance:{" "}
                {newBalance !== null
                  ? formatCurrency(newBalance)
                  : "Calculating..."}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 w-24 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-24 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
