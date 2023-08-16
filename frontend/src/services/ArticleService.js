import apiClient from "./ApiClient";

export const GetAllArticles = async () => {
  try {
    const response = await apiClient.get(`/articles`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetSellerArticles = async () => {
  try {
    const response = await apiClient.get(`/articles/seller-articles`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const AddToCart = async (articleId, amount) => {
  try {
    const response = await apiClient.post(`/order-articles/${articleId}/${amount}`, null);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const DeleteArticle = async (articleId) => {
  try {
    const response = await apiClient.delete(`${process.env.REACT_APP_API_URL}/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const EditArticle = async (data) => {
  try {
    const response = await apiClient.put(`/articles`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const AddNewArticle = async (data) => {
  try {
    const response = await apiClient.post(`/articles`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};