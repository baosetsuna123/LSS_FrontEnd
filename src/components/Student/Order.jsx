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
import { fetchOrderClasses, CancelOrder } from "@/data/api";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const statusColors = {
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ACTIVE: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-200",
  ONGOING: "bg-orange-100 text-orange-800 hover:bg-orange-200",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchOrderClasses(token);
        setOrders(response.data.content);
        console.log("Orders:", response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    try {
      await CancelOrder(orderId, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderDTO.orderId === orderId
            ? { ...order, orderDTO: { ...order.orderDTO, status: "CANCELLED" } }
            : order
        )
      );
      toast.success("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error);
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

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Orders</h1>
          {/* Search Input */}
          <div className="flex items-center border rounded p-2">
            <input
              type="text"
              placeholder="Search by Class Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out shadow-sm"
            />
          </div>
        </div>

        {/* Display message if no orders */}
        {filteredOrders.length === 0 && (
          <div className="text-center text-xl font-semibold text-gray-500 mt-8">
            No Data
          </div>
        )}
        {filteredOrders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead className="pl-12">Start Date</TableHead>
                <TableHead className="pl-12">Class Name</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-right">Teacher Name</TableHead>
                <TableHead className="pl-5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((order, index) => (
                <TableRow key={order.orderDetailId}>
                  <TableCell className="font-medium pl-7">
                    {/* Adjust the index here to account for pagination */}
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="pl-10">
                    {new Date(order.classDTO.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pl-10">{order.classDTO.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.price)}
                  </TableCell>
                  <TableCell className="pl-20">
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
                        onClick={() =>
                          handleCancelOrder(order.orderDTO.orderId)
                        }
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 w-24"
                      >
                        Cancel
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {filteredOrders.length > 0 && !searchQuery && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out mr-2"
            >
              <FaChevronLeft />
            </button>
            <span className="px-4 py-2 text-lg font-medium">{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out ml-2"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
