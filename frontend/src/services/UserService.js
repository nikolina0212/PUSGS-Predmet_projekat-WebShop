import axios from "axios";
import apiClient from "./ApiClient";

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

export const GetProfile = async () => {
  try {
    const response = await apiClient.get(`/users/profile`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const UpdateProfile = async (userData) => {
  try {
    const response = await apiClient.put(`/users/change-profile`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const ChangePassword = async (newPass) => {
  try {
    const response = await apiClient.patch(`/users/change-password`, newPass);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};