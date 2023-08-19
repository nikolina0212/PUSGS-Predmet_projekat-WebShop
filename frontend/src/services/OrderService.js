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

export const PlaceOrder = async (orderId, data) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/confirm`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetAllOrders = async () => {
  try {
    const response = await apiClient.get(`/orders`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetOrdersOnMap = async () => {
  try {
    const response = await apiClient.get(`/orders/map`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const AcceptOrderOnMap = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/accept`, null);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};