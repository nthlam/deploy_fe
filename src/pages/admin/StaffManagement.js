import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Pagination, Spinner, Alert } from 'react-bootstrap';
import adminService from '../../services/adminService';

const StaffManagement = ({ roleId = 2 }) => { // roleId=2 (staff) là mặc định, roleId=1 (admin)
  // State quản lý danh sách nhân viên
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // State cho tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State cho modal xem chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  // State cho modal thêm/sửa staff
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    email: '',
    fullName: '',
    password: '',
    isActive: true,
    roleId: roleId
  });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State cho modal thay đổi trạng thái
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [staffToChangeStatus, setStaffToChangeStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  
  // Lấy danh sách nhân viên
  const fetchStaffList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getUserList(roleId, currentPage, pageSize);
      
      if (response && response.data) {
        setStaffList(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setStaffList([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching staff list:', error);
      setError(`Không thể lấy danh sách ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Tìm kiếm nhân viên
  const searchStaff = async () => {
    try {
      setIsSearching(true);
      setLoading(true);
      setError(null);
      
      const response = await adminService.searchUsers(roleId, searchKeyword, currentPage, pageSize);
      
      if (response && response.data) {
        setStaffList(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setStaffList([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error searching staff:', error);
      setError(`Không thể tìm kiếm ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Xem chi tiết nhân viên
  const viewStaffDetail = async (staffId) => {
    try {
      setLoadingDetail(true);
      setError(null);
      
      const response = await adminService.getUserDetail(staffId);
      
      if (response && response.data) {
        setSelectedStaff(response.data);
        setShowDetailModal(true);
      } else {
        setError(`Không thể lấy thông tin ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}.`);
      }
    } catch (error) {
      console.error('Error fetching staff detail:', error);
      setError(`Không thể lấy thông tin chi tiết ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoadingDetail(false);
    }
  };
  
  // Xóa nhân viên
  const deleteStaff = async () => {
    if (!staffToDelete) return;
    
    try {
      setLoadingDelete(true);
      setError(null);
      
      await adminService.deleteUser(staffToDelete.id);
      
      // Cập nhật lại danh sách
      fetchStaffList();
      
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError(`Không thể xóa ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Thay đổi trạng thái hoạt động (active/inactive)
  const changeUserStatus = async () => {
    if (!staffToChangeStatus) return;
    
    try {
      setLoadingStatus(true);
      setError(null);
      
      // Gọi API với trạng thái ngược lại
      const newStatus = !staffToChangeStatus.isActive;
      await adminService.changeUserStatus(staffToChangeStatus.id, newStatus);
      
      // Cập nhật lại danh sách
      fetchStaffList();
      
      setShowStatusModal(false);
      setStaffToChangeStatus(null);
    } catch (error) {
      console.error('Error changing user status:', error);
      setError(`Không thể thay đổi trạng thái ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoadingStatus(false);
    }
  };
  
  // Thêm hoặc cập nhật tài khoản
  const saveUser = async () => {
    try {
      setLoadingEdit(true);
      setError(null);
      
      // Validate dữ liệu
      if (!currentStaff.email || !currentStaff.fullName) {
        setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
        setLoadingEdit(false);
        return;
      }
      
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentStaff.email)) {
        setError('Email không hợp lệ');
        setLoadingEdit(false);
        return;
      }
      
      // Nếu đang thêm mới, kiểm tra password
      if (!editMode && !currentStaff.password) {
        setError('Vui lòng nhập mật khẩu');
        setLoadingEdit(false);
        return;
      }
      
      if (editMode) {
        // Cập nhật tài khoản
        await adminService.updateUser({
          id: currentStaff.id,
          fullName: currentStaff.fullName,
          password: currentStaff.password || undefined // Chỉ gửi password nếu có
        });
      } else {
        // Thêm mới tài khoản
        await adminService.createUser({
          email: currentStaff.email,
          fullName: currentStaff.fullName,
          password: currentStaff.password,
          roleId: roleId
        });
      }
      
      // Đóng modal và reset form
      setShowEditModal(false);
      setEditMode(false);
      setCurrentStaff({
        email: '',
        fullName: '',
        password: '',
        isActive: true,
        roleId: roleId
      });
      setShowPassword(false);
      
      // Cập nhật lại danh sách
      fetchStaffList();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || `Không thể ${editMode ? 'cập nhật' : 'thêm mới'} ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}. Vui lòng thử lại sau.`);
    } finally {
      setLoadingEdit(false);
    }
  };

  // Xử lý sự kiện
  useEffect(() => {
    fetchStaffList();
  }, [currentPage, pageSize, roleId]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (searchKeyword.trim()) {
      setIsSearching(true);
      searchStaff();
    } else {
      setIsSearching(false);
      fetchStaffList();
    }
  };
  
  const handleClearSearch = () => {
    setSearchKeyword('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchStaffList();
  };
  
  const handleShowDeleteModal = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };
  
  const handleShowStatusModal = (staff) => {
    setStaffToChangeStatus(staff);
    setShowStatusModal(true);
  };
  
  const handleShowAddModal = () => {
    setEditMode(false);
    setCurrentStaff({
      email: '',
      fullName: '',
      password: '',
      isActive: true,
      roleId: roleId
    });
    setShowPassword(false);
    setShowEditModal(true);
  };
  
  const handleShowEditModal = (staff) => {
    setEditMode(true);
    setCurrentStaff({
      id: staff.id,
      email: staff.email,
      fullName: staff.fullName,
      password: '',
      isActive: staff.isActive,
      roleId: roleId
    });
    setShowPassword(false);
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setShowDeleteModal(false);
    setShowEditModal(false);
    setShowStatusModal(false);
    setSelectedStaff(null);
    setStaffToDelete(null);
    setStaffToChangeStatus(null);
    setEditMode(false);
    setCurrentStaff({
      email: '',
      fullName: '',
      password: '',
      isActive: true,
      roleId: roleId
    });
    setShowPassword(false);
    setError(null);
  };
  
  // Render phân trang
  const renderPagination = () => {
    const items = [];
    
    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container>
      <h2 className="mb-4">{roleId === 1 ? 'Quản lý quản trị viên' : 'Quản lý nhân viên'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <i className="bi bi-search me-2"></i>
          {roleId === 1 ? 'Tìm kiếm quản trị viên' : 'Tìm kiếm nhân viên'}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Từ khóa tìm kiếm</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder={`Nhập email hoặc tên ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}...`}
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                      <i className="bi bi-search me-1"></i>
                      Tìm kiếm
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex justify-content-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClearSearch}
                  className="me-2"
                  disabled={loading}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa bộ lọc
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleShowAddModal}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Thêm mới
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-people-fill me-2"></i>
            {roleId === 1 ? 'Danh sách quản trị viên' : 'Danh sách nhân viên'}
          </span>
          {isSearching && (
            <span className="badge bg-warning text-dark">
              Đang hiển thị kết quả tìm kiếm: "{searchKeyword}"
            </span>
          )}
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : staffList.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">{`Không tìm thấy ${roleId === 1 ? 'quản trị viên' : 'nhân viên'} nào`}</p>
              {isSearching && (
                <Button variant="link" onClick={handleClearSearch}>
                  Xóa bộ lọc và hiển thị tất cả
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>ID</th>
                    <th style={{ width: '25%' }}>Email</th>
                    <th style={{ width: '25%' }}>Tên</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '25%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff.id}>
                      <td>{staff.id}</td>
                      <td>{staff.email}</td>
                      <td>{staff.fullName}</td>
                      <td className="text-center">
                        <span className={`badge ${staff.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {staff.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="info"
                          size="sm"
                          className="me-1"
                          onClick={() => viewStaffDetail(staff.id)}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowEditModal(staff)}
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant={staff.isActive ? "secondary" : "success"}
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowStatusModal(staff)}
                          title={staff.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          <i className={`bi ${staff.isActive ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleShowDeleteModal(staff)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Select 
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5 mục</option>
              <option value="10">10 mục</option>
              <option value="20">20 mục</option>
              <option value="50">50 mục</option>
            </Form.Select>
            
            {totalPages > 1 && (
              <div>
                {renderPagination()}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      
      {/* Modal xem chi tiết */}
      <Modal show={showDetailModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Thông tin ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetail ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải thông tin...</p>
            </div>
          ) : selectedStaff ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff.id}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedStaff.email}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff.fullName}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff.role ? selectedStaff.role.name : (roleId === 1 ? 'Quản trị viên' : 'Nhân viên')}
                  readOnly
                />
              </Form.Group>
            </div>
          ) : (
            <p className="text-center text-muted">Không có thông tin</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Xác nhận xóa ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {staffToDelete && (
            <p>
              Bạn có chắc chắn muốn xóa {roleId === 1 ? 'quản trị viên' : 'nhân viên'} <strong>{staffToDelete.fullName}</strong> (ID: {staffToDelete.id})?
              <br />
              Hành động này không thể hoàn tác.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={deleteStaff}
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận xóa'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal thay đổi trạng thái */}
      <Modal show={showStatusModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Thay đổi trạng thái ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {staffToChangeStatus && (
            <p>
              Bạn có chắc chắn muốn {staffToChangeStatus.isActive ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản của {roleId === 1 ? 'quản trị viên' : 'nhân viên'} <strong>{staffToChangeStatus.fullName}</strong> (ID: {staffToChangeStatus.id})?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant={staffToChangeStatus?.isActive ? "danger" : "success"} 
            onClick={changeUserStatus}
            disabled={loadingStatus}
          >
            {loadingStatus ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : (
              staffToChangeStatus?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal thêm/sửa tài khoản */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode 
              ? `Cập nhật thông tin ${roleId === 1 ? 'quản trị viên' : 'nhân viên'}`
              : `Thêm ${roleId === 1 ? 'quản trị viên' : 'nhân viên'} mới`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editMode && (
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={currentStaff.id}
                  readOnly
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={currentStaff.email}
                onChange={(e) => setCurrentStaff({...currentStaff, email: e.target.value})}
                readOnly={editMode} // Chỉ cho phép sửa email khi thêm mới
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tên đầy đủ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đầy đủ"
                value={currentStaff.fullName}
                onChange={(e) => setCurrentStaff({...currentStaff, fullName: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{editMode ? 'Mật khẩu mới (để trống nếu không thay đổi)' : 'Mật khẩu'}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={editMode ? "Nhập mật khẩu mới" : "Nhập mật khẩu"}
                  value={currentStaff.password}
                  onChange={(e) => setCurrentStaff({...currentStaff, password: e.target.value})}
                  required={!editMode}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
              {editMode && (
                <Form.Text className="text-muted">
                  Để trống nếu không muốn thay đổi mật khẩu.
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={saveUser}
            disabled={loadingEdit}
          >
            {loadingEdit ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : (
              editMode ? 'Cập nhật' : 'Thêm mới'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffManagement; 