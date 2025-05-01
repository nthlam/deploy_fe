import api from './api';

// Service quản lý các chức năng dành cho admin
const adminService = {
  // Lấy danh sách tài khoản staff/admin (roleId: 1=admin, 2=staff)
  getUserList: async (roleId, page = 1, size = 10) => {
    try {
      console.log('[ADMIN SERVICE] Đang lấy danh sách tài khoản với roleId:', roleId);
      
      // Chuẩn bị tham số
      const params = {
        roleId,
        page,
        size
      };
      
      const response = await api.get('/api/v1/user/admin/search', { params });
      console.log('[ADMIN SERVICE] Kết quả lấy danh sách tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi lấy danh sách tài khoản:', error);
      throw error;
    }
  },
  
  // Tìm kiếm tài khoản 
  searchUsers: async (roleId, keyword, page = 1, size = 10) => {
    try {
      console.log('[ADMIN SERVICE] Đang tìm kiếm tài khoản với từ khóa:', keyword);
      
      // Chuẩn bị tham số
      const params = {
        roleId,
        keyword,
        page,
        size
      };
      
      const response = await api.get('/api/v1/user/admin/search', { params });
      console.log('[ADMIN SERVICE] Kết quả tìm kiếm tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi tìm kiếm tài khoản:', error);
      throw error;
    }
  },
  
  // Lấy thông tin chi tiết tài khoản
  getUserDetail: async (userId) => {
    try {
      console.log('[ADMIN SERVICE] Đang lấy thông tin chi tiết tài khoản ID:', userId);
      
      const response = await api.get(`/api/v1/user/admin/${userId}`);
      console.log('[ADMIN SERVICE] Thông tin chi tiết tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi lấy thông tin chi tiết tài khoản:', error);
      throw error;
    }
  },
  
  // Xóa tài khoản
  deleteUser: async (userId) => {
    try {
      console.log('[ADMIN SERVICE] Đang xóa tài khoản ID:', userId);
      
      const response = await api.delete(`/api/v1/user/admin/${userId}`);
      console.log('[ADMIN SERVICE] Kết quả xóa tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi xóa tài khoản:', error);
      throw error;
    }
  },
  
  // Thêm tài khoản mới (admin hoặc staff tùy theo roleId)
  createUser: async (userData) => {
    try {
      console.log('[ADMIN SERVICE] Đang tạo tài khoản mới:', userData);
      
      const response = await api.post('/api/v1/user/admin', userData);
      console.log('[ADMIN SERVICE] Kết quả tạo tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi tạo tài khoản:', error);
      throw error;
    }
  },
  
  // Cập nhật thông tin tài khoản
  updateUser: async (userData) => {
    try {
      console.log('[ADMIN SERVICE] Đang cập nhật tài khoản:', userData);
      
      const response = await api.put('/api/v1/user/admin', userData);
      console.log('[ADMIN SERVICE] Kết quả cập nhật tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi cập nhật tài khoản:', error);
      throw error;
    }
  },
  
  // Thay đổi trạng thái hoạt động của tài khoản (active/inactive)
  changeUserStatus: async (userId, isActive) => {
    try {
      console.log('[ADMIN SERVICE] Đang thay đổi trạng thái tài khoản ID:', userId, 'isActive:', isActive);
      
      const response = await api.put('/api/v1/user/admin/change-status', {
        id: userId,
        isActive
      });
      console.log('[ADMIN SERVICE] Kết quả thay đổi trạng thái tài khoản:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ADMIN SERVICE] Lỗi khi thay đổi trạng thái tài khoản:', error);
      throw error;
    }
  }
};

export default adminService; 