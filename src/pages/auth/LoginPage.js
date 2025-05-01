import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    console.log('[LOGIN PAGE] Bắt đầu đăng nhập với email:', email);
    
    try {
      // Kiểm tra email và password đã được nhập chưa
      if (!email || !password) {
        console.log('[LOGIN PAGE] Thiếu thông tin đăng nhập');
        setError("Vui lòng nhập đầy đủ email và mật khẩu");
        setIsLoading(false);
        return;
      }

      // Thử đăng nhập
      console.log('[LOGIN PAGE] Đang gọi API đăng nhập...');
      const result = await login(email, password);
      console.log('[LOGIN PAGE] Kết quả đăng nhập:', result);
      
      if (result.success) {
        console.log('[LOGIN PAGE] Đăng nhập thành công, chuyển hướng đến trang chủ');
        
        // Lưu lại email đã đăng nhập thành công
        try {
          localStorage.setItem('lastLoginEmail', email);
          console.log('[LOGIN PAGE] Đã lưu email đăng nhập gần nhất:', email);
        } catch (storageError) {
          console.error('[LOGIN PAGE] Lỗi khi lưu email vào localStorage:', storageError);
        }
        
        // Kiểm tra quyền và chuyển hướng tương ứng
        const user = result.user;
        console.log('[LOGIN PAGE] Vai trò người dùng:', user?.role);
        
        if (user && user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.error('[LOGIN PAGE] Đăng nhập thất bại:', result.message);
        setError(result.message || "Đăng nhập không thành công");
      }
    } catch (err) {
      console.error('[LOGIN PAGE] Lỗi khi xử lý đăng nhập:', err);
      setError(err.message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setIsLoading(false);
      console.log('[LOGIN PAGE] Kết thúc quá trình đăng nhập');
    }
  };

  return (
    <div>
      {/* Render form đăng nhập */}
    </div>
  );
};

export default LoginPage; 