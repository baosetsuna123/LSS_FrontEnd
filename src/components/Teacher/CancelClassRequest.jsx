import { cancelClass, fetchClassbyteacher } from "@/data/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EnhancedSelectInput from "./EnhancedSelectInput";

function CancelClassRequest() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error("Please select a class to cancel.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmCancellation = async () => {
    if (!agreeToTerms) {
      toast.error("Please agree to the terms before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelClass(selectedClassId, token);
      setSelectedClassId("");
      toast.success("Cancellation request submitted successfully!");
      fetchClasses();
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Submit Lesson Cancellation Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <EnhancedSelectInput
          classes={classes}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
        />

        <Button
          type="submit"
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Cancellation Request"}
        </Button>
      </form>

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

export default CancelClassRequest;
