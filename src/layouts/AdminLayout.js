import React from 'react';
import { Container, Row, Col, Navbar, Dropdown, Badge } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar admin-sidebar">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-grow-1">
        <Navbar className="navbar-pastel" style={{ backgroundImage: 'linear-gradient(90deg, #f96f3a, #f96)', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
          <Container fluid>
            <Navbar.Brand style={{ color: '#fff', fontWeight: '600' }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Admin Dashboard
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <div className="d-flex align-items-center me-3">
                <Badge bg="light" text="dark" className="me-3" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <i className="bi bi-bell me-1"></i> Thông báo
                </Badge>
                <Badge bg="light" text="dark" className="me-3" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <i className="bi bi-gear me-1"></i> Cài đặt
                </Badge>
              </div>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-user" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <i className="bi bi-person-circle me-1"></i> {currentUser?.fullName || 'Admin'}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                  <Dropdown.Item as={Link} to="/admin/profile">
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

export default AdminLayout; 