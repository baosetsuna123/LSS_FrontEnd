import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
//Login api
export const fetchLogin = async (username, password) => {
  return await api.post("/auth/login", {
    username,
    password,
  });
};
//regitster-student
export const fetchSignUpStudent = async (
  username,
  password,
  email,
  fullName,
  phoneNumber
) => {
  return await api.post("/auth/register-student", {
    username,
    password,
    email,
    fullName,
    phoneNumber,
  });
};
//register-teacher
export const fetchSignUpTeacher = async (
  username,
  password,
  email,
  fullName,
  phoneNumber
) => {
  return await api.post(
    "/auth/register-teacher",
    {
      username,
      password,
      email,
      fullName,
      phoneNumber,
    },
    {
      withCredentials: true, // Quan trọng để gửi cookie session
    }
  );
};
//create-application
export const fetchCreateApplication = async (status, title, description) => {
  try {
    const response = await api.post(
      "/applications/create-application",
      {
        status,
        title,
        description,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.status === 401) {
        throw new Error("You are not logged in as a teacher.");
      } else if (error.response.status === 400) {
        throw new Error("Invalid request.");
      } else if (error.response.status === 500) {
        throw new Error("Internal server error.");
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error("Error setting up request.");
    }
  }
};
//forgot-password
export const fetchForgotPassword = async (phoneNumber) => {
  try {
    const response = await api.post(
      "/forgotpassword/forgot-password",
      {
        phoneNumber,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.status === 404) {
        throw new Error("Phone number not found.");
      } else if (error.response.status === 500) {
        throw new Error("Internal server error.");
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error("Error setting up request.");
    }
  }
};
//verify-otp
export const fetchVerifyOtpApi = async (otp) => {
  try {
    const response = await api.post(
      "/forgotpassword/verify-otp",
      {
        otp,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error("An error occurred while verifying OTP.");
    }
  }
};
//reset-password
export const fetchResetPassword = async (newpass) => {
  try {
    const response = await api.post(
      "/forgotpassword/reset-password",
      {
        newpass,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error("An error occurred while verifying OTP.");
    }
  }
};
// Category API
// Getcategorybyid
export const fetchCategoryById = async (id, token) => {
  try {
    const response = await api.get(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log("Category: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
//create-category
export const fetchCreateCategory = async (categoryDTO, token) => {
  try {
    const response = await api.post("/categories", categoryDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log("Category created: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
//update-category
export const fetchUpdateCategory = async (id, categoryDTO, token) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log("Category updated: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
//get all categories
export const fetchAllCategories = async (token) => {
  try {
    const response = await api.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("All categories: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// Course API
// Function to create a new course
export const fetchCreateCourse = async (courseDTO, image, token) => {
  const formData = new FormData();
  formData.append("courseDTO", JSON.stringify(courseDTO)); // Add course data as JSON
  formData.append("image", image); // Add the image file

  try {
    const response = await api.post("/courses", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Let Axios handle Content-Type
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Function to update an existing course
export const fetchUpdateCourse = async (
  courseCode,
  courseDTO,
  image = null,
  token
) => {
  const formData = new FormData();
  formData.append("courseDTO", JSON.stringify(courseDTO)); // Add course data as JSON
  if (image) {
    formData.append("image", image); // Add the image file if provided
  }

  try {
    const response = await api.put(`/courses/${courseCode}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Let Axios handle Content-Type
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Function to get all courses
export const fetchAllCourses = async (token) => {
  try {
    const response = await api.get("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Function to delete a course by courseCode
export const fetchDeleteCourse = async (courseCode, token) => {
  try {
    const response = await api.delete(`/courses/${courseCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
//get-application/staff
export const fetchApplicationStaff = async (token) => {
  try {
    const response = await api.get("/applications/staff", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
//approve-application
export const fetchApproveApplication = async (id, token) => {
  try {
    const response = await api.post("/applications/approve_application", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id, // Pass the application ID as a request param
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
