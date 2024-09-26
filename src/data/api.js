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
export const fetchSignUpTeacher = async (
  username,
  password,
  email,
  fullName,
  phoneNumber
) => {
  return await axios.post(`${HOST_NAME}/auth/register-teacher`, {
    username,
    password,
    email,
    fullName,
    phoneNumber,
  });
};
