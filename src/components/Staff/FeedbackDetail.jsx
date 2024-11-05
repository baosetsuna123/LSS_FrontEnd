import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFeedbackByclassid, fetchFeedbackDetail } from "@/data/api"; // Import the API function
import { useQuestionContext } from "@/context/QuestionContext";
import { toast } from "react-hot-toast";

const FeedbackDetail = ({ classId }) => {
  const { questions } = useQuestionContext();
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const [feedback, setFeedback] = useState([]);
  const [detailedFeedback, setDetailedFeedback] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(3); // Count of displayed detailed feedback items
  const [isDetailedFetched, setIsDetailedFetched] = useState(false); // Track if detailed feedback has been fetched
  const token = sessionStorage.getItem("token");
  const feedbackLookup = feedback.reduce((acc, item) => {
    acc[item.questionId] = item;
    return acc;
  }, {});
  const ratingOptions = [
    { value: 1, label: "Extremely dissatisfied" },
    { value: 2, label: "Dissatisfied" },
    { value: 3, label: "Slightly dissatisfied" },
    { value: 4, label: "Slightly satisfied" },
    { value: 5, label: "Satisfied" },
    { value: 6, label: "Extremely satisfied" },
  ];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await fetchFeedbackByclassid(token, classId);
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to fetch feedback.");
      }
    };

    if (classId) {
      fetchFeedback();
    }
  }, [classId, token]);

  const handleFetchDetailedFeedback = async () => {
    if (!isDetailedFetched) {
      try {
        const data = await fetchFeedbackDetail(token, classId); // Assuming this function takes token and classId
        setDetailedFeedback(data); // Set the detailed feedback
        setIsDetailedFetched(true); // Mark that detailed feedback has been fetched
        toast.success("Detailed feedback fetched successfully."); // Optionally toast a success message
      } catch (error) {
        console.error("Error fetching detailed feedback:", error);
        toast.error("Failed to fetch detailed feedback.");
      }
    } else {
      loadMore(); // If already fetched, just load more
    }
  };

  const loadMore = () => {
    setDisplayedCount((prevCount) => prevCount + 3); // Load three more items
  };

  // Determine if there's more detailed feedback to load
  const hasMoreFeedback = detailedFeedback.length > displayedCount;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Question</TableHead>
            {ratingOptions.map((option) => (
              <TableHead key={option.value} className="text-center">
                {option.label}
              </TableHead>
            ))}
            <TableHead className="text-center">Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeQuestions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="w-full max-w-3xl whitespace-normal break-words">
                {question.questionText}
              </TableCell>
              {ratingOptions.map((option) => {
                const ratingCount =
                  feedbackLookup[question.id]?.ratingCount?.[option.value] || 0;
                return (
                  <TableCell key={option.value} className="text-center">
                    {ratingCount}
                  </TableCell>
                );
              })}
              <TableCell className="text-center">
                {feedbackLookup[question.id]?.averageRating || 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        {detailedFeedback.length === 0 || !isDetailedFetched ? (
          <button
            type="button"
            className="btn btn-primary bg-yellow-500 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
            onClick={handleFetchDetailedFeedback}
          >
            Show Detail
          </button>
        ) : hasMoreFeedback ? (
          <button
            type="button"
            className="btn btn-primary bg-yellow-500 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
            onClick={loadMore}
          >
            Load More
          </button>
        ) : null}
      </div>

      {/* Render detailed feedback if available */}
      {detailedFeedback.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Detailed Feedback</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Username</TableHead>
                <TableHead>Question ID</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedFeedback
                .slice(0, displayedCount)
                .map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.studentUsername}</TableCell>
                    <TableCell>{detail.questionId}</TableCell>
                    <TableCell>{detail.rating}</TableCell>
                    <TableCell>{detail.comment || "N/A"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </form>
  );
};

export default FeedbackDetail;
