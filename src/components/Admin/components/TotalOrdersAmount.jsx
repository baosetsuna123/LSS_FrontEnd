import { getTotalOrdersAndAmount } from "@/data/api";
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ChevronRight, ReceiptText } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: "80%", // Default width is 80% of the screen width
  maxWidth: 800, // Maximum width of 800px
  height: "80%", // Default height is 80% of the screen height
  maxHeight: 600, // Maximum height of 600px
  "@media (max-width: 600px)": {
    width: "90%", // On small screens, the width is 90% of the screen width
    height: "auto", // Let the height adjust automatically
    maxWidth: "none", // Remove the max-width for smaller screens
    maxHeight: "none", // Allow the height to adjust based on content
  },
  "@media (max-width: 900px)": {
    width: "80%", // For medium-sized screens, use 80% width
    height: "auto", // Let the height adjust automatically
  },
};

const ClassDetail = ({ data, open, setOpen }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="class-detail-title"
      aria-describedby="class-detail-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "800px",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="subtitle1"
          className=" pt-2 font-bold mb-2 text-red-600"
        >
          Class Detail:
        </Typography>
        <div className="flex gap-4">
          <div className="grid grid-cols-3 gap-6">
            <img
              src={data?.imageUrl || "https://via.placeholder.com/150"}
              alt={data?.name}
              className="w-36 h-36 object-cover rounded-md"
            />
            <p>
              <strong>Course Name:</strong> {data?.name}
            </p>
            <p>
              <strong>Course Code:</strong> {data?.courseCode}
            </p>
            <p>
              <strong>Teacher:</strong> {data?.teacherName}
            </p>
            <p>
              <strong>Status:</strong> {data?.status}
            </p>
            <p>
              <strong>Location:</strong> {data?.location}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {new Intl.NumberFormat("vi-VN").format(data?.price)} VNĐ
            </p>
            <p>
              <strong>Max Students:</strong> {data?.maxStudents}
            </p>
            <p>
              <strong>Enrolled Students:</strong> {data?.students.length}
            </p>
          </div>
        </div>
        <Typography
          variant="subtitle1"
          className=" pt-10 font-bold mb-2 text-red-600"
        >
          Schedule:
        </Typography>
        <div className="mt-4 grid grid-cols-3 gap-6">
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(data?.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(data?.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Day of Week:</strong> {data?.dayOfWeek}
          </p>
          <p>
            <strong>Slot:</strong> {data?.slotId}
          </p>
        </div>
        <div className="my-6">
          <Typography
            variant="subtitle1"
            className="font-bold mb-2 text-red-600"
          >
            Description:
          </Typography>
          <p>{data?.description}</p>
        </div>
        <Button
          onClick={() => setOpen(false)}
          variant="contained"
          color="primary"
          className="mt-6 w-full"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
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
  const result = localStorage.getItem("result");
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = currentDate.toISOString().split("T")[0];
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() - 3);
    const formattedMinDate = minDate.toISOString().split("T")[0];
    setDateMin(formattedMinDate);
    setDateMax(maxDate);
  }, []);

  const convertDateToDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  };

  const getTotalOrdersAmount = async () => {
    try {
      if (!dateMin || !dateMax || !token) return;
      const dateStart = convertDateToDateTime(dateMin);
      const dateEnd = convertDateToDateTime(dateMax);
      const res = await getTotalOrdersAndAmount(dateStart, dateEnd, token);
      setAmount(res.totalOrderDTO.amount || 0);
      setTotalPrice(res.totalOrderDTO.totalPrice || 0);
      setOrderDetails(res.orderDetails);
    } catch (error) {
      console.error("Failed to fetch total orders and amount:", error);
    }
  };

  useEffect(() => {
    getTotalOrdersAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dateMin, dateMax]);

  const handleDateChangeMin = (e) => setDateMin(e.target.value);
  const handleDateChangeMax = (e) => setDateMax(e.target.value);
  const handleClose = () => setOpen(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between"
      >
        view details
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
              className="border px-2  rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
              className="border px-2  rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
                {orderDetails.map((row) => (
                  <TableRow
                    key={row.orderDTO.orderId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.orderDTO.orderId}
                    </TableCell>
                    <TableCell>{row.orderDTO.username}</TableCell>
                    <TableCell>
                      {new Date(row.orderDTO.createAt).toLocaleString()}
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
          </div>

          <ClassDetail setOpen={setShowDetail} open={showDetail} data={data} />
        </Box>
      </Modal>
    </>
  );
};

export default function TotalOrdersAmount() {
  return (
    <div className=" h-full w-full bg-blue-600 *:text-white shadow-lg py-2 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider h-[75%]">
        Total Orders And Amount
      </h1>
      <TotalOrdersAmountDetails />
    </div>
  );
}
