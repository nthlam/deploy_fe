import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Component để bảo vệ các route cần xác thực
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Đang kiểm tra xác thực
  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  // Chưa đăng nhập, chuyển về trang login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Đã đăng nhập, hiển thị component
  return children;
};

export default ProtectedRoute; 