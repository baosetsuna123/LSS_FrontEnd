import { fetchClasses, fetchSlots, getTotalClasses } from "@/data/api";
import { Box, Modal, TablePagination } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import YearWeekSelector from "@/components/Teacher/YearSelector";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1000px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  overflowY: "auto",
};

const DetailClasses = ({ token }) => {
  const [open, setOpen] = useState(false);
  const [classData, setClassData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleClose = () => setOpen(false);

  const getClasses = async () => {
    try {
      const res = await fetchClasses(token); // Fetching classes
      console.log(res);
      const fetchedSlots = await fetchSlots(token); // Fetching slots

      // Map and filter classes with the updated fields
      const data = res.map((item) => ({
        ...item,
        slotInfo: item.dateSlots
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort dates
          .map((slot) => ({
            ...slot,
            slotDetails: slot.slotIds
              .sort((a, b) => a - b) // Sort slot IDs
              .map((slotId) =>
                fetchedSlots.find(
                  (fetchedSlot) => fetchedSlot.slotId === slotId
                )
              ),
          })),
      }));

      setClassData(data); // Update class data state
      setFilteredData(data); // Update filtered data state
    } catch (error) {
      console.log(error); // Error handling
    }
  };

  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (selectedWeek) {
      const filtered = classData.filter((classItem) => {
        const classStartDate = new Date(classItem.createDate); // Use createDate field for filtering
        const weekStart = selectedWeek.start;
        const weekEnd = selectedWeek.end;
        return classStartDate >= weekStart && classStartDate <= weekEnd;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(classData);
    }
  }, [selectedWeek, classData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const formatWithCommas = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          <div className="flex flex-col gap-4 items-center w-full">
            <h1 className="uppercase tracking-wide text-2xl font-semibold mx-auto">
              Class List
            </h1>

            <YearWeekSelector
              onWeekChange={(weekNumber, weekRange) => {
                setSelectedWeek({
                  weekNumber,
                  weekRange,
                  start: new Date(weekRange.split(" To ")[0]),
                  end: new Date(weekRange.split(" To ")[1]),
                });
              }}
            />
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="class table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="whitespace-nowrap">
                        Class ID
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        Class Name
                      </TableCell>
                      <TableCell>Tutor</TableCell>

                      <TableCell>Price</TableCell>
                      <TableCell className="whitespace-nowrap">
                        Max Students
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap"
                        sx={{ textAlign: "center" }}
                      >
                        Status
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        Students Joined
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((classItem, index) => (
                        <TableRow key={index}>
                          <TableCell>{classItem.classId}</TableCell>
                          <TableCell>{classItem.name}</TableCell>
                          <TableCell>{classItem.teacherName}</TableCell>
                          {/* Day of the Week */}
                          <TableCell>
                            {formatWithCommas(classItem.price)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {classItem.maxStudents}
                          </TableCell>
                          <TableCell>
                            <span
                              style={{
                                color:
                                  classItem.status === "PENDING"
                                    ? "#856404"
                                    : classItem.status === "CANCELED"
                                    ? "#721c24"
                                    : classItem.status === "COMPLETED"
                                    ? "#155724"
                                    : "inherit",
                                backgroundColor:
                                  classItem.status === "PENDING"
                                    ? "#fff3cd"
                                    : classItem.status === "CANCELED"
                                    ? "#f8d7da"
                                    : classItem.status === "COMPLETED"
                                    ? "#d4edda"
                                    : "inherit",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontWeight: "500",
                                display: "inline-block", // Ensures the background only wraps the content
                              }}
                            >
                              {classItem.status}
                            </span>
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            {classItem.students ? classItem.students.length : 0}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default function TotalClasses() {
  const [totalClasses, setTotalClasses] = useState(0);
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
  const getClasses = async () => {
    try {
      const res = await getTotalClasses(token);
      setTotalClasses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className=" h-full w-full bg-yellow-500 *:text-white shadow-lg py-2 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider ">
        Total Classes
      </h1>
      <div className="*:text-white text-3xl mt-2 font-semibold h-[40%] text-center ">
        <span>{totalClasses}</span>
      </div>
      <DetailClasses token={token} />
    </div>
  );
}
