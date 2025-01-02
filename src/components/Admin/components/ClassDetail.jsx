import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import defaults from "../../../assets/default.jfif";

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
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          className="text-primary font-bold"
        >
          Lesson Detail
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className="p-4">
              <img
                src={data?.imageUrl || defaults}
                alt={data?.name}
                className="w-full h-auto object-cover rounded-md mb-4"
              />
              <Typography variant="h6" gutterBottom className="font-semibold">
                {data?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Course Code: {data?.courseCode}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} className="p-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Tutor:</strong> {data?.teacherName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Status:</strong> {data?.status}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Price:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN").format(data?.price)} VNĐ
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Max Students:</strong> {data?.maxStudents}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Enrolled Students:</strong>{" "}
                    {data?.students?.length || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={3} className="p-4 mt-4">
              <Typography variant="h6" gutterBottom className="font-semibold">
                Schedule
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Date</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Slots</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.dateSlots
                          .sort((a, b) => {
                            const dateComparison =
                              new Date(a.date) - new Date(b.date);
                            if (dateComparison !== 0) return dateComparison;
                            return a.slotIds[0] - b.slotIds[0]; // Assuming slotIds are numbers
                          })
                          .map((slot) => (
                            <TableRow key={slot.date}>
                              <TableCell>
                                {new Date(slot.date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </TableCell>
                              <TableCell>
                                {slot.slotIds.sort((a, b) => a - b).join(", ")}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={3} className="p-4 mt-4">
              <Typography variant="h6" gutterBottom className="font-semibold">
                Description
              </Typography>
              <Typography variant="body1">{data?.description}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          color="primary"
          className="mt-6 w-full"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ClassDetail;
