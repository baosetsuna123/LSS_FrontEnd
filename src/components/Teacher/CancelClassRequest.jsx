import { cancelClass } from "@/data/api"; // Import the cancelClass function from api.js
import { fetchClassbyteacher } from "@/data/api"; // Keep fetchClassbyteacher to fetch classes
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function CancelClassRequest() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(""); // Store only classId
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Fetch classes that the teacher is associated with
  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      // Filter only classes with status ACTIVE or PENDING
      const filteredClasses = res.filter(
        (cls) => cls.status === "ACTIVE" || cls.status === "PENDING"
      );
      setClasses(filteredClasses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  // Handle cancellation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedClassId) {
      toast.error("Please select a class to cancel.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log(selectedClassId);
      await cancelClass(selectedClassId, token);
      setSelectedClassId(""); // Reset class selection
      toast.success("Cancellation request submitted successfully!");
      fetchClasses(); // Refetch classes after successful cancellation
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Submit Lesson Cancellation Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="class"
            className="block mb-2 font-medium text-gray-700"
          >
            Select Lesson
          </label>
          <select
            id="class"
            value={selectedClassId} // Use classId here
            onChange={(e) => setSelectedClassId(e.target.value)} // Update the selected classId
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          >
            <option value="">-- Select Lesson --</option>
            {classes.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Cancellation Request"}
        </button>
      </form>
    </div>
  );
}

export default CancelClassRequest;
