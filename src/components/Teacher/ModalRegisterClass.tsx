import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Chip, Modal, Button } from "@mui/material";
import { joinClassTeacher } from "@/data/api";
import toast from "react-hot-toast";

const ModalRegisterClass = ({ data, open, setOpen }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (ids) => {
    setSelectedRows(ids);
    console.log("Selected Row IDs: ", ids);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      await Promise.all(
        selectedRows.map(async (row) => {
          const res = await joinClassTeacher(token, row);
          return res;
        })
      );
      toast.success("All selected classes have been successfully joined!");
    } catch (error) {
      toast.error("An error occurred while joining classes. Please try again.");
    }
  };


  const columns = [
    { field: "classId", headerName: "Class ID", width: 100 },
    { field: "name", headerName: "Class Name", width: 200 },
    { field: "code", headerName: "Class Code", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          className={`${params.value === "PENDING"
            ? "bg-orange-500 text-white"
            : "bg-green-500 text-white"
            }`}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => `${params.value.toLocaleString()} VND`,
    },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    {
      field: "documents",
      headerName: "Documents",
      width: 200,
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <div>
            {params.value.map((doc) => (
              <a
                key={doc.id}
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {doc.title}
              </a>
            ))}
          </div>
        ) : (
          "No documents"
        ),
    },
    {
      field: "dateSlots",
      headerName: "Dates & Slots",
      width: 250,
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <div>
            {params.value.map((slot, index) => (
              <div key={index}>
                Date: {slot.date}, Slots: {slot.slotIds.join(", ")}
              </div>
            ))}
          </div>
        ) : (
          "No slots"
        ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="p-4 bg-gray-100 rounded-lg shadow"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          className="mb-4 text-lg font-semibold text-gray-700"
        >
          Class List
        </Typography>
        <Box
          className="bg-white rounded-lg shadow-md"
          sx={{
            height: 400,
            width: "100%",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleRowSelection}
            getRowId={(row) => row.classId}
            className="!text-sm *:cursor-pointer"
          />
        </Box>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalRegisterClass;
