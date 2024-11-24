import { useState } from "react";
import { registerStaff } from "@/data/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.phoneNumber.length < 10 || formData.phoneNumber.length > 14) {
      newErrors.phoneNumber = "Phone number must be between 10 and 14 digits";
    }
    if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const token = sessionStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await registerStaff(formData, token);
      toast.success("Staff registered successfully!");
      console.log("New Staff:", response);
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to register staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Register Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
          <CardFooter className="px-0 col-span-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register Staff"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateStaff;
