import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchQuestionFeedback, submitFeedback } from "@/data/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import Breadcrumb from "../Home/Breadcrumb";
import { useFeedback } from "@/context/FeedbackContext";

const ratingOptions = [
  { value: 1, label: "Extremely dissatisfied" },
  { value: 2, label: "Dissatisfied" },
  { value: 3, label: "Slightly dissatisfied" },
  { value: 4, label: "Slightly satisfied" },
  { value: 5, label: "Satisfied" },
  { value: 6, label: "Extremely satisfied" },
];

export default function FeedbackForm() {
  const [feedbackData, setFeedbackData] = useState({
    comment: "",
    feedbackAnswers: [],
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submittedFeedbackOrderIds, addFeedbackOrderId } = useFeedback();
  const { orderId } = useParams();
  const [questions, setQuestions] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const data = await fetchQuestionFeedback(token);
        if (Array.isArray(data)) {
          setQuestions(data);
          setFeedbackData((prevData) => ({
            ...prevData,
            feedbackAnswers: data.map((q) => ({ questionId: q.id, rating: 0 })),
          }));
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCate();
  }, [token]);

  const handleRatingChange = (questionId, rating) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      feedbackAnswers: prevData.feedbackAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, rating } : answer
      ),
    }));
  };

  const handleCommentChange = (event) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      comment: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    // Validate that all questions are answered
    const unansweredQuestions = feedbackData.feedbackAnswers.filter(
      (answer) => answer.rating === 0
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the feedback data
      const submissionData = {
        comment: feedbackData.comment,
        feedbackAnswers: feedbackData.feedbackAnswers.map((answer) => ({
          questionId: answer.questionId,
          rating: answer.rating,
        })),
      };

      // Submit the feedback using the id from useParams
      await submitFeedback(orderId, submissionData, token);
      addFeedbackOrderId(orderId.toString());
      setShowSuccessModal(true);

      // Reset form
      setFeedbackData({
        comment: "",
        feedbackAnswers: questions.map((q) => ({
          questionId: q.id,
          rating: 0,
        })),
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };
  const navigate = useNavigate();

  const handleModalClose = () => {
    const feedbackIds = Array.from(submittedFeedbackOrderIds);
    setShowSuccessModal(false);
    navigate("/my-class", {
      submittedFeedbackOrderIds: feedbackIds,
    });
  };
  return (
    <>
      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Timetable", link: "/my-class" },
              { label: "Feedback" }, // No link for the current page
            ]}
          />
        </div>
      </section>
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Course Feedback</h1>
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Question</TableHead>
                    {ratingOptions.map((option) => (
                      <TableHead key={option.value} className="text-center">
                        {option.label} {/* Show label only in header */}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.questionText}</TableCell>
                      {ratingOptions.map((option) => (
                        // ... (previous imports and code remain the same)

                        <TableCell key={option.value} className="text-center">
                          <RadioGroup
                            value={
                              feedbackData.feedbackAnswers
                                .find((a) => a.questionId === question.id)
                                ?.rating.toString() || ""
                            }
                            onValueChange={(value) =>
                              handleRatingChange(question.id, parseInt(value))
                            }
                            className="flex justify-center"
                          >
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={`q${question.id}-o${option.value}`}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`q${question.id}-o${option.value}`}
                              className="cursor-pointer"
                            >
                              <div className="relative">
                                {/* Outer circle with stroke effect */}
                                <div
                                  className={`size-5 rounded-full border-2 transition-all duration-200 ${
                                    feedbackData.feedbackAnswers.find(
                                      (a) => a.questionId === question.id
                                    )?.rating === option.value
                                      ? "border-blue-500 bg-blue-500" // Selected state
                                      : "border-gray-300 bg-white hover:border-gray-400" // Unselected state
                                  }`}
                                />

                                {/* Additional outer ring when selected */}
                                {feedbackData.feedbackAnswers.find(
                                  (a) => a.questionId === question.id
                                )?.rating === option.value && (
                                  <div className="absolute -inset-1 rounded-full border-2 border-blue-500 animate-scale" />
                                )}
                              </div>
                            </Label>
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Additional Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Please provide any additional feedback here..."
                value={feedbackData.comment}
                onChange={handleCommentChange}
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </CardFooter>
          </Card>
        </form>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your feedback has been submitted successfully.
                </p>
                <Button
                  onClick={handleModalClose}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
