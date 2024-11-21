import ReactDOM from "react-dom";

const ModalApprove = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default ModalApprove;
