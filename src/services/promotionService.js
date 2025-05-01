import api from './api';

// Dịch vụ quản lý khuyến mãi
export const promotionService = {
  // Hàm định dạng ngày tháng theo yêu cầu API
  formatDateForAPI: (isoDateString) => {
    if (!isoDateString) return null;
    
    // Lấy phần ngày từ chuỗi ISO
    const datePart = isoDateString.split('T')[0];
    // Thêm phần giờ cố định
    return `${datePart}T17:00:00.000Z`;
  },
  
  // Lấy danh sách khuyến mãi với phân trang và tìm kiếm
  searchPromotions: async (params = {}) => {
    try {
      // Đảm bảo tham số page luôn có giá trị ít nhất là 1
      const searchParams = { ...params };
      if (!searchParams.page || searchParams.page < 1) {
        searchParams.page = 1;
      }
      
      console.log('[PROMOTION SERVICE] Đang tìm kiếm khuyến mãi với params:', searchParams);
      const config = Object.keys(searchParams).length > 0 ? { params: searchParams } : {};
      
      // In ra full URL để debug
      const url = '/api/v1/promotion/search';
      console.log('[PROMOTION SERVICE] Full request URL:', api.defaults.baseURL + url + 
        '?' + Object.entries(searchParams).map(([key, val]) => `${key}=${val}`).join('&'));
        
      const response = await api.get(url, config);
      console.log('[PROMOTION SERVICE] Kết quả tìm kiếm khuyến mãi:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PROMOTION SERVICE] Lỗi khi tìm kiếm khuyến mãi:', error);
      if (error.response) {
        console.error('[PROMOTION SERVICE] Status code:', error.response.status);
        console.error('[PROMOTION SERVICE] Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Lấy thông tin chi tiết khuyến mãi theo ID
  getPromotionById: async (id) => {
    try {
      console.log('[PROMOTION SERVICE] Đang lấy thông tin chi tiết khuyến mãi có ID:', id);
      const response = await api.get(`/api/v1/promotion/${id}`);
      console.log('[PROMOTION SERVICE] Đã lấy thông tin chi tiết khuyến mãi:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PROMOTION SERVICE] Lỗi khi lấy thông tin chi tiết khuyến mãi:', error);
      throw error;
    }
  },

  // Thêm khuyến mãi mới
  addPromotion: async (promotionData) => {
    try {
      // Chuyển đổi định dạng ngày
      let startDate = null;
      if (promotionData.startDate) {
        if (typeof promotionData.startDate === 'string') {
          // Nếu đã là string, chuyển đổi sang định dạng yêu cầu
          const datePart = promotionData.startDate.split('T')[0];
          startDate = `${datePart}T17:00:00.000Z`;
        } else {
          // Nếu là Date, chuyển sang ISO rồi xử lý
          const datePart = promotionData.startDate.toISOString().split('T')[0];
          startDate = `${datePart}T17:00:00.000Z`;
        }
      }

      let endDate = null;
      if (promotionData.endDate) {
        if (typeof promotionData.endDate === 'string') {
          const datePart = promotionData.endDate.split('T')[0];
          endDate = `${datePart}T17:00:00.000Z`;
        } else {
          const datePart = promotionData.endDate.toISOString().split('T')[0];
          endDate = `${datePart}T17:00:00.000Z`;
        }
      }

      // Đảm bảo dữ liệu đúng định dạng API yêu cầu
      const payload = {
        name: promotionData.name,
        value: parseFloat(promotionData.value),
        startDate,
        endDate,
        categoryId: parseInt(promotionData.categoryId)
      };
      
      console.log('[PROMOTION SERVICE] Đang thêm khuyến mãi mới:', payload);
      console.log('[PROMOTION SERVICE] Request body:', JSON.stringify(payload, null, 2));
      
      const response = await api.post('/api/v1/promotion', payload);
      console.log('[PROMOTION SERVICE] Đã thêm khuyến mãi mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PROMOTION SERVICE] Lỗi khi thêm khuyến mãi mới:', error);
      if (error.response) {
        console.error('[PROMOTION SERVICE] Status:', error.response.status);
        console.error('[PROMOTION SERVICE] Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Cập nhật thông tin khuyến mãi
  updatePromotion: async (promotionData) => {
    try {
      // Đảm bảo dữ liệu đúng định dạng API yêu cầu
      if (!promotionData.id) {
        console.error('[PROMOTION SERVICE] Lỗi: ID khuyến mãi không được để trống khi cập nhật');
        throw new Error('ID khuyến mãi không được để trống khi cập nhật');
      }

      console.log('[PROMOTION SERVICE] ID khuyến mãi cập nhật:', promotionData.id, 'kiểu:', typeof promotionData.id);

      // Chuyển đổi định dạng ngày
      let startDate = null;
      if (promotionData.startDate) {
        if (typeof promotionData.startDate === 'string') {
          // Nếu đã là string, chuyển đổi sang định dạng yêu cầu
          const datePart = promotionData.startDate.split('T')[0];
          startDate = `${datePart}T17:00:00.000Z`;
        } else {
          // Nếu là Date, chuyển sang ISO rồi xử lý
          const datePart = promotionData.startDate.toISOString().split('T')[0];
          startDate = `${datePart}T17:00:00.000Z`;
        }
      }

      let endDate = null;
      if (promotionData.endDate) {
        if (typeof promotionData.endDate === 'string') {
          const datePart = promotionData.endDate.split('T')[0];
          endDate = `${datePart}T17:00:00.000Z`;
        } else {
          const datePart = promotionData.endDate.toISOString().split('T')[0];
          endDate = `${datePart}T17:00:00.000Z`;
        }
      }

      // Đảm bảo ID là số nguyên
      const promotionId = parseInt(promotionData.id);
      if (isNaN(promotionId)) {
        throw new Error('ID khuyến mãi không hợp lệ');
      }

      // Tạo payload đúng định dạng API
      const payload = {
        id: promotionId, // Đảm bảo ID luôn là số nguyên
        name: promotionData.name,
        value: parseFloat(promotionData.value),
        startDate,
        endDate,
        categoryId: parseInt(promotionData.categoryId)
      };
      
      console.log('[PROMOTION SERVICE] Đang cập nhật khuyến mãi:', payload);
      console.log('[PROMOTION SERVICE] Request body:', JSON.stringify(payload, null, 2));
      
      const response = await api.put('/api/v1/promotion', payload);
      console.log('[PROMOTION SERVICE] Đã cập nhật khuyến mãi:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PROMOTION SERVICE] Lỗi khi cập nhật khuyến mãi:', error);
      if (error.response) {
        console.error('[PROMOTION SERVICE] Status:', error.response.status);
        console.error('[PROMOTION SERVICE] Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Xóa khuyến mãi
  deletePromotion: async (id) => {
    try {
      console.log('[PROMOTION SERVICE] Đang xóa khuyến mãi có ID:', id);
      const response = await api.delete(`/api/v1/promotion/${id}`);
      console.log('[PROMOTION SERVICE] Đã xóa khuyến mãi:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PROMOTION SERVICE] Lỗi khi xóa khuyến mãi:', error);
      throw error;
    }
  }
};

export default promotionService; 