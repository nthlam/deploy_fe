import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  
  // Danh sách menu
  const menuItems = [
    { path: '/', icon: 'bi bi-house-fill', label: 'Trang chủ' },
    { path: '/products', icon: 'bi bi-phone-fill', label: 'Sản phẩm' },
    { path: '/categories', icon: 'bi bi-list-ul', label: 'Danh mục sản phẩm' },
    { path: '/brands', icon: 'bi bi-building', label: 'Nhãn hàng' },
    { path: '/orders', icon: 'bi bi-cart-fill', label: 'Đơn hàng' },
    { path: '/promotions', icon: 'bi bi-tag-fill', label: 'Khuyến mãi' },
    // { path: '/customers', icon: 'bi bi-people-fill', label: 'Khách hàng' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 style={{ margin: 0, color: '#000', fontWeight: 'bold' }}>
          <span style={{ fontSize: '0.7em' }}>the</span>gioidigong
          <span style={{ fontSize: '0.5em' }}>.com</span>
        </h2>
      </div>
      
      <Nav className="flex-column sidebar-menu">
        {menuItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link 
              as={Link} 
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              style={{
                backgroundColor: location.pathname === item.path ? 'rgba(254, 232, 0, 0.2)' : 'transparent',
                color: 'white'
              }}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
        
        <Nav.Item className="mt-3">
          <hr className="border-secondary" />
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link 
            as={Link}
            to="/profile"
            className={location.pathname === '/profile' ? 'active' : ''}
            style={{
              backgroundColor: location.pathname === '/profile' ? 'rgba(254, 232, 0, 0.2)' : 'transparent',
              color: 'white'
            }}
          >
            <i className="bi bi-person-fill me-2"></i>
            Tài khoản
          </Nav.Link>
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link 
            onClick={logout}
            style={{ cursor: 'pointer', color: 'white' }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Đăng xuất
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar; 