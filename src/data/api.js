import axios from "axios";

const HOST_NAME = "http://localhost:8080";

//Login api
export const fetchLogin = async (username, password) => {
  return await axios.post(`${HOST_NAME}/auth/login`, {
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
  return await axios.post(`${HOST_NAME}/auth/register-student`, {
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
  return await axios.post(
    `${HOST_NAME}/auth/register-teacher`,
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
    const response = await axios.post(
      `${HOST_NAME}/applications/create-application`,
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
    const response = await axios.post(
      `${HOST_NAME}/forgotpassword/forgot-password`,
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
    const response = await axios.post(
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
    const response = await axios.post(
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
