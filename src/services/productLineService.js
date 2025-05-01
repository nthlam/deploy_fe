import api from './api';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Dịch vụ quản lý dòng sản phẩm
export const productLineService = {
  // Lấy danh sách dòng sản phẩm
  getProductLines: async () => {
    try {
      console.log('[PRODUCT-LINE SERVICE] Đang lấy danh sách dòng sản phẩm');
      const response = await api.get('/api/v1/product-line/search');
      console.log('[PRODUCT-LINE SERVICE] Đã lấy danh sách dòng sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi lấy danh sách dòng sản phẩm:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết dòng sản phẩm theo ID
  getProductLineById: async (id) => {
    try {
      console.log('[PRODUCT-LINE SERVICE] Đang lấy thông tin dòng sản phẩm có ID:', id);
      const response = await api.get(`/api/v1/product-line/${id}`);
      console.log('[PRODUCT-LINE SERVICE] Đã lấy thông tin dòng sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi lấy thông tin dòng sản phẩm:', error);
      throw error;
    }
  },

  // Tạo dòng sản phẩm mới
  createProductLine: async (productLineData) => {
    try {
      // Chuyển đổi số nguyên đối với ID
      const data = {
        name: productLineData.name,
        code: productLineData.code,
        brandId: parseInt(productLineData.brandId, 10),
        categoryId: parseInt(productLineData.categoryId, 10)
      };
      
      console.log('[PRODUCT-LINE SERVICE] Đang tạo dòng sản phẩm mới:', data);
      const response = await api.post('/api/v1/product-line', data);
      console.log('[PRODUCT-LINE SERVICE] Đã tạo dòng sản phẩm mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi tạo dòng sản phẩm mới:', error);
      throw error;
    }
  },

  // Cập nhật thông tin dòng sản phẩm
  updateProductLine: async (productLineData) => {
    try {
      // Chuyển đổi số nguyên đối với ID
      const data = {
        id: parseInt(productLineData.id, 10),
        name: productLineData.name,
        code: productLineData.code,
        brandId: parseInt(productLineData.brandId, 10),
        categoryId: parseInt(productLineData.categoryId, 10)
      };
      
      console.log('[PRODUCT-LINE SERVICE] Đang cập nhật dòng sản phẩm:', data);
      const response = await api.put('/api/v1/product-line', data);
      console.log('[PRODUCT-LINE SERVICE] Đã cập nhật dòng sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi cập nhật dòng sản phẩm:', error);
      throw error;
    }
  },

  // Xóa dòng sản phẩm
  deleteProductLine: async (id) => {
    try {
      console.log('[PRODUCT-LINE SERVICE] Đang xóa dòng sản phẩm có ID:', id);
      const response = await api.delete(`/api/v1/product-line/${id}`);
      console.log('[PRODUCT-LINE SERVICE] Đã xóa dòng sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi xóa dòng sản phẩm:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm của dòng sản phẩm theo ID
  getProductsByProductLineId: async (productLineId) => {
    try {
      console.log('[PRODUCT-LINE SERVICE] Đang lấy danh sách sản phẩm của dòng sản phẩm có ID:', productLineId);
      const response = await api.get(`/api/v1/product/product-line/${productLineId}`);
      console.log('[PRODUCT-LINE SERVICE] Đã lấy danh sách sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT-LINE SERVICE] Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  }
};

export default productLineService; 