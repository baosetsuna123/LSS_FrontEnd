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
import { fetchOrdersByUser } from "@/data/api";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";

const statusColors = {
  COMPLETE: "bg-green-100 text-green-800 hover:bg-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  Shipped: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
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
        const response = await fetchOrdersByUser(token);
        setOrders(response.data.content);
        console.log("Orders:", response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [token]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/feedback/${id}`);
  };
  return (
    <>
      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[{ label: "Home", link: "/" }, { label: "Orders" }]}
          />
        </div>
      </section>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Table>
          <TableCaption>A list of your recent orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead className="pl-12">Ordered At</TableHead>
              <TableHead className="text-right pr-52">Total Price</TableHead>
              <TableHead className="pl-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium pl-7">{index + 1}</TableCell>
                <TableCell className="pl-10">
                  {new Date(order.createAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right pr-52">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.status === "COMPLETE" && (
                    <Button
                      onClick={() => handleClick(order.orderId)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Feedback
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
