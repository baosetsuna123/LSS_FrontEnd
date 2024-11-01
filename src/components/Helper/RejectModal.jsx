import { Edit, X } from "lucide-react"; // Import an icon for the close button

const RejectModal = ({
  isOpen,
  onClose,
  onSubmit,
  rejectionReason,
  setRejectionReason,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2">
              <Edit size={24} className="text-gray-600" />
            </span>
            Reject Application
          </h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <p className="mb-4">
          Please provide a reason for rejection. This field must not be empty.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 transition duration-200 ease-in-out"
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200 ease-in-out"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;
