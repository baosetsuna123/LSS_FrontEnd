import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchOrderClasses } from "@/data/api";

const statusColors = {
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ACTIVE: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export function MyOrders() {
  const [orders, setOrders] = useState([]);
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

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Table>
          <TableCaption>A list of your recent orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead className="pl-12">Start Date</TableHead>
              <TableHead className="pl-12">Class Name</TableHead>
              <TableHead className="text-right ">Total Price</TableHead>
              <TableHead className="text-right">Teacher Name</TableHead>
              <TableHead className="pl-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.orderId}>
                {/* Use two TableCells for each piece of data */}
                <TableCell className="font-medium pl-7">{index + 1}</TableCell>
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
                <TableCell>
                  <Badge className={statusColors[order.classDTO.status]}>
                    {order.classDTO.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
