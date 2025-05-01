import api from './api';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Dịch vụ quản lý danh mục sản phẩm
export const categoryService = {
  // Lấy danh sách danh mục sản phẩm
  getCategories: async () => {
    try {
      console.log('[CATEGORY SERVICE] Đang lấy danh sách danh mục sản phẩm');
      const response = await api.get('/api/v1/category');
      console.log('[CATEGORY SERVICE] Đã lấy danh sách danh mục sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CATEGORY SERVICE] Lỗi khi lấy danh sách danh mục:', error);
      throw error;
    }
  },

  // Tra cứu danh mục sản phẩm theo tên
  searchCategoriesByName: async (name) => {
    try {
      console.log('[CATEGORY SERVICE] Đang tra cứu danh mục theo tên:', name);
      const response = await api.get('/api/v1/category/name', { params: { name } });
      console.log('[CATEGORY SERVICE] Kết quả tra cứu danh mục:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CATEGORY SERVICE] Lỗi khi tra cứu danh mục:', error);
      throw error;
    }
  },

  // Thêm danh mục sản phẩm mới
  addCategory: async (categoryName) => {
    try {
      console.log('[CATEGORY SERVICE] Đang thêm danh mục mới:', categoryName);
      const response = await api.post('/api/v1/category', { name: categoryName });
      console.log('[CATEGORY SERVICE] Đã thêm danh mục mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CATEGORY SERVICE] Lỗi khi thêm danh mục mới:', error);
      throw error;
    }
  },

  // Cập nhật thông tin danh mục
  updateCategory: async (id, name) => {
    try {
      console.log('[CATEGORY SERVICE] Đang cập nhật danh mục:', { id, name });
      const response = await api.put('/api/v1/category', { id, name });
      console.log('[CATEGORY SERVICE] Đã cập nhật danh mục:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CATEGORY SERVICE] Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  },

  // Xóa danh mục sản phẩm
  deleteCategory: async (id) => {
    try {
      console.log('[CATEGORY SERVICE] Đang xóa danh mục có ID:', id);
      const response = await api.delete(`/api/v1/category/${id}`);
      console.log('[CATEGORY SERVICE] Đã xóa danh mục:', response.data);
      return response.data;
    } catch (error) {
      console.error('[CATEGORY SERVICE] Lỗi khi xóa danh mục:', error);
      throw error;
    }
  }
};

export default categoryService; 