import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { orderService } from '../services/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho danh sách đơn hàng gần đây
  const [recentOrders, setRecentOrders] = useState([]);
  
  // State cho thống kê đơn hàng
  const [orderStats, setOrderStats] = useState([
    { title: 'Chờ xác nhận', value: '0', icon: 'bi bi-hourglass-split', color: '#ffc107', status: 'PENDING' },
    { title: 'Đang giao', value: '0', icon: 'bi bi-truck', color: '#17a2b8', status: 'DELIVERING' },
    { title: 'Đã hoàn thành', value: '0', icon: 'bi bi-check-circle-fill', color: '#28a745', status: 'RECEIVED' },
    { title: 'Đã hủy', value: '0', icon: 'bi bi-x-circle-fill', color: '#dc3545', status: 'CANCELLED' }
  ]);

  // Lấy dữ liệu đơn hàng khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách đơn hàng gần đây
        const ordersResponse = await orderService.getOrders({
          page: 1,
          size: 10
        });

        if (ordersResponse && ordersResponse.data) {
          setRecentOrders(ordersResponse.data.content || []);
          
          // Tính toán số liệu thống kê từ danh sách đơn hàng
          const allOrders = ordersResponse.data.content || [];
          
          // Đếm theo trạng thái
          const countByStatus = {
            PENDING: 0,
            CONFIRMED: 0,
            DELIVERING: 0,
            RECEIVED: 0,
            CANCELLED: 0
          };
          
          allOrders.forEach(order => {
            if (countByStatus[order.status] !== undefined) {
              countByStatus[order.status]++;
            }
          });
          
          // Cập nhật thống kê
          setOrderStats(prevStats => 
            prevStats.map(stat => ({
              ...stat,
              value: String(countByStatus[stat.status] || 0)
            }))
          );
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", err);
        setError("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm hiển thị badge trạng thái đơn hàng
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case 'CONFIRMED':
        return <Badge bg="info">Đã xác nhận</Badge>;
      case 'DELIVERING':
        return <Badge bg="primary">Đang giao</Badge>;
      case 'RECEIVED':
        return <Badge bg="success">Đã nhận</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount).replace(/\s/g, '');
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      console.error("Lỗi khi định dạng ngày:", e);
      return dateTimeStr;
    }
  };

  return (
    <div>
      <h2 className="mb-4">Trang chủ</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <h5>Xin chào, {currentUser?.fullName || 'Nhân viên'}!</h5>
          <p className="text-muted">Chào mừng đến với hệ thống quản lý của Thế Giới Di Động</p>
        </Card.Body>
      </Card>
      
      <h4 className="mb-3">Thống kê đơn hàng</h4>
      <Row>
        {orderStats.map((stat, index) => (
          <Col md={6} lg={3} className="mb-4" key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: stat.color,
                    color: stat.color === '#ffc107' ? '#000' : '#fff'
                  }}
                >
                  <i className={`${stat.icon} fs-3`}></i>
                </div>
                <div>
                  <h6 className="mb-0">{stat.title}</h6>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                  <h3 className="mb-0">{stat.value}</h3>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <h4 className="mb-3">Đơn hàng gần đây</h4>
      <Card className="mb-4 shadow-sm">
            <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Đang tải dữ liệu đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <i className="bi bi-exclamation-triangle-fill fs-1"></i>
              <p className="mt-3">{error}</p>
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="mt-3 text-muted">Không có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>ID Khách hàng</th>
                      <th>Số điện thoại</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>{order.userId || 'Không có ID'}</td>
                        <td>{order.phone || 'Không có SĐT'}</td>
                        <td>{formatCurrency(order.totalPrice)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{formatDateTime(order.createdTime)}</td>
                        <td>
                          <Link to={`/orders?id=${order.id}`} className="btn btn-sm btn-outline-primary">
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="text-end mt-3">
                <Link to="/orders" className="btn btn-primary">
                  Xem tất cả đơn hàng <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </>
          )}
            </Card.Body>
          </Card>
    </div>
  );
};

export default Dashboard; 