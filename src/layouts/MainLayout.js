import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <h4 className="text-center mb-0">
            <span style={{ color: '#000000', fontWeight: 'bold' }}>
              <span>the</span>gioididong
              <span style={{ fontSize: '0.7em' }}>.com</span>
            </span>
          </h4>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-house-door me-2"></i> Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-cart me-2"></i> Quản lý đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-phone me-2"></i> Quản lý sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-tags me-2"></i> Quản lý danh mục
            </NavLink>
          </li>
          <li>
            <NavLink to="/brands" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-building me-2"></i> Quản lý thương hiệu
            </NavLink>
          </li>
          <li>
            <NavLink to="/promotions" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-percent me-2"></i> Quản lý khuyến mãi
            </NavLink>
          </li>
        </ul>
      </div>
      
      {/* Main content */}
      <div className="flex-grow-1">
        <Navbar className="navbar-pastel">
          <Container fluid>
            <Navbar.Brand>Dashboard</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-user">
                  <i className="bi bi-person-circle me-1"></i> {currentUser?.fullName || 'Người dùng'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i> Tài khoản của tôi
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        <Container fluid className="main-content">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default MainLayout; 