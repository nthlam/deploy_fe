import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Table, Button, Form, Modal, Spinner, Alert, Row, Col, InputGroup, Image } from 'react-bootstrap';
import { brandService } from '../../services/brandService';
import { convertImageToBase64, createImageObject, isBase64Image, createImagePreviewUrl, revokeImagePreviewUrl } from '../../utils/imageUtils';

const BrandManagement = () => {
  // State quản lý danh sách nhãn hàng
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State cho modal thêm/sửa nhãn hàng
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  
  // State cho form thêm/sửa nhãn hàng
  const [editingBrand, setEditingBrand] = useState({ id: null, name: '', image: null });
  
  // State cho ảnh đang chỉnh sửa
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);
  
  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // State cho thông báo thao tác
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Lấy danh sách nhãn hàng khi component được mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Cleanup imagePreview khi component unmount hoặc khi imagePreview thay đổi
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreviewUrl(imagePreview);
      }
    };
  }, [imagePreview]);

  // Hàm lấy danh sách nhãn hàng từ API
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('[BRAND MANAGEMENT] Đang lấy danh sách nhãn hàng');
      const response = await brandService.getBrands();
      
      if (response && response.data) {
        console.log('[BRAND MANAGEMENT] Đã lấy danh sách nhãn hàng:', response.data);
        // Đảm bảo mỗi nhãn hàng có thuộc tính image là đối tượng hoặc null
        const processedBrands = response.data.map(brand => ({
          ...brand,
          // Chuẩn hóa image thành null nếu không tồn tại hoặc định dạng không đúng
          image: (brand.image && typeof brand.image === 'object' && brand.image.base64) 
            ? brand.image 
            : null
        }));
        setBrands(processedBrands);
      } else {
        console.error('[BRAND MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setError('Không thể lấy danh sách nhãn hàng');
      }
    } catch (err) {
      console.error('[BRAND MANAGEMENT] Lỗi khi lấy danh sách nhãn hàng:', err);
      setError('Đã xảy ra lỗi khi lấy danh sách nhãn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm nhãn hàng
  const handleSearch = (e) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const results = brands.filter(brand => 
      brand.name.toLowerCase().includes(term)
    );
    setSearchResults(results);
  };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Tạo preview URL để hiển thị ảnh
      const previewUrl = createImagePreviewUrl(file);
      
      // Xóa preview cũ nếu có
      if (imagePreview) {
        revokeImagePreviewUrl(imagePreview);
      }
      
      setImageFile(file);
      setImagePreview(previewUrl);
      setImageError('');
    }
  };

  // Hàm xóa ảnh đã chọn
  const handleRemoveImage = () => {
    if (imagePreview) {
      revokeImagePreviewUrl(imagePreview);
    }
    
    setImageFile(null);
    setImagePreview('');
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Hàm mở modal thêm nhãn hàng mới
  const handleAddBrand = () => {
    setModalTitle('Thêm nhãn hàng mới');
    setEditingBrand({ id: null, name: '', image: null });
    setImageFile(null);
    setImagePreview('');
    setModalError('');
    setImageError('');
    setShowModal(true);
  };

  // Hàm mở modal sửa nhãn hàng
  const handleEditBrand = (brand) => {
    setModalTitle('Cập nhật nhãn hàng');
    setEditingBrand({ ...brand });
    
    // Nếu có ảnh, hiển thị preview từ base64
    if (brand.image && brand.image.base64) {
      setImagePreview(brand.image.base64);
      setImageFile(null); // Không có file mới, chỉ dùng base64 hiện có
    } else {
      setImagePreview('');
      setImageFile(null);
    }
    
    setModalError('');
    setImageError('');
    setShowModal(true);
  };

  // Hàm lưu nhãn hàng (thêm mới hoặc cập nhật)
  const handleSaveBrand = async () => {
    // Kiểm tra tên nhãn hàng
    if (!editingBrand.name.trim()) {
      setModalError('Vui lòng nhập tên nhãn hàng');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');
      setImageError('');

      // Dữ liệu nhãn hàng cơ bản
      let brandData = {
        name: editingBrand.name
      };
      
      // Nếu đang cập nhật, thêm ID
      if (editingBrand.id) {
        brandData.id = editingBrand.id;
      }

      // Xử lý ảnh
      if (imageFile) {
        // Nếu có file ảnh mới, chuyển đổi thành base64
        try {
          const base64 = await convertImageToBase64(imageFile);
          // Tạo đối tượng image mới, không thêm ID để backend tạo mới ảnh
          brandData.image = {
            base64: base64,
            isPrimary: true
          };
          
          console.log('[BRAND MANAGEMENT] Đã chuyển đổi ảnh sang base64:', {
            imageSize: imageFile.size,
            base64Length: base64.length
          });
        } catch (imageError) {
          console.error('[BRAND MANAGEMENT] Lỗi khi xử lý ảnh:', imageError);
          setImageError(imageError.message || 'Lỗi khi xử lý ảnh');
          setModalLoading(false);
          return;
        }
      } else if (imagePreview && isBase64Image(imagePreview)) {
        // Nếu đang sử dụng ảnh base64 hiện có (từ preview của API trả về)
        brandData.image = {
          base64: imagePreview,
          isPrimary: true
        };
        console.log('[BRAND MANAGEMENT] Sử dụng ảnh base64 hiện có');
      } else {
        // Không có ảnh, API sẽ hiểu là giữ nguyên ảnh cũ hoặc không có ảnh
        console.log('[BRAND MANAGEMENT] Không có ảnh, không gửi trường image');
        // Không gán brandData.image = null để tránh backend hiểu nhầm là xóa ảnh
      }

      if (editingBrand.id) {
        // Cập nhật nhãn hàng
        console.log('[BRAND MANAGEMENT] Đang cập nhật nhãn hàng:', {
          id: brandData.id,
          name: brandData.name,
          hasImage: !!brandData.image
        });
        const response = await brandService.updateBrand(brandData);
        
        // Cập nhật danh sách
        if (response && response.data) {
          setBrands(prevBrands => 
            prevBrands.map(brand => 
              brand.id === editingBrand.id ? response.data : brand
            )
          );
        }
        
        // Hiển thị thông báo
        showNotification('success', 'Cập nhật nhãn hàng thành công');
      } else {
        // Thêm nhãn hàng mới
        console.log('[BRAND MANAGEMENT] Đang thêm nhãn hàng mới:', {
          name: brandData.name,
          hasImage: !!brandData.image
        });
        const response = await brandService.addBrand(brandData);
        
        // Cập nhật danh sách
        if (response && response.data) {
          setBrands(prevBrands => [...prevBrands, response.data]);
        }
        
        // Hiển thị thông báo
        showNotification('success', 'Thêm nhãn hàng thành công');
      }

      // Đóng modal
      setShowModal(false);
      
      // Cleanup
      if (imagePreview && !isBase64Image(imagePreview)) {
        revokeImagePreviewUrl(imagePreview);
      }
      setImageFile(null);
      setImagePreview('');
      
    } catch (err) {
      console.error('[BRAND MANAGEMENT] Lỗi khi lưu nhãn hàng:', err);
      console.error('[BRAND MANAGEMENT] Chi tiết lỗi:', err.response?.data || err.message);
      setModalError(
        err.response?.data?.meta?.message || 
        err.message || 
        'Đã xảy ra lỗi khi lưu nhãn hàng'
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Hàm mở modal xác nhận xóa nhãn hàng
  const handleDeleteConfirm = (brand) => {
    setDeletingBrand(brand);
    setShowDeleteModal(true);
  };

  // Hàm xóa nhãn hàng
  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;

    try {
      setDeleteLoading(true);
      
      console.log('[BRAND MANAGEMENT] Đang xóa nhãn hàng:', deletingBrand);
      await brandService.deleteBrand(deletingBrand.id);
      
      // Cập nhật danh sách
      setBrands(prevBrands => 
        prevBrands.filter(brand => brand.id !== deletingBrand.id)
      );
      
      // Hiển thị thông báo
      showNotification('success', 'Xóa nhãn hàng thành công');
      
      // Đóng modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('[BRAND MANAGEMENT] Lỗi khi xóa nhãn hàng:', err);
      showNotification('danger', 'Đã xảy ra lỗi khi xóa nhãn hàng');
    } finally {
      setDeleteLoading(false);
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

  // Danh sách nhãn hàng cần hiển thị (tất cả hoặc kết quả tìm kiếm)
  const displayedBrands = isSearching ? searchResults : brands;

  return (
    <Container>
      <h2 className="mb-4">Quản lý nhãn hàng</h2>

      {/* Hiển thị thông báo */}
      {notification.show && (
        <Alert variant={notification.type} onClose={() => setNotification({ show: false, type: '', message: '' })} dismissible>
          {notification.message}
        </Alert>
      )}

      {/* Form tìm kiếm */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm nhãn hàng..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x"></i>
                </Button>
              )}
              <Button variant="primary">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center card-header-tgdd">
          <span>
            {isSearching 
              ? `Kết quả tìm kiếm: "${searchTerm}" (${displayedBrands.length} nhãn hàng)` 
              : 'Danh sách nhãn hàng'
            }
          </span>
          <Button variant="light" size="sm" onClick={handleAddBrand}>
            <i className="bi bi-plus-circle me-1"></i> Thêm nhãn hàng
          </Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải danh sách nhãn hàng...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : displayedBrands.length === 0 ? (
            <div className="text-center py-4">
              {isSearching ? (
                <>
                  <p className="text-muted">Không tìm thấy nhãn hàng phù hợp với từ khóa "{searchTerm}"</p>
                  <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted">Chưa có nhãn hàng nào</p>
                  <Button variant="primary" onClick={handleAddBrand}>
                    <i className="bi bi-plus-circle me-1"></i> Thêm nhãn hàng mới
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '15%' }}>Logo</th>
                  <th>Tên nhãn hàng</th>
                  <th style={{ width: '15%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedBrands.map((brand, index) => (
                  <tr key={brand.id}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {brand.image && brand.image.base64 ? (
                        <Image 
                          src={brand.image.base64} 
                          alt={brand.name} 
                          style={{ maxHeight: '50px', maxWidth: '100%' }} 
                          thumbnail
                        />
                      ) : (
                        <div className="text-muted small">
                          <i className="bi bi-building fs-3 text-secondary"></i>
                          <div>Không có ảnh</div>
                        </div>
                      )}
                    </td>
                    <td>{brand.name}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditBrand(brand)}>
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteConfirm(brand)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa nhãn hàng */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="brandName">
              <Form.Label>Tên nhãn hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên nhãn hàng"
                value={editingBrand.name}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Logo nhãn hàng</Form.Label>
              <div className="mb-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => fileInputRef.current?.click()}
                  className="me-2"
                >
                  <i className="bi bi-upload me-1"></i> Chọn ảnh
                </Button>
                {imagePreview && (
                  <Button 
                    variant="outline-danger" 
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-x-circle me-1"></i> Xóa ảnh
                  </Button>
                )}
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
              {imageError && <Alert variant="danger" className="py-2">{imageError}</Alert>}
              
              {imagePreview && (
                <div className="mt-3 text-center border rounded p-3">
                  <p className="text-muted mb-2">Xem trước:</p>
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxHeight: '200px', maxWidth: '100%' }} 
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveBrand} disabled={modalLoading}>
            {modalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa nhãn hàng */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhãn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa nhãn hàng <strong>{deletingBrand?.name}</strong>?</p>
          <p className="text-danger mt-2">Lưu ý: Hành động này không thể hoàn tác.</p>
          
          {deletingBrand?.image?.base64 && (
            <div className="mt-3 text-center">
              <Image 
                src={deletingBrand.image.base64} 
                alt={deletingBrand.name} 
                style={{ maxHeight: '100px' }} 
                thumbnail
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteBrand} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BrandManagement; 