import api from './api';

// Dịch vụ quản lý đơn hàng
export const orderService = {
  // Tìm kiếm đơn hàng với phân trang và bộ lọc
  searchOrders: async (params = {}) => {
    try {
      console.log('[ORDER SERVICE] Đang tìm kiếm đơn hàng với params:', params);
      const config = Object.keys(params).length > 0 ? { params } : {};
      const response = await api.get('/api/v1/order/staff/search', config);
      console.log('[ORDER SERVICE] Kết quả tìm kiếm đơn hàng:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi tìm kiếm đơn hàng:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      console.log('[ORDER SERVICE] Đang lấy thông tin chi tiết đơn hàng có ID:', id);
      const response = await api.get(`/api/v1/order/staff/${id}`);
      console.log('[ORDER SERVICE] Đã lấy thông tin chi tiết đơn hàng:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi lấy thông tin chi tiết đơn hàng:', error);
      throw error;
    }
  },

  // Xác nhận đơn hàng (PENDING -> CONFIRMED)
  confirmOrder: async (id) => {
    try {
      console.log('[ORDER SERVICE] Đang xác nhận đơn hàng có ID:', id);
      const response = await api.put(`/api/v1/order/staff/confirm/${id}`);
      console.log('[ORDER SERVICE] Đã xác nhận đơn hàng:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi xác nhận đơn hàng:', error);
      throw error;
    }
  },

  // Chuyển cho bên giao hàng
  deliverOrder: async (id) => {
    try {
      console.log('[ORDER SERVICE] Đang chuyển đơn hàng sang giao hàng, ID:', id);
      const response = await api.put(`/api/v1/order/staff/deliver/${id}`);
      console.log('[ORDER SERVICE] Đã chuyển đơn hàng sang giao hàng:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi chuyển đơn hàng sang giao hàng:', error);
      throw error;
    }
  },

  // Xác nhận đơn hàng đã nhận (DELIVERING -> RECEIVED)
  receiveOrder: async (id) => {
    try {
      console.log('[ORDER SERVICE] Đang xác nhận đơn hàng đã nhận, ID:', id);
      const response = await api.put(`/api/v1/order/staff/receive/${id}`);
      console.log('[ORDER SERVICE] Đã xác nhận đơn hàng đã nhận:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi xác nhận đơn hàng đã nhận:', error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (id) => {
    try {
      console.log('[ORDER SERVICE] Đang hủy đơn hàng có ID:', id);
      const response = await api.put(`/api/v1/order/staff/cancel/${id}`);
      console.log('[ORDER SERVICE] Đã hủy đơn hàng:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi hủy đơn hàng:', error);
      throw error;
    }
  }
};

export default orderService; 