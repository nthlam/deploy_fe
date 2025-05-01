import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Modal, Spinner, Alert, Pagination, InputGroup, Row, Col } from 'react-bootstrap';
import { orderService } from '../../services/orderService';

const OrderManagement = () => {
  // State quản lý danh sách đơn hàng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State cho phân trang
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    receiveName: '',
    phone: '',
    address: ''
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState(false);
  
  // State cho modal chi tiết đơn hàng
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderDetailError, setOrderDetailError] = useState('');
  
  // State cho thông báo
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Thêm các state mới cho việc cập nhật trạng thái đơn hàng
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', title: '', message: '' });
  
  // Lấy danh sách đơn hàng khi component được mount hoặc khi các tham số thay đổi
  useEffect(() => {
    fetchOrders();
  }, [page, size, activeFilters]);
  
  // Hàm lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Chuẩn bị tham số cho API
      const params = {};
      
      // Chỉ thêm tham số page và size nếu chúng khác 0 và 10 (giá trị mặc định của API)
      if (page !== 0) {
        params.page = page;
      }
      
      if (size !== 10) {
        params.size = size;
      }
      
      // Thêm các bộ lọc nếu có
      if (Object.keys(activeFilters).length > 0) {
        Object.assign(params, activeFilters);
      }
      
      console.log('[ORDER MANAGEMENT] Đang lấy danh sách đơn hàng với tham số:', params);
      // Gọi API không kèm tham số nếu không cần
      const response = await orderService.searchOrders(Object.keys(params).length > 0 ? params : undefined);
      
      if (response && response.data) {
        console.log('[ORDER MANAGEMENT] Đã lấy danh sách đơn hàng:', response.data);
        
        // Cập nhật state
        setOrders(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        console.error('[ORDER MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setError('Không thể lấy danh sách đơn hàng');
      }
    } catch (err) {
      console.error('[ORDER MANAGEMENT] Lỗi khi lấy danh sách đơn hàng:', err);
      setError(`Đã xảy ra lỗi khi lấy danh sách đơn hàng: ${err.message}`);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };
  
  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  // Hàm xử lý thay đổi kích thước trang
  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi kích thước trang
  };
  
  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Hàm áp dụng bộ lọc
  const applyFilters = () => {
    // Loại bỏ các giá trị trống
    const newFilters = Object.entries(filters)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    
    setActiveFilters(newFilters);
    setFilterLoading(true);
    setPage(0); // Reset về trang đầu tiên khi áp dụng bộ lọc mới
  };
  
  // Hàm xóa bộ lọc
  const clearFilters = () => {
    setFilters({
      receiveName: '',
      phone: '',
      address: ''
    });
    setActiveFilters({});
    setFilterLoading(true);
    setPage(0); // Reset về trang đầu tiên khi xóa bộ lọc
  };
  
  // Hàm xem chi tiết đơn hàng
  const handleViewOrderDetail = async (orderId) => {
    try {
      setOrderDetailLoading(true);
      setOrderDetailError('');
      setSelectedOrder(null);
      setShowDetailModal(true);
      
      console.log('[ORDER MANAGEMENT] Đang lấy thông tin chi tiết đơn hàng có ID:', orderId);
      const response = await orderService.getOrderById(orderId);
      
      if (response && response.data) {
        console.log('[ORDER MANAGEMENT] Đã lấy thông tin chi tiết đơn hàng:', response.data);
        setSelectedOrder(response.data);
      } else {
        console.error('[ORDER MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setOrderDetailError('Không thể lấy thông tin chi tiết đơn hàng');
      }
    } catch (err) {
      console.error('[ORDER MANAGEMENT] Lỗi khi lấy thông tin chi tiết đơn hàng:', err);
      setOrderDetailError('Đã xảy ra lỗi khi lấy thông tin chi tiết đơn hàng');
    } finally {
      setOrderDetailLoading(false);
    }
  };
  
  // Hàm hiển thị thông báo
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };
  
  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  // Hàm tạo UI phân trang
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const items = [];
    
    // Nút quay lại trang trước
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
      />
    );
    
    // Hiển thị tối đa 5 trang
    const startPage = Math.max(0, Math.min(page - 2, totalPages - 5));
    const endPage = Math.min(startPage + 5, totalPages);
    
    for (let i = startPage; i < endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }
    
    // Nút chuyển đến trang tiếp theo
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages - 1}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };
  
  // Hàm hiển thị trạng thái đơn hàng với màu sắc phù hợp
  const renderOrderStatus = (status) => {
    let badgeClass = 'bg-secondary';
    let statusText = status || 'Không xác định';
    
    switch (status) {
      case 'PENDING':
        badgeClass = 'bg-warning text-dark';
        statusText = 'Đang chờ xử lý';
        break;
      case 'CONFIRMED':
        badgeClass = 'bg-info text-dark';
        statusText = 'Đã xác nhận';
        break;
      case 'DELIVERING':
        badgeClass = 'bg-primary';
        statusText = 'Đang giao hàng';
        break;
      case 'RECEIVED':
        badgeClass = 'bg-success';
        statusText = 'Đã nhận hàng';
        break;
      case 'CANCELED':
        badgeClass = 'bg-danger';
        statusText = 'Đã hủy';
        break;
      default:
        break;
    }
    
    return <span className={`badge ${badgeClass}`}>{statusText}</span>;
  };

  // Hàm hiển thị modal xác nhận
  const showConfirmModal = (type, title, message, handler) => {
    setConfirmAction({
      type,
      title,
      message,
      handler
    });
    setConfirmModalVisible(true);
  };

  // Hàm xác nhận đơn hàng (chuyển từ PENDING sang CONFIRMED)
  const handleConfirmOrder = async (orderId) => {
    showConfirmModal(
      'confirm',
      'Xác nhận đơn hàng',
      'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
      async () => {
        try {
          setStatusUpdateLoading(true);
          
          console.log('[ORDER MANAGEMENT] Đang xác nhận đơn hàng có ID:', orderId);
          
          // Kiểm tra đơn hàng hiện tại
          const currentOrder = selectedOrder;
          if (!currentOrder) {
            console.error('[ORDER MANAGEMENT] Không tìm thấy thông tin đơn hàng');
            showNotification('danger', 'Không tìm thấy thông tin đơn hàng');
            return;
          }
          
          // Kiểm tra trạng thái hiện tại
          if (currentOrder.status !== 'PENDING') {
            console.error('[ORDER MANAGEMENT] Trạng thái không hợp lệ để xác nhận đơn hàng:', currentOrder.status);
            showNotification('danger', 'Chỉ có thể xác nhận đơn hàng đang ở trạng thái chờ xử lý');
            return;
          }
          
          await orderService.confirmOrder(orderId);
          
          // Cập nhật lại trạng thái đơn hàng trên giao diện
          setSelectedOrder(prevOrder => ({
            ...prevOrder,
            status: 'CONFIRMED'
          }));
          
          // Hiển thị thông báo thành công
          showNotification('success', 'Đơn hàng đã được xác nhận thành công');
          
          // Tải lại danh sách đơn hàng
          fetchOrders();
        } catch (err) {
          console.error('[ORDER MANAGEMENT] Lỗi khi xác nhận đơn hàng:', err);
          showNotification('danger', `Đã xảy ra lỗi khi xác nhận đơn hàng: ${err.message}`);
        } finally {
          setStatusUpdateLoading(false);
          setConfirmModalVisible(false);
        }
      }
    );
  };

  // Hàm xác nhận đơn hàng đã nhận
  const handleReceiveOrder = async (orderId) => {
    showConfirmModal(
      'receive',
      'Xác nhận đã nhận hàng',
      'Bạn có chắc chắn muốn xác nhận đơn hàng này đã được nhận?',
      async () => {
        try {
          setStatusUpdateLoading(true);
          
          console.log('[ORDER MANAGEMENT] Đang xác nhận đơn hàng đã nhận, ID:', orderId);
          
          // Kiểm tra đơn hàng hiện tại trước khi gọi API
          const currentOrder = selectedOrder;
          if (!currentOrder) {
            console.error('[ORDER MANAGEMENT] Không tìm thấy thông tin đơn hàng');
            showNotification('danger', 'Không tìm thấy thông tin đơn hàng');
            return;
          }
          
          // Kiểm tra trạng thái và phương thức nhận hàng
          if (currentOrder.receiveMethod === 'PICKUP' && currentOrder.status !== 'CONFIRMED') {
            console.error('[ORDER MANAGEMENT] Trạng thái không hợp lệ cho đơn hàng PICKUP:', currentOrder.status);
            showNotification('danger', 'Đơn hàng pickup chỉ có thể chuyển sang trạng thái đã nhận khi đang ở trạng thái đã xác nhận');
            return;
          }
          
          if (currentOrder.receiveMethod === 'DELIVERY' && currentOrder.status !== 'DELIVERING') {
            console.error('[ORDER MANAGEMENT] Trạng thái không hợp lệ cho đơn hàng DELIVERY:', currentOrder.status);
            showNotification('danger', 'Đơn hàng delivery chỉ có thể chuyển sang trạng thái đã nhận khi đang ở trạng thái đang giao hàng');
            return;
          }
          
          await orderService.receiveOrder(orderId);
          
          // Cập nhật lại trạng thái đơn hàng trên giao diện
          setSelectedOrder(prevOrder => ({
            ...prevOrder,
            status: 'RECEIVED'
          }));
          
          // Hiển thị thông báo thành công
          showNotification('success', 'Đơn hàng đã được xác nhận đã nhận thành công');
          
          // Tải lại danh sách đơn hàng
          fetchOrders();
        } catch (err) {
          console.error('[ORDER MANAGEMENT] Lỗi khi xác nhận đơn hàng đã nhận:', err);
          showNotification('danger', `Đã xảy ra lỗi khi xác nhận đơn hàng đã nhận: ${err.message}`);
        } finally {
          setStatusUpdateLoading(false);
          setConfirmModalVisible(false);
        }
      }
    );
  };

  // Hàm chuyển đơn hàng sang trạng thái giao hàng
  const handleDeliverOrder = async (orderId) => {
    showConfirmModal(
      'deliver',
      'Chuyển sang giao hàng',
      'Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái giao hàng?',
      async () => {
        try {
          setStatusUpdateLoading(true);
          
          console.log('[ORDER MANAGEMENT] Đang chuyển đơn hàng sang giao hàng, ID:', orderId);
          
          // Kiểm tra đơn hàng hiện tại
          const currentOrder = selectedOrder;
          if (!currentOrder) {
            console.error('[ORDER MANAGEMENT] Không tìm thấy thông tin đơn hàng');
            showNotification('danger', 'Không tìm thấy thông tin đơn hàng');
            return;
          }
          
          // Kiểm tra phương thức nhận hàng
          if (currentOrder.receiveMethod === 'PICKUP') {
            console.error('[ORDER MANAGEMENT] Không thể chuyển đơn hàng PICKUP sang trạng thái giao hàng');
            showNotification('danger', 'Đơn hàng nhận tại cửa hàng không thể chuyển sang trạng thái giao hàng');
            return;
          }
          
          // Kiểm tra trạng thái hiện tại
          if (currentOrder.status !== 'CONFIRMED') {
            console.error('[ORDER MANAGEMENT] Trạng thái không hợp lệ để chuyển sang giao hàng:', currentOrder.status);
            showNotification('danger', 'Chỉ có thể chuyển đơn hàng từ trạng thái đã xác nhận sang giao hàng');
            return;
          }
          
          await orderService.deliverOrder(orderId);
          
          // Cập nhật lại trạng thái đơn hàng trên giao diện
          setSelectedOrder(prevOrder => ({
            ...prevOrder,
            status: 'DELIVERING'
          }));
          
          // Hiển thị thông báo thành công
          showNotification('success', 'Đơn hàng đã chuyển sang trạng thái giao hàng');
          
          // Tải lại danh sách đơn hàng
          fetchOrders();
        } catch (err) {
          console.error('[ORDER MANAGEMENT] Lỗi khi chuyển đơn hàng sang giao hàng:', err);
          showNotification('danger', 'Đã xảy ra lỗi khi chuyển đơn hàng sang giao hàng');
        } finally {
          setStatusUpdateLoading(false);
          setConfirmModalVisible(false);
        }
      }
    );
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    showConfirmModal(
      'cancel',
      'Hủy đơn hàng',
      'Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.',
      async () => {
        try {
          setStatusUpdateLoading(true);
          
          console.log('[ORDER MANAGEMENT] Đang hủy đơn hàng có ID:', orderId);
          
          // Kiểm tra đơn hàng hiện tại
          const currentOrder = selectedOrder;
          if (!currentOrder) {
            console.error('[ORDER MANAGEMENT] Không tìm thấy thông tin đơn hàng');
            showNotification('danger', 'Không tìm thấy thông tin đơn hàng');
            return;
          }
          
          // Kiểm tra trạng thái hiện tại
          if (currentOrder.status === 'RECEIVED' || currentOrder.status === 'CANCELED') {
            console.error('[ORDER MANAGEMENT] Không thể hủy đơn hàng ở trạng thái:', currentOrder.status);
            showNotification('danger', 'Không thể hủy đơn hàng đã nhận hoặc đã hủy');
            return;
          }
          
          await orderService.cancelOrder(orderId);
          
          // Cập nhật lại trạng thái đơn hàng trên giao diện
          setSelectedOrder(prevOrder => ({
            ...prevOrder,
            status: 'CANCELED'
          }));
          
          // Hiển thị thông báo thành công
          showNotification('success', 'Đơn hàng đã được hủy thành công');
          
          // Tải lại danh sách đơn hàng
          fetchOrders();
        } catch (err) {
          console.error('[ORDER MANAGEMENT] Lỗi khi hủy đơn hàng:', err);
          showNotification('danger', 'Đã xảy ra lỗi khi hủy đơn hàng');
        } finally {
          setStatusUpdateLoading(false);
          setConfirmModalVisible(false);
        }
      }
    );
  };

  return (
    <Container>
      <h2 className="mb-4">Quản lý đơn hàng</h2>

      {/* Hiển thị thông báo */}
      {notification.show && (
        <Alert variant={notification.type} onClose={() => setNotification({ show: false, type: '', message: '' })} dismissible>
          {notification.message}
        </Alert>
      )}

      {/* Card bộ lọc */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <i className="bi bi-funnel me-2"></i>
          Bộ lọc đơn hàng
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group controlId="filterReceiverName">
                <Form.Label>Tên người nhận</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên người nhận"
                  name="receiveName"
                  value={filters.receiveName}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group controlId="filterPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group controlId="filterAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-between">
            <div>
              <Button variant="outline-secondary" onClick={clearFilters} className="me-2">
                <i className="bi bi-x-circle me-1"></i>
                Xóa bộ lọc
              </Button>
              <Button variant="primary" onClick={applyFilters} disabled={filterLoading}>
                {filterLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Đang lọc...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-1"></i>
                    Áp dụng
                  </>
                )}
              </Button>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">Hiển thị:</span>
              <Form.Select 
                style={{ width: 'auto' }} 
                value={size}
                onChange={handleSizeChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Card danh sách đơn hàng */}
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-list-ul me-2"></i>
            Danh sách đơn hàng
          </span>
          <span>
            Tổng số: {totalElements} đơn hàng
          </span>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải danh sách đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr className="bg-light">
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '20%' }}>Tên người nhận</th>
                    <th style={{ width: '15%' }}>Số điện thoại</th>
                    <th style={{ width: '15%' }}>Tổng tiền</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '15%' }}>Ngày tạo</th>
                    <th style={{ width: '15%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.receiveName || 'N/A'}</td>
                      <td>{order.phone || 'N/A'}</td>
                      <td>{formatCurrency(order.totalPrice)}</td>
                      <td className="text-center">{renderOrderStatus(order.status)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="text-center">
                        <Button 
                          variant="info" 
                          size="sm" 
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          <i className="bi bi-info-circle me-1"></i>
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {/* Phân trang */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Hiển thị {orders.length} / {totalElements} đơn hàng
            </div>
            <div>{renderPagination()}</div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal chi tiết đơn hàng */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetailError && <Alert variant="danger">{orderDetailError}</Alert>}
          
          {orderDetailLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải thông tin chi tiết đơn hàng...</p>
            </div>
          ) : selectedOrder ? (
            <div>
              <h5 className="mb-3 border-bottom pb-2">Thông tin đơn hàng</h5>
              <Row className="mb-4">
                <Col md={6}>
                  <p><strong>Mã đơn hàng:</strong> #{selectedOrder.id}</p>
                  <p><strong>Trạng thái:</strong> {renderOrderStatus(selectedOrder.status)}</p>
                  <p><strong>Ngày tạo:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Cập nhật lần cuối:</strong> {formatDate(selectedOrder.updatedAt)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.totalPrice)}</p>
                  <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
                  <p><strong>Phương thức nhận hàng:</strong> {selectedOrder.receiveMethod || 'N/A'}</p>
                  <p><strong>Ghi chú:</strong> {selectedOrder.note || 'Không có'}</p>
                </Col>
              </Row>
              
              <h5 className="mb-3 border-bottom pb-2">Thông tin người nhận</h5>
              <Row className="mb-4">
                <Col md={12}>
                  <p><strong>Tên người nhận:</strong> {selectedOrder.receiveName || 'N/A'}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.address || 'N/A'}</p>
                </Col>
              </Row>
              
              <h5 className="mb-3 border-bottom pb-2">Sản phẩm đã đặt</h5>
              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr className="bg-light">
                      <th style={{ width: '5%' }}>#</th>
                      <th style={{ width: '15%' }}>Hình ảnh</th>
                      <th style={{ width: '30%' }}>Sản phẩm</th>
                      <th style={{ width: '15%' }}>Màu sắc</th>
                      <th style={{ width: '15%' }}>Giá</th>
                      <th style={{ width: '10%' }}>SL</th>
                      <th style={{ width: '15%' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td className="text-center">
                          {item.image && item.image.base64 ? (
                            <img 
                              src={`data:image/jpeg;base64,${item.image.base64}`} 
                              alt={item.name} 
                              style={{ height: '50px', maxWidth: '100%' }} 
                            />
                          ) : (
                            <span className="text-muted">Không có ảnh</span>
                          )}
                        </td>
                        <td>{item.name || 'N/A'}</td>
                        <td>{item.color || 'N/A'}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-light">
                      <td colSpan="6" className="text-end"><strong>Tổng cộng:</strong></td>
                      <td><strong>{formatCurrency(selectedOrder.totalPrice)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">Không có sản phẩm nào</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">Không tìm thấy thông tin đơn hàng</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedOrder && (
            <div className="d-flex justify-content-between w-100">
              <div>
                {/* Các nút chuyển đổi trạng thái */}
                {selectedOrder.status === 'PENDING' && (
                  <Button 
                    variant="success" 
                    className="me-2"
                    onClick={() => handleConfirmOrder(selectedOrder.id)}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-check-circle me-1"></i>}
                    Xác nhận đơn hàng
                  </Button>
                )}
                
                {/* Chỉ hiển thị nút giao hàng khi đơn là DELIVERY */}
                {selectedOrder.status === 'CONFIRMED' && selectedOrder.receiveMethod === 'DELIVERY' && (
                  <Button 
                    variant="primary" 
                    className="me-2"
                    onClick={() => handleDeliverOrder(selectedOrder.id)}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-truck me-1"></i>}
                    Chuyển giao hàng
                  </Button>
                )}
                
                {/* Hiển thị nút Xác nhận đã nhận hàng cho PICKUP ở trạng thái CONFIRMED hoặc DELIVERY ở trạng thái DELIVERING */}
                {((selectedOrder.status === 'CONFIRMED' && selectedOrder.receiveMethod === 'PICKUP') || 
                  (selectedOrder.status === 'DELIVERING' && selectedOrder.receiveMethod === 'DELIVERY')) && (
                  <Button 
                    variant="success" 
                    className="me-2"
                    onClick={() => handleReceiveOrder(selectedOrder.id)}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-bag-check me-1"></i>}
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                
                {/* Nút Hủy đơn hàng luôn hiển thị, trừ khi đơn đã hoàn thành hoặc đã hủy */}
                {selectedOrder.status !== 'RECEIVED' && selectedOrder.status !== 'CANCELED' && (
                  <Button 
                    variant="danger"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-x-circle me-1"></i>}
                    Hủy đơn hàng
                  </Button>
                )}
              </div>
              
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận thay đổi trạng thái */}
      <Modal show={confirmModalVisible} onHide={() => setConfirmModalVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{confirmAction.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModalVisible(false)}>
            Hủy bỏ
          </Button>
          <Button 
            variant={confirmAction.type === 'cancel' ? 'danger' : 'primary'} 
            onClick={confirmAction.handler}
            disabled={statusUpdateLoading}
          >
            {statusUpdateLoading ? <Spinner animation="border" size="sm" className="me-1" /> : null}
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement; 