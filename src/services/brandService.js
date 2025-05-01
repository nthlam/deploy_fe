import api from './api';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Dịch vụ quản lý nhãn hàng
export const brandService = {
  // Lấy danh sách nhãn hàng
  getBrands: async () => {
    try {
      console.log('[BRAND SERVICE] Đang lấy danh sách nhãn hàng');
      const response = await api.get('/api/v1/brand');
      console.log('[BRAND SERVICE] Đã lấy danh sách nhãn hàng:', response.data);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data && Array.isArray(response.data.data)) {
        console.log('[BRAND SERVICE] Số lượng nhãn hàng:', response.data.data.length);
        const brands = response.data.data;
        
        // Kiểm tra xem có nhãn hàng nào có image không phải null không
        const hasImageBrand = brands.some(brand => brand.image !== null);
        console.log('[BRAND SERVICE] Có nhãn hàng với image không null:', hasImageBrand);
        
        return response.data;
      } else {
        console.warn('[BRAND SERVICE] Cấu trúc dữ liệu không đúng:', response.data);
        return { data: [] }; // Trả về mảng rỗng nếu không đúng cấu trúc
      }
    } catch (error) {
      console.error('[BRAND SERVICE] Lỗi khi lấy danh sách nhãn hàng:', error);
      console.error('[BRAND SERVICE] Chi tiết lỗi:', error.response?.data || error.message);
      throw error;
    }
  },

  // Thêm nhãn hàng mới
  addBrand: async (brandData) => {
    try {
      console.log('[BRAND SERVICE] Đang thêm nhãn hàng mới:', brandData.name);
      
      // Chuẩn bị dữ liệu gửi đi
      const payload = {
        name: brandData.name
      };
      
      // Thêm image nếu có
      if (brandData.image && brandData.image.base64) {
        payload.image = {
          base64: brandData.image.base64,
          isPrimary: true
        };
      }
      
      // Log chi tiết về dữ liệu gửi đi
      console.log('[BRAND SERVICE] Thêm mới - Dữ liệu gửi đi:', {
        name: payload.name,
        hasImage: !!payload.image,
        imageBase64Length: payload.image?.base64 ? payload.image.base64.substring(0, 30) + '...' : 'không có'
      });
      
      const response = await api.post('/api/v1/brand', payload);
      console.log('[BRAND SERVICE] Đã thêm nhãn hàng mới, phản hồi:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[BRAND SERVICE] Lỗi khi thêm nhãn hàng mới:', error);
      console.error('[BRAND SERVICE] Chi tiết lỗi:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật thông tin nhãn hàng
  updateBrand: async (brandData) => {
    try {
      console.log('[BRAND SERVICE] Đang cập nhật nhãn hàng:', brandData.name);
      
      // Chuẩn bị dữ liệu cập nhật
      const payload = {
        id: brandData.id,
        name: brandData.name
      };
      
      // Thêm image nếu có
      if (brandData.image && brandData.image.base64) {
        payload.image = {
          base64: brandData.image.base64,
          isPrimary: true
        };
        
        // Nếu có ID của ảnh cũ, không gửi lên để tránh backend hiểu là giữ ảnh cũ
        // Không thêm trường id vào image để backend hiểu là tạo ảnh mới
      }
      
      // Log chi tiết về dữ liệu gửi đi
      console.log('[BRAND SERVICE] Cập nhật - Dữ liệu gửi đi:', {
        id: payload.id,
        name: payload.name,
        hasImage: !!payload.image,
        imageBase64Length: payload.image?.base64 ? payload.image.base64.substring(0, 30) + '...' : 'không có'
      });
      
      const response = await api.put('/api/v1/brand', payload);
      console.log('[BRAND SERVICE] Đã cập nhật nhãn hàng, phản hồi:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[BRAND SERVICE] Lỗi khi cập nhật nhãn hàng:', error);
      console.error('[BRAND SERVICE] Chi tiết lỗi:', error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa nhãn hàng
  deleteBrand: async (id) => {
    try {
      console.log('[BRAND SERVICE] Đang xóa nhãn hàng có ID:', id);
      const response = await api.delete(`/api/v1/brand/${id}`);
      console.log('[BRAND SERVICE] Đã xóa nhãn hàng, phản hồi:', response.data);
      return response.data;
    } catch (error) {
      console.error('[BRAND SERVICE] Lỗi khi xóa nhãn hàng:', error);
      console.error('[BRAND SERVICE] Chi tiết lỗi:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default brandService; 