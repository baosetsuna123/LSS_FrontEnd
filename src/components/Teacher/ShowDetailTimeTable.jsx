import Modal from "react-modal";
import defaults from "../../assets/default.jfif";

const ShowDetailTimeTable = ({ isOpen, setIsOpen, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Class Details"
      className="bg-white p-6 rounded-lg shadow-lg w-[900px] h-auto max-h-[80vh] overflow-auto mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center pb-6 border-b">
        Class Details
      </h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <strong>Name:</strong> {data?.name}
        </div>
        <div className="col-span-4">
          <strong>Max Students:</strong> {data?.maxStudents}
        </div>
        <div className="col-span-4">
          <strong>Price:</strong> {data?.price.toLocaleString()} VND
        </div>
        <div className="col-span-4">
          <strong>Teacher:</strong> {data?.teacherName}
        </div>

        <div className="col-span-4">
          <strong>Course Code:</strong> {data?.courseCode}
        </div>
        <div className="col-span-4">
          <strong>Description:</strong>{" "}
          {data?.description
            ? data.description.length > 8
              ? `${data.description.slice(0, 8)}...`
              : data.description
            : "No description"}
        </div>
      </div>
      {/* Image as the last centered item */}
      <div className="flex justify-center mt-6">
        <div className="text-center">
          <strong>Image:</strong>
          <img
            src={data?.imageUrl || defaults} // Use default if imageUrl is not provided
            alt={data?.name || "Default Image"} // Provide a fallback alt text
            className="mt-2 max-w-[150px] h-auto rounded"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 bg-gray-200 border text-[#333] px-4 py-2 rounded-lg transition duration-200 hover:bg-red-600 hover:text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ShowDetailTimeTable;
