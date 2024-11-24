import { fetchSlots, updateSlot } from '@/data/api';
import { Button, Modal, TextField } from '@mui/material';
import { ChevronRight, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import toast from 'react-hot-toast';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const SlotDetails = ({ data, token, getSlots }) => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);
    const [slotData, setSlotData] = useState([]);

    useEffect(() => {
        setSlotData(data)
    }, [data])

    const handleClose = () => setOpen(false);
    const handleEditClose = () => setEditOpen(false);

    const handleEditClick = (slot) => {
        setCurrentSlot(slot);
        setEditOpen(true);
    };

    const handleInputChange = (field, value) => {
        setCurrentSlot({ ...currentSlot, [field]: value });
    };

    const handleSave = async () => {
        try {
            await updateSlot(currentSlot.slotId, currentSlot, token);
            toast.success("save successfully")
            getSlots();
            handleEditClose();
        } catch {
            toast.error("Save failed")
        }
        setEditOpen(false);
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className='w-full flex items-center justify-between'>
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
                    <h2 className="text-center font-bold text-xl">Slots Detail</h2>
                    <Table sx={{ minWidth: 750 }} aria-label="schedule table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Slot ID</TableCell>
                                <TableCell>Period</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slotData?.map((slot) => (
                                <TableRow key={slot.slotId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{slot.slotId}</TableCell>
                                    <TableCell>{slot.period}</TableCell>
                                    <TableCell>{slot.start}</TableCell>
                                    <TableCell>{slot.end}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(slot)}>
                                            <Edit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Modal>

            <Modal
                open={editOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={style}>
                    <h2 className="text-center font-bold text-xl">Edit Slot</h2>
                    {currentSlot && (
                        <>
                            <TextField
                                fullWidth
                                label="Period"
                                value={currentSlot.period}
                                onChange={(e) => handleInputChange('period', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Start Time"
                                type="time"
                                value={currentSlot.start}
                                onChange={(e) => handleInputChange('start', e.target.value)}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="End Time"
                                type="time"
                                value={currentSlot.end}
                                onChange={(e) => handleInputChange('end', e.target.value)}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <Button variant="outlined" onClick={handleEditClose}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};


export default function Slot() {
    const [totalSlots, setTotalSlots] = useState([]);
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
    const getSlots = async () => {
        try {
            const res = await fetchSlots(token);
            setTotalSlots(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSlots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className=" h-full w-full bg-orange-500 *:text-white shadow-lg py-2 rounded-lg px-4">
            <h1 className="font-semibold text-xl pb-4 tracking-wider ">
                Total Slots
            </h1>
            <div className="*:text-white text-3xl mt-5 font-semibold h-[40%] text-center ">
                <span>{totalSlots.length}</span>
            </div>
            <SlotDetails data={totalSlots} token={token} getSlots={getSlots} />
        </div>
    );
}
