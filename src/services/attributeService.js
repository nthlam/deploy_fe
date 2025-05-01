import api from './api';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Dịch vụ quản lý thuộc tính sản phẩm
export const attributeService = {
  // Lấy danh sách thuộc tính theo danh mục
  getAttributesByCategory: async (categoryId) => {
    try {
      console.log('[ATTRIBUTE SERVICE] Đang lấy danh sách thuộc tính của danh mục:', categoryId);
      const response = await api.get(`/api/v1/attribute/category/${categoryId}`);
      console.log('[ATTRIBUTE SERVICE] Đã lấy danh sách thuộc tính:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ATTRIBUTE SERVICE] Lỗi khi lấy danh sách thuộc tính:', error);
      throw error;
    }
  },

  // Tạo thuộc tính mới
  addAttribute: async (name, categoryId) => {
    try {
      console.log('[ATTRIBUTE SERVICE] Đang thêm thuộc tính mới:', { name, categoryId });
      const response = await api.post('/api/v1/attribute', { name, categoryId });
      console.log('[ATTRIBUTE SERVICE] Đã thêm thuộc tính mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ATTRIBUTE SERVICE] Lỗi khi thêm thuộc tính mới:', error);
      throw error;
    }
  },

  // Cập nhật thông tin thuộc tính
  updateAttribute: async (id, name) => {
    try {
      console.log('[ATTRIBUTE SERVICE] Đang cập nhật thuộc tính:', { id, name });
      const response = await api.put('/api/v1/attribute', { id, name });
      console.log('[ATTRIBUTE SERVICE] Đã cập nhật thuộc tính:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ATTRIBUTE SERVICE] Lỗi khi cập nhật thuộc tính:', error);
      throw error;
    }
  },

  // Xóa thuộc tính
  deleteAttribute: async (id) => {
    try {
      console.log('[ATTRIBUTE SERVICE] Đang xóa thuộc tính có ID:', id);
      const response = await api.delete(`/api/v1/attribute/${id}`);
      console.log('[ATTRIBUTE SERVICE] Đã xóa thuộc tính:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ATTRIBUTE SERVICE] Lỗi khi xóa thuộc tính:', error);
      throw error;
    }
  }
};

export default attributeService; 