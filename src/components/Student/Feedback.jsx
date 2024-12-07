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
  const [loading, setLoading] = useState(false);
  const [loadingbutton, setLoadingbutton] = useState(false);
  useEffect(() => {
    const fetchCate = async () => {
      try {
        setLoading(true);
        const data = await fetchQuestionFeedback();
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
      } finally {
        setLoading(false);
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
    setLoadingbutton(true);
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
      setLoadingbutton(false);
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
      <section className="w-full py-4 bg-gray-100 dark:bg-gray-800">
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Lesson Feedback
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <Card className="mb-6 dark:bg-gray-700">
                <CardContent>
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3 text-gray-800 dark:text-gray-100">
                          Question
                        </TableHead>
                        {ratingOptions.map((option) => (
                          <TableHead
                            key={option.value}
                            className="text-center text-gray-800 dark:text-gray-100"
                          >
                            {option.label} {/* Show label only in header */}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => (
                        <TableRow
                          key={question.id}
                          className="dark:bg-gray-700"
                        >
                          <TableCell className="text-gray-800 dark:text-gray-100">
                            {question.questionText}
                          </TableCell>
                          {ratingOptions.map((option) => (
                            <TableCell
                              key={option.value}
                              className="text-center"
                            >
                              <RadioGroup
                                value={
                                  feedbackData.feedbackAnswers
                                    .find((a) => a.questionId === question.id)
                                    ?.rating.toString() || ""
                                }
                                onValueChange={(value) =>
                                  handleRatingChange(
                                    question.id,
                                    parseInt(value)
                                  )
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
                                          ? "border-blue-500 bg-blue-500"
                                          : "border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
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

              <Card className="dark:bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">
                    Additional Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Please provide any additional feedback here..."
                    value={feedbackData.comment}
                    onChange={handleCommentChange}
                    className="min-h-[100px] dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={loadingbutton}
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {loadingbutton ? "Loading..." : "Submit"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Thank You!
                </h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  Your feedback has been submitted successfully.
                </p>
                <Button
                  onClick={handleModalClose}
                  className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
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
