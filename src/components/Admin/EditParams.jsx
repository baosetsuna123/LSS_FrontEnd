/* eslint-disable react/no-unescaped-entities */
import { fetchSystemParam, updateParam } from "@/data/api";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const EditParams = () => {
  const [params, setParams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchParam = async () => {
      setIsLoading(true);
      try {
        const response = await fetchSystemParam(token);
        setParams(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching parameters:", error);
        setError("Failed to load parameters. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchParam();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const updatedParams = params.map((param) => ({
      ...param,
      value: param.value,
    }));

    try {
      const response = await updateParam(updatedParams, token);
      toast.success("Parameters updated successfully.");
      console.log("Updated params:", response);
    } catch (error) {
      console.error("Error updating parameters:", error);
      toast.error("Failed to update parameters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (id, value) => {
    setParams((prevParams) =>
      prevParams.map((param) => (param.id === id ? { ...param, value } : param))
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        System Parameters
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {params.map((param) => (
          <div
            key={param.id}
            className="bg-white p-6 rounded-lg shadow-md relative"
          >
            <label
              htmlFor={`param-${param.id}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {param.name
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </label>
            <div className="relative">
              <input
                type="text"
                id={`param-${param.id}`}
                value={param.value}
                onChange={(e) => handleInputChange(param.id, e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-md bg-white border-2 border-gray-300 
                          transition-all duration-200 ease-in-out
                          focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 
                          hover:border-gray-400
                          cursor-text text-gray-900 text-lg
                          shadow-sm outline-none"
              />
              <Pencil
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 
                               group-hover:text-blue-500 transition-colors duration-200"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Current value:{" "}
              {param.name.includes("check_time_before_start")
                ? `${param.value} minutes`
                : param.name.includes("minimum_required_percentage") ||
                  param.name.includes("discount_percentage")
                ? `${(parseFloat(param.value) * 100).toFixed(0)}%`
                : param.name.includes("feedback_deadline")
                ? `${param.value} day`
                : param.value}
            </p>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditParams;
