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

export const GetOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/details`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetDeliveredOrders = async () => {
  try {
    const response = await apiClient.get(`/orders/purhcaser-orders`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetSellerOrders = async (isNew) => {
  try {
    const response = await apiClient.get(`/orders/seller-orders?isNew=${isNew}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetSellerOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/seller-details/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const CancelOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`, null);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const GetPendingOrders = async () => {
  try {
    const response = await apiClient.get(`/orders/pending`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};