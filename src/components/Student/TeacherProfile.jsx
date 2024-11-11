import { fetchClassbyteacherName } from "@/data/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../Home/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card"; // Assuming Button, Card, and CardContent are imported
import { Button } from "@/components/ui/button";
const TeacherProfile = () => {
  const { teacherName } = useParams();
  const [classes, setClasses] = useState([]);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.state?.classId;

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
        const pendingClasses = data.filter(
          (classItem) => classItem.status === "PENDING"
        );
        setClasses(pendingClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    if (teacherName) {
      fetchClasses();
    }
  }, [teacherName, token]);

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
      <div className="teacher-profile-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <Card
                key={classItem.classId}
                onClick={() => handleClassClick(classItem.classId)}
                className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <img
                      src={classItem.imageUrl}
                      alt={classItem.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{classItem.name}</h2>
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
                      <Button>View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No pending classes found for this teacher.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
