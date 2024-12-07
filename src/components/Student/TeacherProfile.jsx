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
import defaults from "@/assets/default.jfif";
import avatar from "../../assets/avatar.png";
import { CircularProgress } from "@mui/material";

const TeacherProfile = () => {
  const [loadingAll, setLoadingAll] = useState(false);
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
        setLoadingAll(true);
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
      } finally {
        setLoadingAll(false);
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
        console.log(data);
        setInfo(data);
      } catch (error) {
        console.error("Error fetching teacher info:", error);
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
  const SpinnerOverlay = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center   z-50">
        <CircularProgress color="primary" size={60} />
      </div>
    );
  };
  if (loadingAll) {
    return <SpinnerOverlay />;
  }
  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };
  const maxNameLength =
    info.certificate && info.certificate.length > 0
      ? Math.max(
          ...info.certificate.map((certificate) => certificate.name.length)
        )
      : 0;
  console.log(maxNameLength);

  const nameWidth = `${maxNameLength * 0.6 + 2}rem`; // Adjust factor (e.g., 0.6) as needed
  console.log(nameWidth);

  return (
    <>
      <section className="w-full dark:text-white py-4 bg-gray-100 text-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-900 ">
        <div className="container dark:text-white  px-4 md:px-6">
          <Breadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Lesson", link: "/class" },
              {
                label: "Detail",
                link: classId ? `/class/${classId}` : "/class",
              },
              { label: "TutorProfile" },
            ]}
          />
        </div>
      </section>

      <div className="teacher-profile-container px-6 mt-6 flex justify-between items-center">
        <div className="flex-1">
          <Button className="mb-2 mr-4 text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-full px-4 py-1 text-sm dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600">
            Tutor
          </Button>

          <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">
            {teacherName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <StarRating averageRating={average} />
            <span className="text-xl text-gray-600 dark:text-gray-300">
              ({average.toFixed(2)})
            </span>
          </div>

          {/* Display Total Students */}
          <div className="mt-4 text-2xl text-gray-700 dark:text-gray-300">
            Total Students: <span className="font-bold">{totalStudents}</span>
          </div>

          {/* Display My Major */}
          <div className="mt-4 text-2xl text-gray-700 dark:text-gray-300">
            My Major:{" "}
            <span className="font-bold">
              {Array.isArray(info.major) && info.major.length > 0
                ? info.major.join(" & ")
                : "N/A"}
            </span>
          </div>
          <div className="certificate-section px-6 mt-6 ml-[-1.5rem]">
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Certificates
            </h3>
            {info.certificate && info.certificate.length > 0 ? (
              <div className="mt-4 space-y-4">
                {info.certificate.map((certificate, index) => (
                  <li key={index}>
                    <a
                      href={certificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {certificate.name}
                    </a>
                  </li>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No certificates available.
              </p>
            )}
          </div>
        </div>
        <div className="ml-6">
          <img
            src={info.avatarImage || avatar}
            alt={`${teacherName}'s Avatar`}
            className="w-50 h-50 mr-10 rounded-full object-cover border-2 border-blue-500"
          />
        </div>
      </div>

      <div className="about-me-section px-6 mt-6">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          About Me
        </h3>
        <p className="text-lg text-gray-700 mt-4 dark:text-gray-300">
          {info.description ? info.description : "No description available."}
        </p>
      </div>

      {classes.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800 mt-6 ml-5 dark:text-gray-100">
            My Class ({classes.length})
          </h2>
          <div className="grid grid-cols-12 gap-6 mt-6">
            {classes.map((classItem) => (
              <div key={classItem.classId} className="col-span-6 md:col-span-3">
                <Card
                  onClick={() => handleClassClick(classItem.classId)}
                  className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <img
                        src={classItem.imageUrl || defaults}
                        alt={classItem.name}
                        className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:brightness-90"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 dark:text-gray-100 dark:hover:text-blue-500">
                          {classItem.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Course Code: {classItem.courseCode}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold flex items-center text-gray-900 dark:text-gray-100">
                          {formatCurrency(classItem.price)}
                        </p>
                        <Button className="hover:bg-blue-500 dark:bg-orange-500 hover:text-white transition-colors duration-300 dark:hover:bg-blue-600 dark:hover:text-gray-900">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default TeacherProfile;
