import { ChevronDown } from "lucide-react";

function EnhancedSelectInput({ classes, selectedClassId, setSelectedClassId }) {
  return (
    <div className="relative">
      <label
        htmlFor="class"
        className="block mb-2 font-medium text-gray-700 text-sm transition-colors duration-200 ease-in-out"
      >
        Select Lesson
      </label>
      <div className="relative">
        <select
          id="class"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-gray-700 text-base leading-tight shadow-sm hover:border-gray-400"
          required
        >
          <option value="">-- Select Lesson --</option>
          {classes.map((cls) => (
            <option key={cls.classId} value={cls.classId}>
              {cls.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default EnhancedSelectInput;
