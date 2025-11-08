import API from './index';

// Order APIs
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get user's orders
  getUserOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await API.get(`/orders/myorders?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Order not found' };
    }
  },

  // Update order to paid
  updateOrderToPaid: async (orderId, paymentResult) => {
    try {
      const response = await API.put(`/orders/${orderId}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update payment status' };
    }
  },

  // Delete order (only for unpaid and undelivered orders)
  deleteOrder: async (orderId) => {
    try {
      const response = await API.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete order' };
    }
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await API.get(`/orders?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // PayPal configuration
  getPayPalConfig: async () => {
    try {
      const response = await API.get('/config/paypal');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get PayPal config' };
    }
  },
};

export default orderAPI;