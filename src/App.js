import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CategoryManagement from './pages/categories/CategoryManagement';
import BrandManagement from './pages/brands/BrandManagement';
import ProductLineManagement from './pages/products/ProductLineManagement';
import OrderManagement from './pages/orders/OrderManagement';
import PromotionManagement from './pages/promotions/PromotionManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffManagement from './pages/admin/StaffManagement';
import useAuth from './hooks/useAuth';

// Component kiểm tra admin
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin())) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, loading, navigate]);

  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  if (!currentUser || !isAdmin()) {
    return null; // Quá trình chuyển hướng sẽ được xử lý bởi useEffect
  }

  return children;
};

// Component kiểm tra nhân viên
const StaffRoute = ({ children }) => {
  const { currentUser, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!currentUser || !isStaff())) {
      navigate('/login');
    }
  }, [currentUser, isStaff, loading, navigate]);

  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  if (!currentUser || !isStaff()) {
    return null; // Quá trình chuyển hướng sẽ được xử lý bởi useEffect
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Route public */}
        <Route path="/login" element={<Login />} />
        
        {/* Routes cho Staff */}
        <Route path="/" element={
          <StaffRoute>
            <MainLayout />
          </StaffRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="brands" element={<BrandManagement />} />
          <Route path="products" element={<ProductLineManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
        </Route>
        
        {/* Routes cho Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="staff" element={<StaffManagement roleId={2} />} />
          <Route path="admins" element={<StaffManagement roleId={1} />} />
        </Route>
        
        {/* Redirect các đường dẫn khác về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 