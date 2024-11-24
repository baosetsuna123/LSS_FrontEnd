import { Box, Button, Typography, Modal, Grid, Paper } from "@mui/material";
import { Video } from "lucide-react";

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
          Class Detail
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className="p-4">
              <img
                src={data?.imageUrl || "https://via.placeholder.com/150"}
                alt={data?.name}
                className="w-full h-auto object-cover rounded-md mb-4"
              />
              <Typography variant="h6" gutterBottom className="font-semibold">
                {data?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Course Code: {data?.courseCode}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Video />}
                onClick={() => window.open(data?.location, "_blank")}
                className="mt-4"
              >
                Join Meet
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} className="p-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Teacher:</strong> {data?.teacherName}
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Start Date:</strong>{" "}
                    {new Date(data?.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>End Date:</strong>{" "}
                    {new Date(data?.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Day of Week:</strong> {data?.dayOfWeek}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Slot:</strong> {data?.slotId}
                  </Typography>
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
