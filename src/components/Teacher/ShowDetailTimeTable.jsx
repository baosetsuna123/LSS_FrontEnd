import Modal from "react-modal";

const ShowDetailTimeTable = ({ isOpen, setIsOpen, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Class Details"
      className="bg-white p-6 rounded-lg shadow-lg w-[600px]  mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center pb-6 border-b">
        Class Details
      </h2>
      <div className="grid grid-cols-2 gap-10">
        <div>
          <strong>Name:</strong> {data?.name}
        </div>
        <div>
          <strong>Code:</strong> {data?.code}
        </div>
        <div>
          <strong>Max Students:</strong> {data?.maxStudents}
        </div>
        <div>
          <strong>Price:</strong> {data?.price.toLocaleString()} VND
        </div>
        <div>
          <strong>Teacher:</strong> {data?.teacherName}
        </div>
        <div>
          <strong>Start Date:</strong> {new Date(data?.startDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Course Code:</strong> {data?.courseCode}
        </div>
        <div>
          <strong>Day of Week:</strong> {`Thứ ${data?.dayOfWeek}`}
        </div>
        <div className="col-span-2 flex items-center gap-5">
          <strong>Classroom:</strong>{data?.location ? <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full"  onClick={() => window.open(data?.location, "_blank")}>Meet URL</button> : <p className="font-semibold text-red-600">No classrooms yet</p>}
        </div>
        <div>
          <strong>Description:</strong> {data?.description || "No description"}
        </div>
        {data?.imageUrl && (
          <div className="col-span-2">
            <strong>Image:</strong>
            <img src={data?.imageUrl} alt={data?.name} className="mt-2 max-w-[200px] h-auto rounded" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 bg-white border text-[#333] px-4 py-2 rounded-lg  transition duration-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default ShowDetailTimeTable;
