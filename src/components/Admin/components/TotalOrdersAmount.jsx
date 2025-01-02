import { getDetailTotalOrdersAndAmount, getTotalOrders } from "@/data/api";
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { ChevronRight, ReceiptText } from "lucide-react";
import ClassDetail from "./ClassDetail";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: "80%",
  maxWidth: "90%",
  height: "auto",
  maxHeight: "80vh",
  minWidth: "320px",
  overflow: "auto",
  "@media (max-width: 600px)": {
    width: "90%",
    maxWidth: "95%",
    minWidth: "280px",
    maxHeight: "80vh",
  },
  "@media (max-width: 900px)": {
    width: "85%",
    maxWidth: "90%",
  },
};

const TotalOrdersAmountDetails = () => {
  const [open, setOpen] = useState(false);
  const [dateMin, setDateMin] = useState(null);
  const [dateMax, setDateMax] = useState(null);
  const [amount, setAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = JSON.parse(localStorage.getItem("result"))?.token;

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = currentDate.toISOString().split("T")[0];
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() - 3);
    const formattedMinDate = minDate.toISOString().split("T")[0];
    setDateMin(formattedMinDate);
    setDateMax(maxDate);
  }, []);

  const convertDateToDateTime = (dateString, isEnd = false) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T${isEnd ? "23:59:59" : "00:00:00"}`;
  };

  const getTotalOrdersAmount = async () => {
    try {
      if (!dateMin || !dateMax || !token) return;
      const dateStart = convertDateToDateTime(dateMin);
      const dateEnd = convertDateToDateTime(dateMax, true);
      const res = await getDetailTotalOrdersAndAmount(
        dateStart,
        dateEnd,
        token
      );
      console.log(res);
      setAmount(res.totalOrderDTO.amount || 0);
      setTotalPrice(res.totalOrderDTO.totalPrice || 0);
      setOrderDetails(res.orderDetails);
    } catch (error) {
      console.error("Failed to fetch total orders and amount:", error);
    }
  };

  useEffect(() => {
    getTotalOrdersAmount();
  }, [token, dateMin, dateMax]);

  const handleDateChangeMin = (e) => setDateMin(e.target.value);
  const handleDateChangeMax = (e) => setDateMax(e.target.value);
  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between"
      >
        View details
        <ChevronRight />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center gap-2 ">
            <TextField
              type="date"
              value={dateMin || ""}
              onChange={handleDateChangeMin}
              required
              label="From Date"
              className="border px-2 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <span className="font-semibold text-base uppercase text-center">
              to
            </span>
            <TextField
              type="date"
              value={dateMax || ""}
              onChange={handleDateChangeMax}
              required
              label="To Date"
              className="border px-2 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="*:text-blue-800 text-xl pt-2 flex items-center justify-center gap-10 my-6">
            <div>
              <span className="font-semibold">Amount: </span>
              <span>{amount}</span>
            </div>
            <div>
              <span className="font-semibold">Total price: </span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(totalPrice)} VNĐ
              </span>
            </div>
          </div>
          <div>
            <Table sx={{ minWidth: 750 }} aria-label="order history table">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.orderDTO.orderId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.orderDTO.orderId}
                      </TableCell>
                      <TableCell>{row.orderDTO.username}</TableCell>
                      <TableCell>
                        {new Date(row.orderDTO.createAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell>
                        {row.orderDTO.totalPrice.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{row.orderDTO.status}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setShowDetail(true);
                            setData(row.classDTO);
                          }}
                        >
                          <ReceiptText />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orderDetails.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

          <ClassDetail setOpen={setShowDetail} open={showDetail} data={data} />
        </Box>
      </Modal>
    </>
  );
};

export default function TotalOrdersAmount() {
  const [totalOrdersAmount, setTotalOrdersAndAmount] = useState(0);

  const token = JSON.parse(localStorage.getItem("result"))?.token;

  const getTotalOrdersAndAmount = async () => {
    try {
      const res = await getTotalOrders(token);
      console.log(res);
      setTotalOrdersAndAmount(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getTotalOrdersAndAmount();
    }
  }, [token]);

  return (
    <div className="h-full w-full bg-blue-600 text-white shadow-lg py-2 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider">
        Total Orders
      </h1>
      <div className="text-white text-3xl mt-2 font-semibold h-[40%] text-center">
        <span>{totalOrdersAmount}</span>
      </div>
      <TotalOrdersAmountDetails />
    </div>
  );
}
