import axios from "axios";

const HOST_NAME = "http://localhost:8080";

//Login api
export const fetchLogin = async (username, password) => {
  return await axios.post(`${HOST_NAME}/auth/login`, {
    username,
    password,
  });
};
