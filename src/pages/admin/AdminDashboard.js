import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  
  // Lấy danh sách nhân viên (giả lập)
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        setLoading(true);
        // Trong môi trường thực tế, sẽ gọi API lấy danh sách
        // const response = await adminService.getUserList(2, 1, 5);
        // if (response && response.data) {
        //   setStaffList(response.data.content || []);
        // }
        
        // Dữ liệu giả lập
        const mockStaffList = [
          { id: 1, email: 'nhanvien1@tgdd.com', fullName: 'Nguyễn Văn A', isActive: true },
          { id: 2, email: 'nhanvien2@tgdd.com', fullName: 'Trần Thị B', isActive: true },
          { id: 3, email: 'nhanvien3@tgdd.com', fullName: 'Lê Văn C', isActive: false },
          { id: 4, email: 'nhanvien4@tgdd.com', fullName: 'Phạm Thị D', isActive: true },
          { id: 5, email: 'nhanvien5@tgdd.com', fullName: 'Hoàng Văn E', isActive: true }
        ];
        
        setStaffList(mockStaffList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaffList();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Trang quản trị</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <h5>Xin chào, {currentUser?.fullName || 'Quản trị viên'}!</h5>
          <p className="text-muted">Chào mừng đến với hệ thống quản lý của Thế Giới Di Động - Trang quản trị</p>
        </Card.Body>
      </Card>
      
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <i className="bi bi-people-fill me-2"></i> Quản lý nhân viên
            </Card.Header>
            <Card.Body>
              <p>
                Quản lý tất cả tài khoản nhân viên trong hệ thống. Bạn có thể:
              </p>
              <ul>
                <li>Xem danh sách và tìm kiếm nhân viên</li>
                <li>Kích hoạt/vô hiệu hóa tài khoản nhân viên</li>
                <li>Thêm, sửa, xóa thông tin nhân viên</li>
              </ul>
              <Link to="/admin/staff" className="btn btn-primary mt-2">
                Quản lý nhân viên <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-info text-white">
              <i className="bi bi-person-badge-fill me-2"></i> Quản lý quản trị viên
            </Card.Header>
            <Card.Body>
              <p>
                Quản lý tài khoản quản trị viên với quyền cao nhất trong hệ thống. Bạn có thể:
              </p>
              <ul>
                <li>Xem danh sách quản trị viên</li>
                <li>Kích hoạt/vô hiệu hóa tài khoản quản trị viên</li>
                <li>Thêm quản trị viên mới khi cần</li>
              </ul>
              <Link to="/admin/admins" className="btn btn-info mt-2 text-white">
                Quản lý quản trị viên <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span><i className="bi bi-people-fill me-2"></i> Danh sách nhân viên</span>
          <Link to="/admin/staff" className="btn btn-light btn-sm">
            Xem tất cả
          </Link>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>ID</th>
                  <th style={{ width: '25%' }}>Email</th>
                  <th style={{ width: '25%' }}>Tên nhân viên</th>
                  <th style={{ width: '15%' }}>Trạng thái</th>
                  <th style={{ width: '30%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3">Đang tải dữ liệu...</td>
                  </tr>
                ) : staffList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3">Không có dữ liệu nhân viên</td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff.id}>
                      <td>{staff.id}</td>
                      <td>{staff.email}</td>
                      <td>{staff.fullName}</td>
                      <td className="text-center">
                        <span className={`badge ${staff.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {staff.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/staff?id=${staff.id}`} className="btn btn-sm btn-info me-1 text-white">
                          <i className="bi bi-eye"></i> Chi tiết
                        </Link>
                        <Link to={`/admin/staff?edit=${staff.id}`} className="btn btn-sm btn-warning me-1 text-white">
                          <i className="bi bi-pencil"></i> Chỉnh sửa
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <div className="text-center mt-3">
            <Link to="/admin/staff" className="btn btn-primary">
              Quản lý tất cả nhân viên <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard; 