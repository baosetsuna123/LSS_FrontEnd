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
        withCredentials: true, // Đảm bảo session cookie (nếu có) được gửi kèm
      }
    );
    return response.data; // Trả về dữ liệu từ response
  } catch (error) {
    if (error.response) {
      // Server trả về phản hồi lỗi
      console.error("Error response:", error.response);
      if (error.response.status === 401) {
        throw new Error("You are not logged in as a teacher.");
      } else if (error.response.status === 400) {
        throw new Error("Invalid request.");
      } else if (error.response.status === 500) {
        throw new Error("Internal server error.");
      }
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error("No response from server:", error.request);
      throw new Error("No response from server.");
    } else {
      // Xảy ra lỗi trong khi thiết lập request
      console.error("Error setting up request:", error.message);
      throw new Error("Error setting up request.");
    }
  }
};
