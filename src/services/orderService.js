import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/myorders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderToPaid = async (id, paymentResult) => {
  const response = await api.put(`/orders/${id}/pay`, paymentResult);
  return response.data;
};

export const updateOrderToDelivered = async (id) => {
  const response = await api.put(`/orders/${id}/deliver`);
  return response.data;
};