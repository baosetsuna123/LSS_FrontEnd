const Modal = ({ children, onClose }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick} // Handle click on overlay
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-4xl relative max-h-[80vh] overflow-y-auto"
        onClick={handleModalClick} // Handle click on modal content
      >
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition absolute top-2 right-2"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
