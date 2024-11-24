import { fetchClassbyteacher } from "@/data/api";
import { useState, useEffect } from "react";

function CancelClassRequest() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
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

  const fetchClasses = async () => {
    try {
      const res = await fetchClassbyteacher(token);
      setClasses(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Mock submitting the request to the server
    try {
      // Replace with real API call data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Class cancellation request:", {
        class: selectedClass,
        reason,
      });
      setSubmitMessage(
        "Class cancellation request sent successfully. We will review and respond as soon as possible."
      );
      // Reset form
      setSelectedClass("");
      setReason("");
    } catch (error) {
      console.error("An error occurred while submitting the request:", error);
      setSubmitMessage(
        "An error occurred while submitting the request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Submit Class Cancellation Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="class"
            className="block mb-2 font-medium text-gray-700"
          >
            Select Class
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="reason"
            className="block mb-2 font-medium text-gray-700"
          >
            Reason for Cancellation
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Cancellation Request"}
        </button>
      </form>
      {submitMessage && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            submitMessage.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
}

export default CancelClassRequest;
