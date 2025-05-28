import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const AdminSidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Danh sách menu cho admin
  const menuItems = [
    { path: '/admin', icon: 'bi bi-house-fill', label: 'Trang chủ Admin' },
    { path: '/admin/staff', icon: 'bi bi-people-fill', label: 'Quản lý nhân viên' },
    { path: '/admin/admins', icon: 'bi bi-person-badge-fill', label: 'Quản lý admin' },
  ];

  return (
    <>
      <div className="sidebar-logo">
        <h4 className="text-center mb-0">
          <span style={{ color: '#000000', fontWeight: 'bold' }}>
            <span>TechShop</span>
            <span style={{ fontSize: '0.7em' }}>.com</span>
          </span>
        </h4>
        <p className="text-center text-dark mt-1" style={{ fontSize: '0.8em' }}>Quản trị viên</p>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
              <i className={`${item.icon} me-2`}></i> {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto p-3 text-center text-white-50" style={{ fontSize: '0.8em' }}>
        <p className="mb-0">Đăng nhập với: {currentUser?.email || 'admin@example.com'}</p>
      </div>
    </>
  );
};

// Helper component để tạo NavLink tương tự như react-router-dom v6
const NavLink = ({ to, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={isActive ? (className ? `${className} active` : 'active') : className || ''}
    >
      {children}
    </Link>
  );
};

export default AdminSidebar; 