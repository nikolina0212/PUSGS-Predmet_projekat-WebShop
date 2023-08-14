import axios from "axios";

export const LoginUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const SignUpUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const SignInWithGoogle = async (googleToken) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/google`, googleToken);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};