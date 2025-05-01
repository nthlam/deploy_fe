import React from 'react';
import { Container, Row, Col, Navbar, Dropdown } from 'react-bootstrap';
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
        <Navbar className="navbar-pastel">
          <Container fluid>
            <Navbar.Brand>Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-user">
                  <i className="bi bi-person-circle me-1"></i> {currentUser?.fullName || 'Admin'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
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