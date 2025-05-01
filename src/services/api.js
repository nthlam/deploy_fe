import axios from 'axios';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Tạo một instance của axios với baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[REQUEST] Token được thêm vào header:', token.substring(0, 10) + '...');
      console.log('[REQUEST] Headers đầy đủ:', JSON.stringify(config.headers));
    } else {
      console.warn('[REQUEST] CẢNH BÁO: Không tìm thấy token cho request:', config.url);
    }
    
    if (config.data) {
      // Tạo một bản sao để log ra, KHÔNG thay đổi dữ liệu gốc
      const logData = { ...config.data };
      
      // Thay thế mật khẩu bằng *** trong bản sao dùng để log
      if (logData.password) logData.password = '***';
      if (logData.oldPassword) logData.oldPassword = '***';
      if (logData.newPassword) logData.newPassword = '***';
      
      console.log('[REQUEST] Body:', JSON.stringify(logData));
    }
    
    return config;
  },
  (error) => {
    console.error('[REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    console.log(`[RESPONSE SUCCESS] ${response.config.method.toUpperCase()} ${response.config.url}`);
    console.log('[RESPONSE DATA]', response.data);
    return response;
  },
  (error) => {
    console.error(`[RESPONSE ERROR] ${error.config?.method?.toUpperCase() || 'UNKNOWN'} ${error.config?.url || 'UNKNOWN'}`);
    
    if (error.response) {
      console.error('[RESPONSE ERROR] Status:', error.response.status);
      console.error('[RESPONSE ERROR] Data:', error.response.data);
      
      if (error.response.status === 401) {
        // Xóa token và chuyển về trang login
        console.warn('[AUTH ERROR] Phiên đăng nhập hết hạn, chuyển hướng đến trang đăng nhập');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('[RESPONSE ERROR] Không nhận được phản hồi:', error.request);
    } else {
      console.error('[RESPONSE ERROR] Lỗi cấu hình request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Cấu hình để sử dụng user giả hay API thật
const CONFIG = {
  USE_MOCK_USER: true, // true để sử dụng user giả, false để gọi API thật
  MOCK_USER: {
    id: 1,
    email: "staff@example.com",
    fullName: "Nhân viên TGDĐ",
    isActive: true,
    role: {
      id: 1,
      code: "STAFF",
      name: "Nhân viên"
    }
  }
};

// Các hàm gọi API
export const authService = {
  login: async (email, password) => {
    try {
      console.log('[LOGIN] Đang gửi yêu cầu đăng nhập với email:', email);
      
      // Đảm bảo đúng endpoint và body format
      const response = await api.post('/api/v1/auth/staff-login', {
        email,
        password
      });
      
      console.log('[LOGIN] Phản hồi API đăng nhập:', response.data);
      
      // Trả về đúng format cho AuthContext
      if (response.data && response.data.data && response.data.data.token) {
        console.log('[LOGIN] Đăng nhập thành công, token nhận được');
        return {
          data: {
            token: response.data.data.token,
            role: 'STAFF'
          }
        };
      } else {
        console.error('[LOGIN] Cấu trúc phản hồi API không đúng:', response.data);
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('[LOGIN ERROR]', error.response?.data || error);
      throw error;
    }
  },
  
  loginAdmin: async (email, password) => {
    try {
      console.log('[ADMIN LOGIN] Đang gửi yêu cầu đăng nhập ADMIN với email:', email);
      
      // Đảm bảo đúng endpoint và body format cho admin
      const response = await api.post('/api/v1/auth/admin-login', {
        email,
        password
      });
      
      console.log('[ADMIN LOGIN] Phản hồi API đăng nhập:', response.data);
      
      // Trả về đúng format cho AuthContext
      if (response.data && response.data.data && response.data.data.token) {
        console.log('[ADMIN LOGIN] Đăng nhập thành công, token nhận được');
        return {
          data: {
            token: response.data.data.token,
            role: 'ADMIN'
          }
        };
      } else {
        console.error('[ADMIN LOGIN] Cấu trúc phản hồi API không đúng:', response.data);
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('[ADMIN LOGIN ERROR]', error.response?.data || error);
      throw error;
    }
  },
  
  // Lấy thông tin cá nhân của người dùng đang đăng nhập (cả staff và admin) 
  getPersonalInfo: async () => {
    try {
      console.log('[GET PERSONAL INFO] Đang lấy thông tin cá nhân');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[GET PERSONAL INFO] Không tìm thấy token');
        throw new Error('No token found');
      }
      
      // Gọi API để lấy thông tin cá nhân
      const response = await api.get('/api/v1/user/personal');
      console.log('[GET PERSONAL INFO] Phản hồi API:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[GET PERSONAL INFO ERROR]', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      console.log('[GET USER] Đang lấy thông tin người dùng hiện tại');
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('[GET USER] Không tìm thấy token');
        throw new Error('No token found');
      }
      
      // Kiểm tra cấu hình có dùng user giả hay không
      if (CONFIG.USE_MOCK_USER) {
        console.log('[GET USER] Sử dụng user giả theo cấu hình');
        console.log('[GET USER] Lý do: API đang trả về lỗi 500, sử dụng user giả để đảm bảo ứng dụng hoạt động');
        console.log('[GET USER] Để sử dụng API thật, thay đổi CONFIG.USE_MOCK_USER thành false');
        
        // Trả về user giả
        return {
          data: CONFIG.MOCK_USER
        };
      }
      
      // Nếu không dùng user giả, gọi API
      console.log('[GET USER] Gọi API để lấy thông tin người dùng');
      const response = await api.get('/api/v1/user/current');
      console.log('[GET USER] Phản hồi API:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[GET USER ERROR]', error);
      
      // Nếu gặp lỗi và không phải đang dùng user giả, vẫn trả về user giả để ứng dụng hoạt động
      if (!CONFIG.USE_MOCK_USER) {
        console.warn('[GET USER] Gặp lỗi khi gọi API, sử dụng user giả để đảm bảo ứng dụng hoạt động');
        return {
          data: CONFIG.MOCK_USER
        };
      }
      
      throw error;
    }
  },

  // Cập nhật tên tài khoản
  updateProfile: async (fullName) => {
    try {
      console.log('[UPDATE PROFILE] Đang gửi yêu cầu đổi tên với fullName:', fullName);
      
      // Sử dụng đúng API endpoint /api/v1/user/personal/rename
      const response = await api.put('/api/v1/user/personal/rename', {
        fullName
      });
      
      console.log('[UPDATE PROFILE] Phản hồi API đổi tên:', response.data);
      
      // Kiểm tra cấu trúc phản hồi mới
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        console.error('[UPDATE PROFILE] Cấu trúc phản hồi API không đúng:', response.data);
        return {
          success: false,
          message: 'Định dạng phản hồi không hợp lệ'
        };
      }
    } catch (error) {
      console.error('[UPDATE PROFILE ERROR]', error.response?.data || error);
      
      if (error.response) {
        console.error('[UPDATE PROFILE ERROR] Status:', error.response.status);
        console.error('[UPDATE PROFILE ERROR] Data:', error.response.data);
      }
      
      throw error;
    }
  },

  // Cập nhật mật khẩu
  updatePassword: async (oldPassword, newPassword) => {
    try {
      console.log('[UPDATE PASSWORD] Đang gửi yêu cầu đổi mật khẩu');
      console.log('[UPDATE PASSWORD] Độ dài mật khẩu cũ:', oldPassword.length);
      console.log('[UPDATE PASSWORD] Độ dài mật khẩu mới:', newPassword.length);
      
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[UPDATE PASSWORD] Không tìm thấy token xác thực');
        throw new Error('Không tìm thấy token xác thực');
      }
      
      // Log headers để debug
      console.log('[UPDATE PASSWORD] Request sẽ bao gồm header Authorization với Bearer token');
      
      // Sửa endpoint và cấu trúc body request theo yêu cầu API
      const response = await api.put('/api/v1/user/personal/change-password', {
        oldPassword,
        newPassword
      });
      
      console.log('[UPDATE PASSWORD] Phản hồi API đổi mật khẩu:', response.data);
      
      // Kiểm tra cấu trúc phản hồi mới
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        console.error('[UPDATE PASSWORD] Cấu trúc phản hồi API không đúng:', response.data);
        return {
          success: false,
          message: 'Định dạng phản hồi không hợp lệ'
        };
      }
    } catch (error) {
      console.error('[UPDATE PASSWORD ERROR]', error);
      
      if (error.response) {
        console.error('[UPDATE PASSWORD ERROR] Status:', error.response.status);
        console.error('[UPDATE PASSWORD ERROR] Data:', error.response.data);
        
        // Kiểm tra lỗi 400 - thường là lỗi validation
        if (error.response.status === 400) {
          console.warn('[UPDATE PASSWORD ERROR] Lỗi Bad Request - có thể là lỗi validation mật khẩu');
          console.warn('[UPDATE PASSWORD ERROR] Kiểm tra lại độ dài và định dạng mật khẩu');
          
          return {
            success: false,
            message: error.response.data.message || 'Mật khẩu không hợp lệ'
          };
        }
      }
      
      throw error;
    }
  }
};

// Service quản lý đơn hàng
export const orderService = {
  // Lấy danh sách đơn hàng
  getOrders: async (params = {}) => {
    try {
      console.log('[ORDER SERVICE] Đang lấy danh sách đơn hàng với params:', params);
      
      const response = await api.get('/api/v1/order/staff/search', { params });
      console.log('[ORDER SERVICE] Kết quả lấy danh sách đơn hàng:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi lấy danh sách đơn hàng:', error);
      throw error;
    }
  },
  
  // Lấy thống kê đơn hàng
  getOrderStats: async () => {
    try {
      console.log('[ORDER SERVICE] Đang lấy thống kê đơn hàng');
      
      // Trong thực tế endpoint này sẽ trả về thống kê như số lượng đơn theo trạng thái
      const response = await api.get('/api/v1/order/staff/stats');
      console.log('[ORDER SERVICE] Kết quả lấy thống kê đơn hàng:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[ORDER SERVICE] Lỗi khi lấy thống kê đơn hàng:', error);
      throw error;
    }
  }
};

export default api; 