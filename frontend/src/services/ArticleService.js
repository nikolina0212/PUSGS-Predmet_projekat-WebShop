import apiClient from "./ApiClient";

export const GetAllArticles = async () => {
  try {
    const response = await apiClient.get(`/articles`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};