import {
  fetchAverageTeacher,
  fetchClassbyteacherName,
  fetchInfoTeacher,
} from "@/data/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TeacherProfile = () => {
  const { teacherName } = useParams();
  const [classes, setClasses] = useState([]);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.state?.classId;
  const [average, setAverage] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await fetchClassbyteacherName(teacherName, token);
        const filteredClasses = data.filter(
          (classItem) =>
            classItem.status === "PENDING" || classItem.status === "ACTIVE"
        );
        setClasses(filteredClasses);

        // Calculate total students for classes with statuses ACTIVE, ONGOING, COMPLETED
        const totalStudentsCount = data
          .filter(
            (classItem) =>
              classItem.status === "ACTIVE" ||
              classItem.status === "ONGOING" ||
              classItem.status === "COMPLETED"
          )
          .reduce(
            (acc, classItem) => acc + (classItem.students?.length || 0),
            0
          );
        setTotalStudents(totalStudentsCount);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    if (teacherName) {
      fetchClasses();
    }
  }, [teacherName, token]);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const data = await fetchAverageTeacher(teacherName, token);
        setAverage(data.averageFeedback);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverage();
  }, [teacherName, token]);
  const [info, setInfo] = useState({});
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await fetchInfoTeacher(teacherName, token);
        setInfo(data);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchInfo();
  }, [teacherName, token]);

  const StarRating = ({ averageRating }) => {
    const fullStars = Math.floor(averageRating);
    const fractionalPart = averageRating % 1;
    const emptyStars = 6 - fullStars - (fractionalPart > 0 ? 1 : 0);

    return (
      <div
        className="inline-flex text-3xl"
        title={`Average: ${averageRating.toFixed(2)}`}
      >
        {Array.from({ length: fullStars }).map((_, index) => (
          <span key={`full-${index}`} className="text-yellow-500">
            ★
          </span>
        ))}

        {fractionalPart > 0 && (
          <span
            className="relative text-yellow-500"
            style={{
              display: "inline-block",
              width: "1em",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <span
              style={{
                width: `${fractionalPart * 100}%`,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              ★
            </span>
            <span className="text-gray-300">☆</span>
          </span>
        )}

        {Array.from({ length: emptyStars }).map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-300">
            ☆
          </span>
        ))}
      </div>
    );
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  return (
    <>
      <section className="w-full py-4 bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900">
        <div className="container px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Class", link: "/class" },
              {
                label: "Detail",
                link: classId ? `/class/${classId}` : "/class",
              },
              { label: "TeacherProfile" },
            ]}
          />
        </div>
      </section>

      <div className="teacher-profile-container px-6 mt-6">
        <h1 className="text-4xl font-semibold text-gray-800">{teacherName}</h1>
        <div className="flex items-center gap-2 mt-2">
          <StarRating averageRating={average} />
          <span className="text-xl text-gray-600">({average.toFixed(2)})</span>
        </div>

        {/* Display Total Students */}
        <div className="mt-4 text-2xl text-gray-700">
          Total Students: <span className="font-bold">{totalStudents}</span>
        </div>

        {/* Display My Major */}
        <div className="mt-4 text-2xl text-gray-700">
          My Major:{" "}
          <span className="font-bold">
            {Array.isArray(info.major) && info.major.length > 0
              ? info.major.join(" & ")
              : "N/A"}
          </span>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mt-6">
          My Class ({classes.length})
        </h2>
        <div className="grid grid-cols-12 gap-6 mt-6">
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <div key={classItem.classId} className="col-span-6 md:col-span-3">
                <Card
                  onClick={() => handleClassClick(classItem.classId)}
                  className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <img
                        src={classItem.imageUrl}
                        alt={classItem.name}
                        className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:brightness-90"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                          {classItem.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Class Code: {classItem.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          Course Code: {classItem.courseCode}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold flex items-center">
                          {formatCurrency(classItem.price)}
                        </p>
                        <Button className="hover:bg-blue-500 hover:text-white transition-colors duration-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <p>No classes found for this teacher.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
