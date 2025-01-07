import {
  FaChalkboardTeacher,
  FaUsers,
  FaDollarSign,
  FaLink,
  FaCalendarAlt,
} from "react-icons/fa";

const EditClassPopup = ({
  isPopupOpen,
  editingClass,
  handleInputChange,
  handleSave,
  handleCancel,
  setIsPopupOpen,
  saving,
  maxStudentsError,
}) => {
  if (!isPopupOpen || !editingClass) return null;

  const InputField = ({
    icon,
    label,
    name,
    value,
    onChange,
    type = "text",
    disabled = false,
    min,
    max,
    error,
  }) => (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          className={`block w-full pl-10 sm:text-sm rounded-md ${
            disabled
              ? "bg-gray-100 text-gray-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          } ${error ? "border-red-300" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const timeRanges = {
    1: "7:00 - 9:15",
    2: "9:30 - 11:45",
    3: "12:30 - 14:45",
    4: "15:00 - 17:15",
    5: "17:45 - 20:00",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4 transition-all duration-300 ease-in-out transform hover:scale-102">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">
            Edit Class Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={<FaChalkboardTeacher className="text-gray-400" />}
              label="Class Name"
              name="name"
              value={editingClass.name}
              onChange={handleInputChange}
              disabled
            />
            <InputField
              icon={<FaChalkboardTeacher className="text-gray-400" />}
              label="Subject"
              name="course"
              value={editingClass.courseCode || ""}
              onChange={handleInputChange}
              disabled
            />
            <InputField
              icon={<FaUsers className="text-gray-400" />}
              label="Number of Students"
              name="maxStudents"
              value={editingClass.maxStudents}
              onChange={handleInputChange}
              type="number"
              disabled
              error={maxStudentsError}
            />
            <InputField
              icon={<FaChalkboardTeacher className="text-gray-400" />}
              label="Tutor"
              name="teacher"
              value={editingClass.teacherName}
              onChange={handleInputChange}
              disabled
            />
            <InputField
              icon={<FaDollarSign className="text-gray-400" />}
              label="Price"
              name="price"
              value={editingClass.price}
              onChange={handleInputChange}
              type="number"
              min="100000"
              max="500000"
              disabled
            />
            <InputField
              icon={<FaLink className="text-gray-400" />}
              label="Lesson Room Link"
              name="location"
              value={editingClass.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-500" /> Class Schedule
            </h4>
            <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Slot
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {editingClass?.dateSlots?.map((slot, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-700"
                          : "bg-white dark:bg-gray-800"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {slot.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {slot.slotIds
                          .sort((a, b) => a - b)
                          .map(
                            (slotId) =>
                              `Slot ${slotId} (${
                                timeRanges[slotId] || "No time available"
                              })`
                          )
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between space-x-3 mt-6">
            <button
              onClick={() => {
                handleCancel();
                setIsPopupOpen(false);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(editingClass)}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClassPopup;
