import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import backgroundImage from "../../assets/background2.png";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Captions, Podcast } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchCreateApplication } from "@/data/api";
import { Textarea } from "../ui/textarea";

export function Application() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const status = "PENDING";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = { status, title, description };
    console.log("Request Body:", requestBody);
    try {
      const response = await fetchCreateApplication(status, title, description);
      console.log("Application created successfully:", response);

      toast.success("Application created successfully");

      navigate("/login");
    } catch (error) {
      console.error(
        "Application creation failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Application creation failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Captions
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex mt-3 pointer-events-none">
                  <Podcast
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="pl-10" // Add padding to the left to make space for the icon
                  style={{ resize: "none" }} // Optional: Prevent resizing if needed
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Create Application
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => navigate("/SignUp")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Sign Up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
