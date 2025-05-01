const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Hàm đăng nhập
export const login = async (email, password) => {
  console.log('[AUTH SERVICE] Bắt đầu đăng nhập với email:', email);
  
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('[AUTH SERVICE] Phản hồi API đăng nhập:', { status: response.status, success: data.success });
    
    if (data.success) {
      // Lưu token vào localStorage
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('[AUTH SERVICE] Đã lưu token và thông tin người dùng vào localStorage');
      } catch (storageError) {
        console.error('[AUTH SERVICE] Lỗi khi lưu token và thông tin người dùng:', storageError);
      }
      
      return { success: true, user: data.user };
    } else {
      console.error('[AUTH SERVICE] Đăng nhập thất bại:', data.message);
      return { success: false, message: data.message || 'Đăng nhập thất bại' };
    }
  } catch (error) {
    console.error('[AUTH SERVICE] Lỗi khi gọi API đăng nhập:', error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Hàm đăng ký
export const register = async (userData) => {
  console.log('[AUTH SERVICE] Bắt đầu đăng ký tài khoản:', userData.email);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    console.log('[AUTH SERVICE] Phản hồi API đăng ký:', { status: response.status, success: data.success });
    
    return data;
  } catch (error) {
    console.error('[AUTH SERVICE] Lỗi khi gọi API đăng ký:', error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Hàm đăng xuất
export const logout = () => {
  console.log('[AUTH SERVICE] Đăng xuất người dùng');
  
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('[AUTH SERVICE] Đã xóa token và thông tin người dùng khỏi localStorage');
    return true;
  } catch (error) {
    console.error('[AUTH SERVICE] Lỗi khi đăng xuất:', error);
    return false;
  }
};

// Kiểm tra trạng thái đăng nhập
export const checkAuthStatus = () => {
  console.log('[AUTH SERVICE] Kiểm tra trạng thái đăng nhập');
  
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      console.log('[AUTH SERVICE] Người dùng đã đăng nhập:', user.email);
      return { isAuthenticated: true, user };
    } else {
      console.log('[AUTH SERVICE] Chưa đăng nhập');
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('[AUTH SERVICE] Lỗi khi kiểm tra trạng thái đăng nhập:', error);
    return { isAuthenticated: false, user: null };
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  console.log('[AUTH SERVICE] Lấy thông tin người dùng hiện tại');
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('[AUTH SERVICE] Không tìm thấy thông tin người dùng trong localStorage');
      return null;
    }
    
    const user = JSON.parse(userStr);
    console.log('[AUTH SERVICE] Đã lấy thông tin người dùng:', user.email);
    return user;
  } catch (error) {
    console.error('[AUTH SERVICE] Lỗi khi lấy thông tin người dùng:', error);
    return null;
  }
}; 