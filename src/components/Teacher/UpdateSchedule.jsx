import {
  cancelClass,
  fetchClassbyteacher,
  fetchCoursesService,
  updateLocationClass,
} from "@/data/api";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import toast from "react-hot-toast";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { Button } from "../ui/button";

function UpdateSchedule() {
  const [classes, setClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const result = localStorage.getItem("result");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }


  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchClassbyteacher(token);

      const filteredClasses = res.filter(
        (classItem) =>
          classItem.status === "PENDING" || classItem.status === "ACTIVE"
      );
      const sortedData = filteredClasses.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setClasses(sortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]);
  const handleConfirmCancellation = async () => {
    if (!agreeToTerms) {
      toast.error("Please agree to the terms before proceeding.");
      return;
    }
    console.log(selectedClassId);
    setIsSubmitting(true);
    try {
      await cancelClass(selectedClassId, token);
      toast.success("Cancellation request submitted successfully!");
      setClasses((prevClasses) => {
        console.log(prevClasses);
        const updatedClasses = prevClasses.filter(
          (classItem) => classItem.classId !== selectedClassId
        );
        console.log("Updated classes:", updatedClasses);
        return updatedClasses;
      });
      setShowModal(false);
    } catch (error) {
      console.error(
        "An error occurred while submitting the cancellation:",
        error
      );
      toast.error("An error occurred while submitting the cancellation.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const fetchCourses = async () => {
    try {
      const res = await fetchCoursesService(token);
      setCourses(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };


  const [initialMaxStudents, setInitialMaxStudents] = useState(null);
  const handleDelete = async (cls) => {
    setShowModal(true);
    setSelectedClassId(cls.classId);
  };
  const handleEdit = (classInfo) => {
    setEditingClass({ ...classInfo });
    console.log(classInfo);
    setInitialMaxStudents(classInfo.maxStudents);
    setMaxStudentsError("");
    setIsPopupOpen(true);
  };
  const [maxStudentsError, setMaxStudentsError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the state for all fields
    setEditingClass((prev) => ({ ...prev, [name]: value }));
    if (name === "price") {
      const newPrice = Number(value);
      setEditingClass((prev) => ({ ...prev, price: newPrice }));
    }
    if (name === "maxStudents") {
      const newMaxStudents = Number(value);

      if (newMaxStudents && newMaxStudents < initialMaxStudents) {
        setMaxStudentsError(
          "Max Students cannot be less than the current number of students"
        );
      } else {
        setMaxStudentsError(""); // Clear error when the value is valid
      }
    }
  };

  const handleSave = async (updatedClass) => {
    try {
      if (!updatedClass.location) {
        toast.error("Please enter a Lesson Room Link")
        return;
      }
      setSaving(true);
      await updateLocationClass(
        token,
        updatedClass.classId,
        updatedClass.location
      );

      fetchCourses();
      fetchClasses();

      setIsPopupOpen(false);
      setEditingClass(null);

      toast.success("Update Class Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the class. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setEditingClass(null);
  };
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Update Class Information
      </h2>
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a lesson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500 font-bold text-lg">No data available</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {filteredClasses.map((cls) => (
            <li
              key={cls.classId}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Subject: {cls.courseName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Max students: {cls.maxStudents}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Students Joined: {cls.students.length}{" "}
                    {cls.students.length > 0 && (
                      <span>
                        (
                        {cls.students.map((student, index) => (
                          <span key={student.userName}>
                            {student.userName}
                            {index < cls.students.length - 1 && ", "}
                          </span>
                        ))}
                        )
                      </span>
                    )}
                  </p>

                </div>
                <div className="flex justify-end gap-x-5">
                  <button
                    onClick={() => handleEdit(cls)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <FaPencilAlt className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls)}
                    className="p-2 bg-red-500 font-extrabold text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isPopupOpen && editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit Class Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Class Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={editingClass.name}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Subject
                </label>
                <input
                  name="course"
                  value={editingClass.courseCode || ""}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="maxStudents"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Number of Students
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={editingClass.maxStudents}
                  onChange={handleInputChange}
                  disabled
                  placeholder={`Current number of students is ${editingClass.maxStudents}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {maxStudentsError && (
                  <p className="text-red-500 mt-1 text-sm">
                    {maxStudentsError}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tutor
                </label>
                <input
                  id="teacher"
                  name="teacher"
                  value={editingClass.teacherName}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editingClass.price}
                  onChange={handleInputChange}
                  min="100000"
                  max="500000"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-500 mt-1 block">
                  {formatCurrency(editingClass.price)}
                </span>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Lesson Room Link
                </label>
                <input
                  id="location"
                  name="location"
                  value={editingClass.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="md:col-span-3">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingClass?.dateSlots?.map((slot, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border text-center">
                          {slot.date}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {slot.slotIds
                            .sort((a, b) => a - b) // Sort slotIds in ascending order
                            .map((slotId) => {
                              // Define time ranges for each slotId
                              const timeRanges = {
                                1: "7h00 - 9h15",
                                2: "9h30 - 11h45",
                                3: "12h30 - 14h45",
                                4: "15h00 - 17h15",
                                5: "17h45 - 20h00",
                              };

                              return `Slot ${slotId} (${timeRanges[slotId] || "No time available"
                                })`;
                            })
                            .join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => handleSave(editingClass)}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setIsPopupOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-6 w-6" />
              Cancellation Policy
            </DialogTitle>
            <DialogDescription>
              Please read our cancellation policy carefully before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              By cancelling this class, you agree to the following terms:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-500 space-y-2">
              <li>
                Your salary will be reduced by 10% for this cancelled class.
              </li>
              <li>
                This reduction will also apply to your next completed lessons.
              </li>
            </ul>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={setAgreeToTerms}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the cancellation policy
              </label>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmCancellation}
              disabled={!agreeToTerms || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Agree & Cancel"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => setShowModal(false)}
            >
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateSchedule;
