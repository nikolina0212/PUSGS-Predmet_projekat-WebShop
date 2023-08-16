import apiClient from "./ApiClient";

export const GetOrderArticles = async () => {
  try {
    const response = await apiClient.get(`/order-articles`)
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};


export const DeleteOrderArticle = async (articleId, orderId) => {
  try {
    const response = await apiClient.delete(`/order-articles/${articleId}/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};