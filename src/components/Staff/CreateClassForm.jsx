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
import {
  fetchCreateClass,
  fetchSlots,
  fetchAllCourses,
  fetchSystemParam,
} from "@/data/api";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import toast from "react-hot-toast";
const CreateClassForm = ({
  toggleCreateClassForm,
  setLessons,
  setShowCreateClassForm,
}) => {
  const [classDTO, setClassDTO] = useState({
    name: "",
    description: "",
    maxStudents: "",
    price: "",
    courseCode: "",
    dateSlots: [],
  });
  const [currentDateSlot, setCurrentDateSlot] = useState({
    date: "",
    slotIds: [],
  });
  const [loading, setLoading] = useState(false);
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
  const formatWithCommas = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [courses, setCourses] = useState([]);
  const [minDateString, setMinDateString] = useState("");
  const selectedCourse = courses.find(
    (course) => course.courseCode === classDTO.courseCode
  );

  // Calculate the total selected slots
  const totalSelectedSlots = classDTO.dateSlots.reduce(
    (acc, dateSlot) => acc + dateSlot.slotIds.length,
    0
  );

  // Check if selected course and totalSelectedSlots are available
  useEffect(() => {
    if (selectedCourse) {
      console.log("Selected Course:", selectedCourse);
      console.log("Total Selected Slots:", totalSelectedSlots);
    }
  }, [selectedCourse, totalSelectedSlots]);
  useEffect(() => {
    const fetchParam = async () => {
      try {
        const data = await fetchSystemParam(token);

        const param = data.find((p) => p.name === "check_time_before_start");
        console.log(param.value);
        if (param) {
          let baseDays = parseInt(param.value, 10); // Parse the value as an integer
          if (isNaN(baseDays)) {
            console.warn(
              "The parameter 'check_time_before_start' value is not a valid number. Defaulting to 0."
            );
            baseDays = 0;
          }
          const today = new Date();
          today.setDate(today.getDate() + baseDays + 2); // Add base days and 2 days buffer
          const formattedMinDate = today.toISOString().split("T")[0];
          setMinDateString(formattedMinDate); // Set the minimum date
          console.log(minDateString);
        } else {
          console.warn(
            "Parameter 'check_time_before_start' not found. Defaulting to 2 days from today."
          );
          const today = new Date();
          today.setDate(today.getDate() + 2); // Default to 2 days buffer
          const formattedMinDate = today.toISOString().split("T")[0];
          setMinDateString(formattedMinDate); // Set the default minimum date
        }
      } catch (error) {
        console.error("Error fetching parameters:", error);
        toast.error(
          "Failed to fetch system parameters. Defaulting to 2 days from today."
        );
        const today = new Date();
        today.setDate(today.getDate() + 2); // Default to 2 days buffer
        const formattedMinDate = today.toISOString().split("T")[0];
        setMinDateString(formattedMinDate); // Set the default minimum date
      }
    };

    fetchParam();
  }, [token]);
  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchDropdownData = async () => {
      try {
        const data = await fetchAllCourses(token);
        if (isMounted) {
          setCourses(data);
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

    if (name === "courseCode") {
      const selectedCourse = courses.find(
        (course) => course.courseCode === value
      );
      if (selectedCourse) {
        setClassDTO((prevData) => ({
          ...prevData,
          [name]: value,
          completedSlots: selectedCourse.completedSlots, // Store the completedSlots in the state
        }));
      } else {
        setClassDTO((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setClassDTO((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleInput = (e) => {
    let value = e.target.value.replace(/,/g, ""); // Remove commas for clean input

    if (!isNaN(value) || value === "") {
      setClassDTO((prevData) => ({ ...prevData, price: value })); // Update state with the raw number
    }
  };
  const isCourseValid = () => {
    const selectedCourse = courses.find(
      (course) => course.courseCode === classDTO.courseCode
    );
    return selectedCourse && selectedCourse.completedSlots > 0;
  };
  const handleDateSlotChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setCurrentDateSlot((prev) => ({
        ...prev,
        date: format(date, "yyyy-MM-dd"), // Format the valid date
      }));
    } else {
      console.error("Invalid date value:", date); // Log error if date is invalid
    }
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
    const dateToRemove = classDTO.dateSlots[index].date;
    setClassDTO((prev) => ({
      ...prev,
      dateSlots: prev.dateSlots.filter((_, i) => i !== index),
    }));
    setCurrentDateSlot((prev) => ({
      ...prev,
      date: dateToRemove, // Restore date to the currentDateSlot for potential reuse
    }));
  };
  const isDateDisabled = (date) => {
    // Disable dates that have been added to dateSlots
    return classDTO.dateSlots.some(
      (slot) => new Date(slot.date).toDateString() === date.toDateString()
    );
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

    const requiredFields = [
      "name",
      "courseCode",
      "maxStudents",
      "price",
      "description",
    ];

    for (const field of requiredFields) {
      if (!classDTO[field]) {
        toast.error(
          `Please fill out the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`
        );
        return;
      }
    }
    if (classDTO.maxStudents < 5 || classDTO.maxStudents > 10) {
      toast.error("Max students must be between 5 and 10");
      return;
    }
    if (classDTO.price < 100000 || classDTO.price > 500000) {
      toast.error("Price must be between 100,000 and 500,000");
      return;
    }
    if (!classDTO.courseCode) {
      toast.error("Please enter a course code.");
      return; // Stop the form submission if courseCode is not filled
    }
    if (classDTO.dateSlots.length === 0) {
      toast.error("Please select at least one date slot.");
      return; // Stop the form submission if no dateSlots are selected
    }
    const selectedCourse = courses.find(
      (course) => course.courseCode === classDTO.courseCode
    );
    if (selectedCourse) {
      const totalSelectedSlots = classDTO.dateSlots.reduce(
        (total, dateSlot) => {
          return total + dateSlot.slotIds.length;
        },
        0
      );
      if (totalSelectedSlots < selectedCourse.completedSlots) {
        toast.error(
          `You need to select ${selectedCourse.completedSlots} slots for this class.`
        );
        return; // Stop the form submission if the total selected slots are less than completed slots
      }
    }

    try {
      setLoading(true);
      const newClass = await fetchCreateClass(classDTO, image, token);
      setLessons((prevCategories) => {
        const updatedCategories = [...prevCategories, newClass];
        return updatedCategories;
      });
      setShowCreateClassForm(false);
      toast.success("Class created successfully");
    } catch (error) {
      console.error("Error creating class:", error);
      console.log("Full Error Object:", error);
      if (error.response) {
        console.log("Error Response:", error.response);
      } else {
        console.log("No response object available.");
      }
      if (error.message && error.message.includes("The number of slots")) {
        toast.error(
          "Please make sure the number of slots matches the completed slots."
        );
      } else {
        toast.error("Error creating class");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-4 relative overflow-y-auto max-h-full">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={toggleCreateClassForm}
        >
          <X className="h-10 w-10 text-red-500" />
        </button>
        <form onSubmit={handleSubmit} className="">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-2xl text-center font-bold text-gray-800">
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
                    className="border p-2 rounded-lg w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course.courseCode}>
                        {course.completedSlots > 0
                          ? `${course.courseCode} (${course.completedSlots} slots)`
                          : `${course.courseCode}`}
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
                <div className="md:col-span-2">
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
                    placeholder="Max Students (5 - 10)"
                    min={5}
                    max={10}
                    value={classDTO.maxStudents}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-1">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700"
                  >
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    placeholder="(100,000 đ - 500,000 đ)"
                    value={formatWithCommas(classDTO.price)}
                    onChange={handleInput}
                    required
                    min={100000}
                    max={500000}
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
                        disabled={
                          !isCourseValid() ||
                          totalSelectedSlots >= selectedCourse.completedSlots
                        }
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
                        disabled={(date) => {
                          const minDate = new Date(minDateString);
                          minDate.setHours(0, 0, 0, 0); // Set time to midnight
                          return (
                            date < minDate ||
                            isDateDisabled(date) ||
                            totalSelectedSlots >= selectedCourse.completedSlots
                          ); // Disable dates if selected slots >= completed slots
                        }}
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
                    disabled={
                      !currentDateSlot.date ||
                      totalSelectedSlots >= selectedCourse.completedSlots
                    }
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
                      placeholder="Select Slot"
                    >
                      {slots.map((slot) => (
                        <MenuItem
                          key={slot.slotId}
                          value={slot.slotId.toString()}
                          disabled={
                            totalSelectedSlots >= selectedCourse?.completedSlots
                          }
                        >
                          <Checkbox
                            checked={currentDateSlot.slotIds.includes(
                              slot.slotId
                            )}
                            disabled={
                              totalSelectedSlots >=
                              selectedCourse?.completedSlots
                            }
                          />
                          {`Slot ${slot.period} (${slot.start} - ${slot.end})`}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText>Choose available slot(s)</FormHelperText>
                  </FormControl>

                  <Button
                    type="button"
                    onClick={addDateSlot}
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={
                      totalSelectedSlots >= selectedCourse?.completedSlots
                    } // Disable button if selected slots >= completed slots
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
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition duration-300"
          >
            {loading ? "Creating..." : "Create Class"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CreateClassForm;
