import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react"; // Import icons from lucide-react

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex items-center mb-4">
          <LogOut className="h-8 w-8 text-red-600 mr-2" />
          <h2 className="text-lg font-bold">Logout Confirmation</h2>
        </div>
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
          <p className="text-gray-700">Are you sure you want to logout?</p>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="default"
            onClick={onConfirm}
            className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            Confirm
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
