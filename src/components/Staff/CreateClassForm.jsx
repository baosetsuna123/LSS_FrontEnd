import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, X, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchCreateClass, fetchSlots, fetchAllCourses } from "@/data/api";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import toast from "react-hot-toast";
const CreateClassForm = ({ toggleCreateClassForm, setLessons }) => {
  const [classDTO, setClassDTO] = useState({
    name: "",
    description: "",
    maxStudents: "",
    price: "",
    courseCode: "",
    startDate: "",
    endDate: "",
    dayOfWeek: "",
    dateSlots: [],
  });
  const [currentDateSlot, setCurrentDateSlot] = useState({
    date: "",
    slotIds: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [slots, setSlots] = useState([]);
  const token = sessionStorage.getItem("token");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchDropdownData = async () => {
      try {
        const fetchedSlots = await fetchSlots(token);
        if (isMounted) {
          setSlots(fetchedSlots);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching dropdown data:", error);
        }
      }
    };

    fetchDropdownData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [token]);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchDropdownData = async () => {
      try {
        const data = await fetchAllCourses(token);
        const codes = data.map((course) => course.courseCode);
        if (isMounted) {
          setCourses(codes);
          console.log(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching dropdown data:", error);
        }
      }
    };

    fetchDropdownData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [token]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassDTO((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSlotChange = (date) => {
    setCurrentDateSlot((prev) => ({
      ...prev,
      date: format(date, "yyyy-MM-dd"),
    }));
  };

  const addDateSlot = () => {
    if (currentDateSlot.date && currentDateSlot.slotIds.length > 0) {
      setClassDTO((prev) => ({
        ...prev,
        dateSlots: [...prev.dateSlots, currentDateSlot],
      }));
      setCurrentDateSlot({ date: "", slotIds: [] });
    }
  };

  const removeDateSlot = (index) => {
    setClassDTO((prev) => ({
      ...prev,
      dateSlots: prev.dateSlots.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newClass = await fetchCreateClass(classDTO, image, token);
      toggleCreateClassForm();
      setLessons((prevCategories) => {
        const updatedCategories = [...prevCategories, newClass];
        return updatedCategories;
      });
      toast.success("Class created successfully");
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Error creating class");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={toggleCreateClassForm}
        >
          <X className="h-10 w-10 text-red-500" />
        </button>
        <form onSubmit={handleSubmit} className="">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Create New Class
              </CardTitle>
            </CardHeader>
            <CardContent className=" p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Class Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={classDTO.name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="">
                  <Label
                    htmlFor="courseCode"
                    className="text-sm font-medium text-gray-700"
                  >
                    Course Code
                  </Label>
                  <select
                    name="courseCode"
                    onChange={handleInputChange}
                    className="border p-2  rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    <option value="">Select Course</option>
                    {courses.map((courseCode) => (
                      <option key={courseCode} value={courseCode}>
                        {courseCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={classDTO.description}
                  onChange={handleInputChange}
                  required
                  className="w-full h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="">
                  <Label
                    htmlFor="maxStudents"
                    className="text-sm font-medium text-gray-700"
                  >
                    Max Students
                  </Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    value={classDTO.maxStudents}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700"
                  >
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={classDTO.price}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="">
                  <Label
                    htmlFor="dayOfWeek"
                    className="text-sm font-medium text-gray-700"
                  >
                    Day of Week
                  </Label>
                  <Input
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={classDTO.dayOfWeek}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <Label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={classDTO.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="">
                  <Label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={classDTO.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="">
                <Label className="text-sm font-medium text-gray-700">
                  Date Slots
                </Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !currentDateSlot.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentDateSlot.date ? (
                          format(new Date(currentDateSlot.date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          currentDateSlot.date
                            ? new Date(currentDateSlot.date)
                            : undefined
                        }
                        onSelect={handleDateSlotChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    disabled={!currentDateSlot.date}
                    sx={{
                      ".MuiOutlinedInput-root": {
                        height: "40px", // Adjust the height of the Select field
                        display: "flex",
                        alignItems: "center", // Centers the content
                      },
                      ".MuiSelect-root": {
                        paddingTop: "14px", // Adjust padding to fix the height and label
                      },
                    }}
                  >
                    <Select
                      multiple
                      value={currentDateSlot.slotIds.map(String)} // Ensure the value is an array of strings
                      onChange={(event) => {
                        const { value } = event.target;
                        setCurrentDateSlot((prev) => ({
                          ...prev,
                          slotIds: value.map(Number), // Convert back to numbers
                        }));
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return ""; // Return empty string if no slot is selected
                        }
                        return selected
                          .map((id) => {
                            const slot = slots.find(
                              (slot) => slot.slotId === Number(id)
                            );
                            return slot ? `Slot ${slot.period}` : "";
                          })
                          .join(", ");
                      }}
                      placeholder="Select Slot" // You can use placeholder instead of InputLabel
                    >
                      {slots.map((slot) => (
                        <MenuItem
                          key={slot.slotId}
                          value={slot.slotId.toString()}
                        >
                          <Checkbox
                            checked={currentDateSlot.slotIds.includes(
                              slot.slotId
                            )}
                          />
                          {`Slot ${slot.period} (${slot.start} - ${slot.end})`}
                        </MenuItem>
                      ))}
                    </Select>

                    {/* Optionally, add helper text if needed */}
                    <FormHelperText>Choose available slot(s)</FormHelperText>
                  </FormControl>

                  <Button
                    type="button"
                    onClick={addDateSlot}
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {classDTO.dateSlots.length > 0 && (
                <div className="">
                  <Label className="text-sm font-medium text-gray-700">
                    Added Date Slots
                  </Label>
                  <div className="">
                    {classDTO.dateSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                      >
                        <span className="text-sm text-gray-700">
                          {format(new Date(slot.date), "PPP")}:{" "}
                          {slot.slotIds.join(", ")}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDateSlot(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="">
                <Label className="text-sm font-medium text-gray-700">
                  Class Image
                </Label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="relative w-24 h-24">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        size="icon"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition duration-300"
          >
            Create Class
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CreateClassForm;
