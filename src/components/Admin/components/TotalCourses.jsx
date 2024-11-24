import { fetchCoursesService } from "@/data/api";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Modal, Paper, TableContainer, TablePagination } from "@mui/material";
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
const DetailCourses = ({ data }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
          <h2 className="text-center font-bold text-xl">Courses Detail</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="courses table">
              <TableHead>
                <TableRow>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow key={course.courseCode}>

                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.categoryName}</TableCell>
                      <TableCell
                        style={{
                          color: course.status === "active" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {course.status}
                      </TableCell>
                      <TableCell>{course.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Modal>
    </>
  )
}


export default function TotalCourses() {
  const [TotalCourses, setTotalCourses] = useState([]);
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
      const res = await fetchCoursesService(token);
      setTotalCourses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className=" h-full w-full bg-gray-500 *:text-white shadow-lg py-2 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider ">
        Total Courses
      </h1>
      <div className="*:text-white text-3xl mt-5 font-semibold h-[40%] text-center ">
        <span>{TotalCourses.length}</span>
      </div>
      <DetailCourses data={TotalCourses} />
    </div>
  );
}