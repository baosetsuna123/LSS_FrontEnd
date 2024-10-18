import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Code,
  DollarSign,
  GraduationCap,
  User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchClassbyID } from "@/data/api";
import Breadcrumb from "../Home/Breadcrumb";

export function ClassDetail() {
  const { id } = useParams(); // Get the class id from the URL
  const [classDetail, setClassDetail] = useState("");
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const fetchClassDetail = async () => {
      const response = await fetchClassbyID(id, token); // Replace with your API
      setClassDetail(response);
      console.log(response);
    };

    fetchClassDetail();
  }, [id]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Class", link: "/class" },
    { label: "Detail" }, // No link for the current page
  ];
  return (
    <>
      <section className="w-full py-4 bg-gray-100">
        <div className="container px-4 md:px-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={classDetail.imageUrl}
                  alt={classDetail.name}
                  className="w-full rounded-lg object-cover"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl font-bold">{classDetail.name}</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  Class Code: {classDetail.code}
                </p>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  Course Code: {classDetail.courseCode}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    {formatCurrency(classDetail.price)}
                  </p>
                  <Button>Enroll Now</Button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p>{classDetail.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Class Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Start Date: {classDetail.startDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>End Date: {classDetail.endDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="mr-2 h-4 w-4" />
                      <span>Course Code: {classDetail.courseCode}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{classDetail.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>{classDetail.teacherName}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Duration: 15 weeks</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Price: {formatCurrency(classDetail.price)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
