import API from './index';

// Product APIs
export const productAPI = {
  // Get all products (alias for getProducts)
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await API.get(`/products?${queryString}`);
      return response.data.products || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get all products with search and pagination
  getProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await API.get(`/products?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data.product || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Product not found' };
    }
  },

  // Get top rated products
  getTopProducts: async (limit = 3) => {
    try {
      const response = await API.get(`/products/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch top products' };
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await API.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  // Create product review
  createReview: async (productId, reviewData) => {
    try {
      const response = await API.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create review' };
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      const response = await API.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await API.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await API.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },
};

export default productAPI;