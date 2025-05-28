import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Pagination, Spinner, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css" ;
import promotionService from '../../services/promotionService';
import { categoryService } from '../../services/categoryService';

const PromotionManagement = () => {
  // State cho danh sách khuyến mãi và phân trang
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State cho tìm kiếm và lọc
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // State cho phần categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // State cho modal thêm/sửa khuyến mãi
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({
    id: null,
    name: '',
    description: '',
    value: 0,
    startDate: null,
    endDate: null,
    categoryId: ''
  });

  // State cho modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  // Lấy danh sách khuyến mãi
  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Đảm bảo currentPage luôn từ 1 trở lên
      const pageToFetch = Math.max(1, currentPage);
      console.log('[PROMOTION MANAGEMENT] Chuẩn bị lấy danh sách khuyến mãi với page =', pageToFetch, 'size =', pageSize);
      
      const params = {
        page: pageToFetch,
        size: pageSize
      };
      
      // Thêm ngày bắt đầu và kết thúc vào tham số nếu có
      if (startDate) {
        params.startDate = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        params.endDate = endDate.toISOString().split('T')[0];
      }
      
      console.log('[PROMOTION MANAGEMENT] Gửi request với params:', params);
      const response = await promotionService.searchPromotions(params);
      console.log('[PROMOTION MANAGEMENT] Phản hồi API:', response);
      
      // Lấy danh sách danh mục để hiển thị tên
      if (categories.length === 0) {
        await fetchCategories();
      }
      
      // Kiểm tra cấu trúc phản hồi
      if (response && response.content) {
        console.log('[PROMOTION MANAGEMENT] Sử dụng cấu trúc response.content');
        setPromotions(response.content || []);
        setTotalPages(response.totalPages || 0);
      } else if (response && response.data && response.data.content) {
        console.log('[PROMOTION MANAGEMENT] Sử dụng cấu trúc response.data.content');
        setPromotions(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setPromotions([]);
        setTotalPages(0);
        console.error('[PROMOTION MANAGEMENT] Cấu trúc phản hồi không như mong đợi:', response);
      }
    } catch (error) {
      console.error('[PROMOTION MANAGEMENT] Lỗi khi lấy danh sách khuyến mãi:', error);
      if (error.response) {
        console.error('[PROMOTION MANAGEMENT] Status code:', error.response.status);
        console.error('[PROMOTION MANAGEMENT] Response data:', error.response.data);
      }
      setError('Không thể lấy danh sách khuyến mãi. Vui lòng thử lại sau.');
      setPromotions([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách danh mục sản phẩm
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoryService.getCategories();
      // Kiểm tra và xử lý cấu trúc phản hồi
      if (response && response.data && Array.isArray(response.data)) {
        setCategories(response.data || []);
      } else if (response && response.data && Array.isArray(response.data.content)) {
        setCategories(response.data.content || []);
      } else if (response && Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
        console.error('Cấu trúc phản hồi không như mong đợi:', response);
      }
      console.log('[PROMOTION MANAGEMENT] Đã tải danh sách danh mục:', categories);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    fetchPromotions();
    fetchCategories();
  }, [currentPage, pageSize]);

  // Lấy dữ liệu khi áp dụng bộ lọc
  const handleFilter = () => {
    setCurrentPage(1);
    fetchPromotions();
  };

  // Xóa bộ lọc
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    fetchPromotions();
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý thay đổi kích thước trang
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Xử lý khi mở modal thêm mới
  const handleShowAddModal = () => {
    setEditMode(false);
    setCurrentPromotion({
      id: null,
      name: '',
      description: '',
      value: 0,
      startDate: null,
      endDate: null,
      categoryId: ''
    });
    setShowAddEditModal(true);
  };

  // Xử lý khi mở modal sửa
  const handleShowEditModal = async (id) => {
    try {
      setLoading(true);
      console.log('[PROMOTION MANAGEMENT] Đang lấy thông tin khuyến mãi ID:', id);
      
      const response = await promotionService.getPromotionById(id);
      const promotionData = response.data || response; // Kiểm tra cả hai cấu trúc phản hồi API
      
      console.log('[PROMOTION MANAGEMENT] Chi tiết khuyến mãi:', promotionData);
      
      // Đảm bảo đã có dữ liệu danh mục
      if (categories.length === 0) {
        await fetchCategories();
      }
      
      // Đảm bảo có ID và chuyển đổi sang đúng kiểu dữ liệu
      const promotionId = promotionData.id ? parseInt(promotionData.id) : id;
      
      // Chuyển đổi ngày từ chuỗi ISO sang đối tượng Date
      let startDate = null;
      if (promotionData.startDate) {
        startDate = new Date(promotionData.startDate);
      }
      
      let endDate = null;
      if (promotionData.endDate) {
        endDate = new Date(promotionData.endDate);
      }
      
      setCurrentPromotion({
        id: promotionId,
        name: promotionData.name || '',
        description: promotionData.description || '',
        value: promotionData.value || 0,
        startDate: startDate,
        endDate: endDate,
        categoryId: promotionData.categoryId ? parseInt(promotionData.categoryId) : ''
      });
      
      console.log('[PROMOTION MANAGEMENT] Dữ liệu đã chuẩn bị cho form:', {
        id: promotionId,
        name: promotionData.name || '',
        value: promotionData.value || 0,
        startDate: startDate,
        endDate: endDate,
        categoryId: promotionData.categoryId
      });
      
      setEditMode(true);
      setShowAddEditModal(true);
    } catch (error) {
      console.error('[PROMOTION MANAGEMENT] Lỗi khi lấy thông tin khuyến mãi:', error);
      setError('Không thể lấy thông tin khuyến mãi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi đóng modal
  const handleCloseModal = () => {
    setShowAddEditModal(false);
    setShowDeleteModal(false);
  };

  // Xử lý thay đổi trường trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPromotion({
      ...currentPromotion,
      [name]: value
    });
  };

  // Xử lý thay đổi ngày trong form
  const handleDateChange = (date, field) => {
    setCurrentPromotion({
      ...currentPromotion,
      [field]: date
    });
  };

  // Xử lý lưu khuyến mãi
  const handleSavePromotion = async () => {
    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!currentPromotion.name || !currentPromotion.name.trim()) {
        setError("Tên khuyến mãi không được để trống");
        return;
      }
      
      if (isNaN(parseFloat(currentPromotion.value)) || 
          parseFloat(currentPromotion.value) <= 0) {
        setError("Số tiền giảm giá phải là số dương");
        return;
      }
      
      if (!currentPromotion.startDate) {
        setError("Ngày bắt đầu không được để trống");
        return;
      }
      
      if (!currentPromotion.categoryId) {
        setError("Vui lòng chọn danh mục sản phẩm");
        return;
      }
      
      // Kiểm tra ID khi ở chế độ edit
      if (editMode && !currentPromotion.id) {
        setError("ID khuyến mãi không được để trống khi cập nhật");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Chuẩn bị dữ liệu theo yêu cầu API
      const promotionData = {
        name: currentPromotion.name.trim(),
        value: parseFloat(currentPromotion.value),
        startDate: currentPromotion.startDate ? currentPromotion.startDate.toISOString() : null,
        endDate: currentPromotion.endDate ? currentPromotion.endDate.toISOString() : null,
        categoryId: parseInt(currentPromotion.categoryId)
      };

      // Đảm bảo gắn ID khi ở chế độ chỉnh sửa
      if (editMode) {
        promotionData.id = parseInt(currentPromotion.id);
      }

      console.log('[PROMOTION MANAGEMENT] Dữ liệu khuyến mãi gửi đi:', promotionData);

      if (editMode) {
        if (!promotionData.id) {
          throw new Error('ID khuyến mãi không được để trống khi cập nhật');
        }
        await promotionService.updatePromotion(promotionData);
      } else {
        await promotionService.addPromotion(promotionData);
      }

      handleCloseModal();
      fetchPromotions();
    } catch (error) {
      console.error('[PROMOTION MANAGEMENT] Lỗi khi lưu khuyến mãi:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Lỗi: ${error.response.data.message}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(`Không thể ${editMode ? 'cập nhật' : 'thêm'} khuyến mãi. Vui lòng thử lại sau.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở modal xác nhận xóa
  const handleShowDeleteModal = (promotion) => {
    setPromotionToDelete(promotion);
    setShowDeleteModal(true);
  };

  // Xử lý xóa khuyến mãi
  const handleDeletePromotion = async () => {
    try {
      setLoading(true);
      await promotionService.deletePromotion(promotionToDelete.id);
      handleCloseModal();
      fetchPromotions();
    } catch (error) {
      console.error('Lỗi khi xóa khuyến mãi:', error);
      setError('Không thể xóa khuyến mãi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị phân trang
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
          disabled={currentPage === totalPages || totalPages === 0}
        />
      </Pagination>
    );
  };

  // Hàm lấy tên danh mục theo ID
  const getCategoryName = (promotion, categoryId) => {
    // Trường hợp promotion đã có thông tin category
    if (promotion && promotion.category && promotion.category.name) {
      return promotion.category.name;
    }
    
    // Nếu không có categoryId, lấy từ promotion
    if (!categoryId && promotion) {
      categoryId = promotion.categoryId;
    }
    
    // Kiểm tra nếu không có ID
    if (!categoryId) return 'N/A';
    
    // Tìm trong danh sách categories
    const category = categories.find(cat => {
      // So sánh với cả kiểu string và number
      return cat.id === categoryId || cat.id === parseInt(categoryId) || 
             (cat.id && categoryId && cat.id.toString() === categoryId.toString());
    });
    
    // Nếu tìm thấy, trả về tên, nếu không thì kiểm tra xem có categories không
    return category ? category.name : (categories.length === 0 ? 'Đang tải...' : 'Không xác định');
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Quản lý khuyến mãi</h2>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Tìm kiếm và bộ lọc</Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Từ ngày</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày bắt đầu"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đến ngày</Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày kết thúc"
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleFilter} className="me-2">
                    Tìm kiếm
                  </Button>
                  <Button variant="secondary" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <Button variant="success" onClick={handleShowAddModal}>
            Thêm khuyến mãi mới
          </Button>
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Hiển thị:</Form.Label>
            <Form.Select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ width: '80px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên khuyến mãi</th>
                        <th>Số tiền giảm (VND)</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Danh mục</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.length > 0 ? (
                        promotions.map((promotion) => (
                          <tr key={promotion.id}>
                            <td>{promotion.id}</td>
                            <td>{promotion.name}</td>
                            <td>{(promotion.value || promotion.discountPercent).toLocaleString()} VND</td>
                            <td>
                              {promotion.startDate
                                ? new Date(promotion.startDate).toLocaleDateString('vi-VN')
                                : 'N/A'}
                            </td>
                            <td>
                              {promotion.endDate
                                ? new Date(promotion.endDate).toLocaleDateString('vi-VN')
                                : 'N/A'}
                            </td>
                            <td>
                              {promotion.category && promotion.category.name 
                                ? promotion.category.name 
                                : getCategoryName(promotion, promotion.categoryId)}
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShowEditModal(promotion.id)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleShowDeleteModal(promotion)}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            Không có dữ liệu khuyến mãi
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-center mt-4">
                    {renderPagination()}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm/sửa khuyến mãi */}
      <Modal show={showAddEditModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p>Đang tải thông tin...</p>
            </div>
          ) : (
          <Form>
            {editMode && (
              <Form.Group className="mb-3">
                <Form.Label>ID khuyến mãi</Form.Label>
                <Form.Control
                  type="text"
                  value={currentPromotion.id || ''}
                  disabled
                  readOnly
                />
                <Form.Text className="text-muted">
                  ID không thể thay đổi
                </Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Tên khuyến mãi</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentPromotion.name}
                onChange={handleInputChange}
                placeholder="Nhập tên khuyến mãi"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={currentPromotion.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả khuyến mãi"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số tiền giảm (VND)</Form.Label>
              <Form.Control
                type="number"
                name="value"
                value={currentPromotion.value}
                onChange={handleInputChange}
                placeholder="Nhập số tiền giảm giá"
                min="0"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <DatePicker
                    selected={currentPromotion.startDate}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    selectsStart
                    startDate={currentPromotion.startDate}
                    endDate={currentPromotion.endDate}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày bắt đầu"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <DatePicker
                    selected={currentPromotion.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    selectsEnd
                    startDate={currentPromotion.startDate}
                    endDate={currentPromotion.endDate}
                    minDate={currentPromotion.startDate}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày kết thúc"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục sản phẩm</Form.Label>
              <Form.Select
                name="categoryId"
                value={currentPromotion.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn danh mục sản phẩm --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSavePromotion} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              'Lưu khuyến mãi'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xóa khuyến mãi */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa khuyến mãi <strong>{promotionToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeletePromotion}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PromotionManagement;
