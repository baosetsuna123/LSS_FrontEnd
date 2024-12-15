import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { useClassContext } from "@/context/ClassContext";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";
import defaults from "../../assets/default.jfif";

export function ViewAllClasses() {
  const { classes: contextClasses, getClasses } = useClassContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedCourseCodes, setSelectedCourseCodes] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState(contextClasses);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  useEffect(() => {
    const fetchClassesOnMount = async () => {
      const token = sessionStorage.getItem("token");
      const result = JSON.parse(localStorage.getItem("result") || "{}");
      const role = result.role;

      if (token && role === "STUDENT") {
        await getClasses(token, role);
      }
    };

    fetchClassesOnMount();
  }, [getClasses]);
  useEffect(() => {
    const filtered = contextClasses.filter(
      (c) =>
        (c.status === "PENDING" || c.status === "ACTIVE") &&
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        c.price <= maxPrice &&
        (selectedCourseCodes.length === 0 ||
          selectedCourseCodes.includes(c.courseCode))
    );
    const sortedData = filtered.sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    setFilteredClasses(sortedData);
    console.log(filtered);
    setCurrentPage(1);
  }, [searchTerm, maxPrice, selectedCourseCodes, contextClasses]);

  useEffect(() => {
    console.log(contextClasses);
  }, [contextClasses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const navigate = useNavigate();
  const handleClassClick = (id) => {
    navigate(`/class/${id}`);
  };

  const handleCourseCodeChange = (courseCode) => {
    setSelectedCourseCodes((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setMaxPrice(250000);
    setSelectedCourseCodes([]);
  };
  console.log("maxPrice:", maxPrice);
  // Calculate total pages
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  // Slice filtered classes for current page
  const currentClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Determine if no data matched the search query
  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Lesson", link: "/class" },
  ];
  console.log("contextClasses.length:", contextClasses.length);
  console.log("itemsPerPage:", itemsPerPage);
  console.log("totalPages:", totalPages);
  console.log("currentPage:", currentPage);
  console.log("fitlercalss:", filteredClasses);

  return (
    <>
      <section className="w-full py-4 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="text-gray-900 dark:text-white"
          />
        </div>
      </section>

      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">View All Lessons</h1>

        {/* Search Bar and Price Range Slider in One Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
          <div className="flex-grow relative mb-4 md:mb-0 md:mr-4">
            <Input
              type="text"
              placeholder="Search by lesson or tutor name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="text-lg">Price Range</CardTitle>
            </CardHeader>
            <CardContent>
              <Slider
                min={100000}
                max={1000000}
                step={50000}
                value={[maxPrice]}
                onValueChange={(value) => setMaxPrice(value[0])}
              />
              <div className="flex justify-between mt-2">
                <span>0</span>
                <span>{formatCurrency(maxPrice)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filter by Course Code</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.from(
                  new Set(
                    contextClasses
                      .filter(
                        (c) => c.status === "PENDING" || c.status === "ACTIVE"
                      ) // Filter by status
                      .map((c) => c.courseCode)
                  )
                ).map((code) => (
                  <div key={code} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={code}
                      checked={selectedCourseCodes.includes(code)}
                      onCheckedChange={() => handleCourseCodeChange(code)}
                    />
                    <label
                      htmlFor={code}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {code}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
          </div>

          <div className="md:col-span-3">
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentClasses.length > 0 ? (
                  currentClasses.map((classItem) => (
                    <Card
                      key={classItem.classId}
                      onClick={() => handleClassClick(classItem.classId)}
                      className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <img
                            src={classItem.imageUrl || defaults}
                            alt={classItem.name}
                            className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:brightness-90"
                          />
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-300">
                              {classItem.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Course Code: {classItem.courseCode}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Tutor: {classItem.teacherName}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                              {formatCurrency(classItem.price)}
                            </p>
                            <Button className="transition-colors dark:bg-orange-500 duration-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 flex justify-center">
                    <p className="text-lg font-bold text-red-500">
                      No class matches with your search
                    </p>
                  </div>
                )}
              </div>
            </div>
            {filteredClasses.length > itemsPerPage && maxPrice != 100000 && (
              <div className="flex justify-between mt-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
