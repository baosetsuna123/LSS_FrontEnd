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
  phoneNumber,
  categoryIds
) => {
  return await api.post("/auth/register-student", {
    username,
    password,
    email,
    fullName,
    phoneNumber,
    categoryIds,
  });
};
//register-teacher
export const fetchSignUpTeacher = async (
  username,
  password,
  email,
  fullName,
  phoneNumber,
  categoryIds
) => {
  return await api.post(
    "/auth/register-teacher",
    {
      username,
      password,
      email,
      fullName,
      phoneNumber,
      categoryIds,
    },
    {
      withCredentials: true, // Quan trọng để gửi cookie session
    }
  );
};
//Get major class by student
export const fetchMajorClassByStudent = async (token) => {
  try {
    const response = await api.get("/classes/by-major", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//create-application
export const createApplication = async (applicationData, certificate) => {
  const formData = new FormData();

  // Append application data and certificate to FormData
  formData.append("applicationDTO", JSON.stringify(applicationData));
  if (certificate) {
    formData.append("certificate", certificate);
  }

  // Make the API call
  try {
    const response = await api.post(
      "/applications/create-application",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle errors appropriately
    if (error.response) {
      throw new Error(error.response.data || "Failed to create application");
    }
    throw new Error("An error occurred while creating the application");
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
//verify-otp (forgot-password)
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
//verify-otp (register)
export const confirmOtp = async (otp) => {
  try {
    const response = await api.post("/auth/confirm-otp", null, {
      params: { otp },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming OTP:", error);
    throw error.response?.data || error;
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
//feedback/classid
export const fetchFeedbackByclassid = async (token, id) => {
  try {
    const response = await api.get(`/feedback/class/${id}/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
export const fetchFeedbackDetail = async (token, id) => {
  try {
    const response = await api.get(`/feedback/class/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
//course-by-major
export const fetchCourseByMajor = async (token) => {
  try {
    const response = await api.get(`/courses/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
export const fetchAllCategories = async () => {
  try {
    const response = await api.get("/categories");
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
//--------------------------Payment API--------------------------
// Function to call the recharge API
export const fetchRecharge = async (amount, token) => {
  try {
    const response = await api.post(
      "/payment/recharge",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating recharge:", error);
    throw error;
  }
};

// Function to handle VNPay return
export const fetchVNPayReturn = async (params, token) => {
  try {
    const response = await api.get("/payment/return", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error handling VNPay return:", error);
    throw error;
  }
};
//Wallet- get balance
export const fetchBalance = async (token) => {
  try {
    const response = await api.get("/wallet/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//----------------class-----------------
//get all classes
export const fetchClasses = async (token) => {
  try {
    const response = await api.get("/classes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//get by id
export const fetchClassbyID = async (id, token) => {
  try {
    const response = await api.get(`/classes/getByClassId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//getinfoteacher
export const fetchInfoTeacher = async (name, token) => {
  try {
    const response = await api.get(`/auth/GetTeacher/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//update-user
export const updateCurrentUser = async (token, userData) => {
  try {
    const response = await api.put("/auth", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return updated user data
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error; // Rethrow error for handling in calling code
  }
};
//update-teacher
export const updateTeacherProfile = async (
  teacherData,
  avatarImage,
  backgroundImage,
  token
) => {
  const formData = new FormData();

  formData.append("teacherDTO", JSON.stringify(teacherData));
  if (avatarImage) {
    formData.append("avatarImage", avatarImage);
  }
  if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
  }
  try {
    const response = await api.put(`/auth/updateTeacher`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating teacher profile", error);
    throw error;
  }
};
//get by teacherName
export const fetchClassbyteacherName = async (name, token) => {
  try {
    const response = await api.get(`/classes/teacher/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
export const fetchAverageTeacher = async (name, token) => {
  try {
    const response = await api.get(
      `/feedback/average-feedback/teacher/${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};

export const fetchClassbyteacher = async (token) => {
  try {
    const response = await api.get(`/classes/my-classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};

//Get by courses
export const fetchCoursesService = async (token) => {
  try {
    const response = await api.get("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};

// Create Order
export const fetchCreateOrder = async (classId, token) => {
  try {
    const response = await api.post(`/orders/${classId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
export const CancelOrder = async (orderId, token) => {
  try {
    const response = await api.put(`/orders/cancel/${orderId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//update class
export const fetchUpdateClass = async ({ token, data }) => {
  const formData = new FormData();

  // Create an object for classDTO
  const classDTO = {
    classId: data.classId,
    name: data.name,
    code: data.code,
    description: data.description,
    status: data.status,
    location: data.location,
    maxStudents: data.maxStudents,
    price: data.price,
    createDate: data.createDate,
    teacherName: data.teacherName,
    startDate: data.startDate,
    endDate: data.endDate,
    courseCode: data.courseCode,
    fullName: data.fullName,
    students: data.students,
    slotId: data.slotId,
    dayofWeek: data.dayofWeek,
  };

  // Append classDTO as a JSON string
  formData.append("classDTO", JSON.stringify(classDTO));

  // If an image is provided, append it to the formData
  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  // Make the API call
  const response = await api.put(`/classes/${data.classId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const fetchCreateClass = async (classDTO, image, token) => {
  try {
    const formData = new FormData();
    formData.append("classDTO", JSON.stringify(classDTO));
    if (image) {
      formData.append("image", image);
    }

    const response = await api.post("/classes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "An error occurred");
  }
};

export const rejectApplication = async (id, rejectionReason, token) => {
  try {
    const response = await api.post(
      `/applications/reject_application`,
      rejectionReason,
      {
        params: { id },
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};
export const viewAllApplications = async (token) => {
  try {
    const response = await api.get(
      `/applicationUser/getApplicationUserByUserName`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};
export const fetchCancelApplication = async (id, token) => {
  try {
    const response = await api.put(
      `/applicationUser/cancelWithdrawal/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};
export const rejectAppOther = async (id, token) => {
  try {
    const response = await api.put(
      `/applicationUser/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};
// get all slots
export const fetchSlots = async (token) => {
  try {
    const response = await api.get(`/slots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};

// Get Order by UserToken
export const fetchOrdersByUser = async (token) => {
  try {
    const response = await api.get("/orders/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//wallet-history
export const fetchWalletHistory = async (token) => {
  try {
    const response = await api.get("/wallet/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
// Get Order by UserToken
export const fetchOrderClasses = async (token) => {
  try {
    const response = await api.get("/orders/classes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
//-----------------Feedback-----------------
export const fetchQuestionFeedback = async () => {
  try {
    const response = await api.get("/api/feedback-question");
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
export const fetchClassStaff = async (token) => {
  try {
    const response = await api.get("/classes/StatusCompleted", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetch balance:", error);
    throw error;
  }
};
export const submitFeedback = async (orderId, feedbackData, token) => {
  try {
    const response = await api.post(
      `/feedback/order/${orderId}/submit`,
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
//application form (withdraw)
export const submitWithdrawal = async (withdrawalRequest, token) => {
  try {
    const response = await api.post(
      `/applicationUser/submit/withdrawal`,
      withdrawalRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting withdrawal:", error);
    throw error;
  }
};

export const submitOther = async (otherRequest, token) => {
  try {
    const response = await api.post(
      `applicationUser/submit/other`,
      otherRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting other request:", error);
    throw error;
  }
};

export const getApplicationsByType = async (applicationTypeId, token) => {
  try {
    const response = await api.get(
      `applicationUser/applications/${applicationTypeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching applications by type:", error);
    throw error;
  }
};

export const completeWithdrawalRequest = async (applicationUserId, token) => {
  try {
    const response = await api.post(`applicationUser/complete`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        applicationUserId: applicationUserId, // Pass the application ID as a request param
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error completing withdrawal request:", error);
    throw error;
  }
};
export const approveOtherApp = async (id, token) => {
  try {
    const response = await api.put(`applicationUser/approve/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error completing withdrawal request:", error);
    throw error;
  }
};
//news-management
export const createNews = async (newsData, token) => {
  try {
    const response = await api.post(`/news/create`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const updateNews = async (id, newsData, token) => {
  try {
    const response = await api.put(`/news/update/${id}`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating news with ID ${id}:`, error);
    throw error;
  }
};

// Function to get all news items
export const getAllNews = async (token) => {
  try {
    const response = await api.get(`/news/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all news:", error);
    throw error;
  }
};

// Function to get a news item by ID
export const getNewsById = async (id, token) => {
  try {
    const response = await api.get(`/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    throw error;
  }
};
//admin-assign
export const AssignApplication = async () => {
  try {
    const response = await api.post(`applications/admin/applications/assign`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications by type:", error);
    throw error;
  }
};

export const getSystemWalletBalance = async (token) => {
  try {
    const response = await api.get(`/admin/system-wallet/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching system wallet balance:", error);
    throw error;
  }
};

export const getSystemWalletTransactionHistory = async (token) => {
  try {
    const response = await api.get(`/admin/system-wallet/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching system wallet transaction history:", error);
    throw error;
  }
};

export const getUserCountByRole = async (token) => {
  try {
    const response = await api.get(`/admin/user-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user count by role:", error);
    throw error;
  }
};

export const getTotalOrdersAndAmount = async (startDate, endDate, token) => {
  try {
    const response = await api.get(`/admin/total`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total orders and amount:", error);
    throw error;
  }
};

export const getTotalClasses = async (token) => {
  try {
    const response = await api.get(`/admin/totalClass`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total classes:", error);
    throw error;
  }
};

export const getActiveClassesByMonth = async (year, token) => {
  try {
    const response = await api.get(`/admin/statistics/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching active classes by month:", error);
    throw error;
  }
};

export const getOngoingClassesByMonth = async (year, token) => {
  try {
    const response = await api.get(`/admin/statistics/ongoing`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ongoing classes by month:", error);
    throw error;
  }
};

export const getCompletedClassesByMonth = async (year, token) => {
  try {
    const response = await api.get(`/admin/statistics/completed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching completed classes by month:", error);
    throw error;
  }
};

export const getActiveClassesByMonthDetailed = async (year, month, token) => {
  try {
    const response = await api.get(`/admin/details/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching active classes by month (detailed):", error);
    throw error;
  }
};

export const getOngoingClassesByMonthDetailed = async (year, month, token) => {
  try {
    const response = await api.get(`/admin/details/ongoing`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ongoing classes by month (detailed):", error);
    throw error;
  }
};

export const getCompletedClassesByMonthDetailed = async (
  year,
  month,
  token
) => {
  try {
    const response = await api.get(`/admin/details/completed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching completed classes by month (detailed):",
      error
    );
    throw error;
  }
};
