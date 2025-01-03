import Modal from "react-modal";
import defaults from "../../assets/default.jfif";

import {
  FaTimes,
  FaUser,
  FaUsers,
  FaDollarSign,
  FaChalkboardTeacher,
  FaBookOpen,
  FaFileAlt,
} from "react-icons/fa";

const ShowDetailTimeTable = ({ isOpen, setIsOpen, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Class Details"
      className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-2xl w-[90%] max-w-4xl h-auto max-h-[90vh] overflow-auto mx-auto border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-sm"
    >
      <div className="relative">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center pb-4 border-b border-gray-300">
          Class Details
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-0 right-0 text-gray-600 hover:text-red-600 transition-colors duration-300"
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoItem icon={<FaUser />} label="Name" value={data?.name} />
        <InfoItem
          icon={<FaUsers />}
          label="Max Students"
          value={data?.maxStudents}
        />
        <InfoItem
          icon={<FaDollarSign />}
          label="Price"
          value={`${data?.price?.toLocaleString()} VND`}
        />
        <InfoItem
          icon={<FaChalkboardTeacher />}
          label="Teacher"
          value={data?.teacherName}
        />
        <InfoItem
          icon={<FaBookOpen />}
          label="Course Code"
          value={data?.courseCode}
        />
        <InfoItem
          icon={<FaFileAlt />}
          label="Description"
          value={
            data?.description
              ? data.description.length > 50
                ? `${data.description.slice(0, 50)}...`
                : data.description
              : "No description"
          }
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <img
            src={data?.imageUrl || defaults}
            alt={data?.name || "Class Image"}
            className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 shadow-lg"
          />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold mb-2">Course Material</h3>
          {data?.documents?.[0]?.title && data?.documents?.[0]?.filePath ? (
            <a
              href={data.documents[0].filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              <FaFileAlt /> {data.documents[0].title}
            </a>
          ) : (
            <p className="text-gray-500 italic">No document available</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setIsOpen(false)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
    <div className="text-blue-500 mr-3">{icon}</div>
    <div>
      <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
      <p className="text-lg text-gray-800">{value}</p>
    </div>
  </div>
);

export default ShowDetailTimeTable;
