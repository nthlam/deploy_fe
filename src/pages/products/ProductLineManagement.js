import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Table, Button, Form, Modal, Spinner, Alert, InputGroup, Image, Tabs, Tab } from 'react-bootstrap';
import { productLineService } from '../../services/productLineService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';

const ProductLineManagement = () => {
  // State quản lý danh sách dòng sản phẩm
  const [productLines, setProductLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchResult, setIsSearchResult] = useState(false);
  
  // State cho modal thêm/sửa dòng sản phẩm
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  
  // State cho form thêm/sửa dòng sản phẩm
  const [editingProductLine, setEditingProductLine] = useState({ 
    id: null, 
    name: '', 
    code: '', 
    brandId: '', 
    categoryId: '' 
  });
  
  // State danh sách danh mục và thương hiệu
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductLine, setDeletingProductLine] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // State cho thông báo thao tác
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // State cho modal danh sách sản phẩm
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProductLine, setSelectedProductLine] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  
  // State cho modal thêm/sửa sản phẩm
  const [showProductModal, setShowProductModal] = useState(false);
  const [productModalTitle, setProductModalTitle] = useState('');
  const [productModalLoading, setProductModalLoading] = useState(false);
  const [productModalError, setProductModalError] = useState('');
  const [editingProduct, setEditingProduct] = useState({
    id: null,
    name: '',
    code: '',
    description: '',
    basePrice: '',
    image: null
  });
  
  // State cho xử lý ảnh
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // State cho modal xác nhận xóa sản phẩm
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  
  // State cho modal quản lý thuộc tính sản phẩm
  const [showAttributesModal, setShowAttributesModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productAttributes, setProductAttributes] = useState([]);
  const [attributesLoading, setAttributesLoading] = useState(false);
  const [attributesError, setAttributesError] = useState('');
  
  // State cho modal chỉnh sửa thuộc tính
  const [showEditAttributeModal, setShowEditAttributeModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState({ id: null, value: '', attribute: null });
  const [attributeModalLoading, setAttributeModalLoading] = useState(false);
  const [attributeModalError, setAttributeModalError] = useState('');
  
  // State cho modal thuộc tính và biến thể
  const [activeTab, setActiveTab] = useState('attributes');
  
  // State cho danh sách biến thể
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState('');
  
  // State cho modal thêm/sửa biến thể
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantModalTitle, setVariantModalTitle] = useState('');
  const [variantModalLoading, setVariantModalLoading] = useState(false);
  const [variantModalError, setVariantModalError] = useState('');
  const [editingVariant, setEditingVariant] = useState({
    id: null,
    code: '',
    color: '',
    productId: null,
    images: [],
    available: 0
  });
  
  // State cho preview ảnh biến thể
  const [variantImagePreview, setVariantImagePreview] = useState(null);
  const variantFileInputRef = useRef(null);
  
  // State cho modal chi tiết biến thể
  const [showVariantDetailModal, setShowVariantDetailModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantDetailLoading, setVariantDetailLoading] = useState(false);
  const [variantDetailError, setVariantDetailError] = useState('');
  
  // State cho modal cập nhật tồn kho
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState({ variantId: null, available: 0 });
  const [inventoryModalLoading, setInventoryModalLoading] = useState(false);
  const [inventoryModalError, setInventoryModalError] = useState('');
  
  // Thêm state cho modal xác nhận xóa biến thể
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [deletingVariant, setDeletingVariant] = useState(null);
  const [deleteVariantLoading, setDeleteVariantLoading] = useState(false);
  
  // Lấy danh sách dòng sản phẩm khi component được mount
  useEffect(() => {
    fetchProductLines();
    fetchOptions();
  }, []);

  // Hàm lấy danh sách dòng sản phẩm từ API
  const fetchProductLines = async () => {
    try {
      setLoading(true);
      setError('');
      setIsSearchResult(false);
      
      console.log('[PRODUCT-LINE MANAGEMENT] Đang lấy danh sách dòng sản phẩm');
      const response = await productLineService.getProductLines();
      
      if (response && response.data && response.data.content) {
        console.log('[PRODUCT-LINE MANAGEMENT] Đã lấy danh sách dòng sản phẩm:', response.data.content);
        // Lọc bỏ các phần tử không hợp lệ
        const validProductLines = response.data.content.filter(item => item && item.id);
        setProductLines(validProductLines);
      } else {
        console.error('[PRODUCT-LINE MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setError('Không thể lấy danh sách dòng sản phẩm');
      }
    } catch (err) {
      console.error('[PRODUCT-LINE MANAGEMENT] Lỗi khi lấy danh sách dòng sản phẩm:', err);
      setError('Đã xảy ra lỗi khi lấy danh sách dòng sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách danh mục và thương hiệu
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      
      // Lấy danh sách danh mục
      const categoriesResponse = await categoryService.getCategories();
      if (categoriesResponse && categoriesResponse.data) {
        setCategories(categoriesResponse.data || []);
      }
      
      // Lấy danh sách thương hiệu
      const brandsResponse = await brandService.getBrands();
      if (brandsResponse && brandsResponse.data) {
        setBrands(brandsResponse.data || []);
      }
    } catch (err) {
      console.error('[PRODUCT-LINE MANAGEMENT] Lỗi khi lấy danh sách danh mục và thương hiệu:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  // Hàm xử lý xóa từ khóa tìm kiếm và hiển thị lại toàn bộ danh sách
  const clearSearch = () => {
    setSearchTerm('');
    fetchProductLines();
  };

  // Hàm mở modal thêm dòng sản phẩm mới
  const handleAddProductLine = () => {
    setModalTitle('Thêm dòng sản phẩm mới');
    setEditingProductLine({ id: null, name: '', code: '', brandId: '', categoryId: '' });
    setModalError('');
    setShowModal(true);
  };

  // Hàm mở modal sửa dòng sản phẩm
  const handleEditProductLine = (productLine) => {
    if (!productLine || !productLine.id) {
      console.error('[PRODUCT-LINE MANAGEMENT] Dòng sản phẩm không hợp lệ:', productLine);
      showNotification('danger', 'Không thể chỉnh sửa dòng sản phẩm này');
      return;
    }

    setModalTitle('Cập nhật dòng sản phẩm');
    setEditingProductLine({ 
      id: productLine.id, 
      name: productLine.name || '', 
      code: productLine.code || '', 
      brandId: productLine.brand?.id || '', 
      categoryId: productLine.category?.id || '' 
    });
    setModalError('');
    setShowModal(true);
  };

  // Hàm lưu dòng sản phẩm (thêm mới hoặc cập nhật)
  const handleSaveProductLine = async () => {
    // Kiểm tra các trường bắt buộc
    if (!editingProductLine.name.trim()) {
      setModalError('Vui lòng nhập tên dòng sản phẩm');
      return;
    }
    
    if (!editingProductLine.brandId) {
      setModalError('Vui lòng chọn thương hiệu');
      return;
    }
    
    if (!editingProductLine.categoryId) {
      setModalError('Vui lòng chọn danh mục sản phẩm');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');

      const productLineData = { ...editingProductLine };
      // Đảm bảo brandId và categoryId là số
      productLineData.brandId = Number(productLineData.brandId);
      productLineData.categoryId = Number(productLineData.categoryId);

      if (editingProductLine.id) {
        // Cập nhật dòng sản phẩm
        console.log('[PRODUCT-LINE MANAGEMENT] Đang cập nhật dòng sản phẩm:', productLineData);
        const response = await productLineService.updateProductLine(productLineData);
        
        if (response && response.data) {
          // Cập nhật danh sách
          setProductLines(prevProductLines => 
            prevProductLines.map(pl => 
              pl.id === editingProductLine.id ? response.data : pl
            )
          );
          
          // Hiển thị thông báo
          showNotification('success', 'Cập nhật dòng sản phẩm thành công');
        }
      } else {
        // Thêm dòng sản phẩm mới
        console.log('[PRODUCT-LINE MANAGEMENT] Đang thêm dòng sản phẩm mới:', productLineData);
        const response = await productLineService.createProductLine(productLineData);
        
        if (response && response.data) {
          // Cập nhật danh sách
          setProductLines(prevProductLines => [...prevProductLines, response.data]);
          
          // Hiển thị thông báo
          showNotification('success', 'Thêm dòng sản phẩm thành công');
        }
      }

      // Đóng modal
      setShowModal(false);
    } catch (err) {
      console.error('[PRODUCT-LINE MANAGEMENT] Lỗi khi lưu dòng sản phẩm:', err);
      setModalError('Đã xảy ra lỗi khi lưu dòng sản phẩm');
    } finally {
      setModalLoading(false);
    }
  };

  // Hàm mở modal xác nhận xóa dòng sản phẩm
  const handleDeleteConfirm = (productLine) => {
    if (!productLine || !productLine.id) {
      console.error('[PRODUCT-LINE MANAGEMENT] Dòng sản phẩm không hợp lệ:', productLine);
      showNotification('danger', 'Không thể xóa dòng sản phẩm này');
      return;
    }
    
    setDeletingProductLine(productLine);
    setShowDeleteModal(true);
  };

  // Hàm xóa dòng sản phẩm
  const handleDeleteProductLine = async () => {
    if (!deletingProductLine) return;

    try {
      setDeleteLoading(true);
      
      console.log('[PRODUCT-LINE MANAGEMENT] Đang xóa dòng sản phẩm:', deletingProductLine);
      await productLineService.deleteProductLine(deletingProductLine.id);
      
      // Cập nhật danh sách
      setProductLines(prevProductLines => 
        prevProductLines.filter(pl => pl.id !== deletingProductLine.id)
      );
      
      // Hiển thị thông báo
      showNotification('success', 'Xóa dòng sản phẩm thành công');
      
      // Đóng modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('[PRODUCT-LINE MANAGEMENT] Lỗi khi xóa dòng sản phẩm:', err);
      showNotification('danger', 'Đã xảy ra lỗi khi xóa dòng sản phẩm');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Hàm hiển thị sản phẩm của dòng sản phẩm
  const handleViewProducts = async (productLine) => {
    if (!productLine || !productLine.id) {
      console.error('[PRODUCT-LINE MANAGEMENT] Dòng sản phẩm không hợp lệ:', productLine);
      showNotification('danger', 'Không thể xem sản phẩm của dòng sản phẩm này');
      return;
    }

    setSelectedProductLine(productLine);
    setProductsLoading(true);
    setProductsError('');
    setProducts([]);
    setShowProductsModal(true);
    
    try {
      console.log('[PRODUCT-LINE MANAGEMENT] Đang lấy danh sách sản phẩm của dòng sản phẩm:', productLine.id);
      const response = await productLineService.getProductsByProductLineId(productLine.id);
      
      if (response && response.data) {
        console.log('[PRODUCT-LINE MANAGEMENT] Đã lấy danh sách sản phẩm:', response.data);
        // Lọc bỏ các phần tử không hợp lệ
        const validProducts = Array.isArray(response.data) ? response.data.filter(item => item && item.id) : [];
        setProducts(validProducts);
      } else {
        console.error('[PRODUCT-LINE MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setProductsError('Không thể lấy danh sách sản phẩm');
      }
    } catch (err) {
      console.error('[PRODUCT-LINE MANAGEMENT] Lỗi khi lấy danh sách sản phẩm:', err);
      setProductsError('Đã xảy ra lỗi khi lấy danh sách sản phẩm');
    } finally {
      setProductsLoading(false);
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
  
  // Hàm chuyển đổi file sang base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  // Hàm xử lý khi chọn file ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setEditingProduct({
          ...editingProduct,
          image: {
            base64: base64.split(',')[1], // Loại bỏ phần đầu của base64 string
            isPrimary: true
          }
        });
        setImagePreview(base64);
      } catch (error) {
        console.error('[PRODUCT MANAGEMENT] Lỗi khi chuyển đổi ảnh sang base64:', error);
        setProductModalError('Không thể tải ảnh. Vui lòng thử lại.');
      }
    }
  };
  
  // Hàm mở modal thêm sản phẩm mới
  const handleAddProduct = () => {
    setProductModalTitle('Thêm sản phẩm mới');
    
    // Tạo mã sản phẩm duy nhất
    const uniqueCode = `PROD-${selectedProductLine?.code || ''}-${new Date().getTime()}`;
    
    setEditingProduct({
      id: null,
      name: '',
      code: uniqueCode,
      description: '',
      basePrice: '',
      productLineId: selectedProductLine.id,
      image: null
    });
    setImagePreview('');
    setProductModalError('');
    setShowProductModal(true);
  };
  
  // Hàm mở modal sửa sản phẩm
  const handleEditProduct = (product) => {
    setProductModalTitle('Cập nhật sản phẩm');
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      code: product.code || '',
      description: product.description || '',
      basePrice: product.basePrice || '',
      image: product.image
    });
    
    // Hiển thị ảnh nếu có
    if (product.image && product.image.base64) {
      setImagePreview(`data:image/jpeg;base64,${product.image.base64}`);
    } else {
      setImagePreview('');
    }
    
    setProductModalError('');
    setShowProductModal(true);
  };
  
  // Hàm lưu sản phẩm (thêm mới hoặc cập nhật)
  const handleSaveProduct = async () => {
    // Kiểm tra các trường bắt buộc
    if (!editingProduct.name.trim()) {
      setProductModalError('Vui lòng nhập tên sản phẩm');
      return;
    }
    
    if (!editingProduct.code.trim()) {
      setProductModalError('Vui lòng nhập mã sản phẩm');
      return;
    }
    
    if (!editingProduct.basePrice) {
      setProductModalError('Vui lòng nhập giá cơ bản');
      return;
    }
    
    try {
      setProductModalLoading(true);
      setProductModalError('');
      
      // Chuẩn bị dữ liệu
      const productData = {
        name: editingProduct.name,
        code: editingProduct.code,
        description: editingProduct.description || '',
        basePrice: parseInt(editingProduct.basePrice, 10)
      };
      
      // Nếu đang thêm mới, thêm productLineId vào dữ liệu
      if (!editingProduct.id && selectedProductLine) {
        productData.productLineId = selectedProductLine.id;
      } else if (editingProduct.id) {
        productData.id = editingProduct.id;
      }
      
      // Xử lý hình ảnh
      if (editingProduct.image && editingProduct.image.base64) {
        productData.image = {
          base64: editingProduct.image.base64,
          isPrimary: true
        };
      }
      
      if (editingProduct.id) {
        // Cập nhật sản phẩm
        console.log('[PRODUCT MANAGEMENT] Đang cập nhật sản phẩm:', productData);
        const response = await productService.updateProduct(productData);
        
        if (response && response.data) {
          // Cập nhật danh sách
          setProducts(prevProducts => 
            prevProducts.map(p => 
              p.id === editingProduct.id ? response.data : p
            )
          );
          
          // Hiển thị thông báo
          showNotification('success', 'Cập nhật sản phẩm thành công');
        }
      } else {
        // Thêm sản phẩm mới
        console.log('[PRODUCT MANAGEMENT] Đang thêm sản phẩm mới:', productData);
        const response = await productService.createProduct(productData);
        
        if (response && response.data) {
          // Cập nhật danh sách
          setProducts(prevProducts => [...prevProducts, response.data]);
          
          // Hiển thị thông báo
          showNotification('success', 'Thêm sản phẩm thành công');
        }
      }
      
      // Đóng modal
      setShowProductModal(false);
      
      // Refresh lại danh sách sản phẩm
      if (selectedProductLine) {
        handleViewProducts(selectedProductLine);
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi lưu sản phẩm:', err);
      setProductModalError('Đã xảy ra lỗi khi lưu sản phẩm: ' + (err.response?.data?.message || err.message));
    } finally {
      setProductModalLoading(false);
    }
  };

  // Hàm mở modal xác nhận xóa sản phẩm
  const handleDeleteProductConfirm = (product) => {
    if (!product || !product.id) {
      console.error('[PRODUCT MANAGEMENT] Sản phẩm không hợp lệ:', product);
      showNotification('danger', 'Không thể xóa sản phẩm này');
      return;
    }
    
    setDeletingProduct(product);
    setShowDeleteProductModal(true);
  };
  
  // Hàm xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    
    try {
      setDeleteProductLoading(true);
      
      console.log('[PRODUCT MANAGEMENT] Đang xóa sản phẩm:', deletingProduct);
      await productService.deleteProduct(deletingProduct.id);
      
      // Cập nhật danh sách
      setProducts(prevProducts => 
        prevProducts.filter(p => p.id !== deletingProduct.id)
      );
      
      // Hiển thị thông báo
      showNotification('success', 'Xóa sản phẩm thành công');
      
      // Đóng modal
      setShowDeleteProductModal(false);
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi xóa sản phẩm:', err);
      showNotification('danger', 'Đã xảy ra lỗi khi xóa sản phẩm');
    } finally {
      setDeleteProductLoading(false);
    }
  };
  
  // Hàm xem thuộc tính sản phẩm
  const handleViewAttributes = async (product) => {
    if (!product || !product.id) {
      console.error('[PRODUCT MANAGEMENT] Sản phẩm không hợp lệ:', product);
      showNotification('danger', 'Không thể xem thuộc tính của sản phẩm này');
      return;
    }
    
    setSelectedProduct(product);
    setAttributesLoading(true);
    setAttributesError('');
    setProductAttributes([]);
    setShowAttributesModal(true);
    setActiveTab('attributes');
    
    try {
      console.log('[PRODUCT MANAGEMENT] Đang lấy thông tin chi tiết sản phẩm:', product.id);
      const response = await productService.getProductById(product.id);
      
      if (response && response.data && response.data.attributes) {
        console.log('[PRODUCT MANAGEMENT] Đã lấy thuộc tính sản phẩm:', response.data.attributes);
        // Lọc bỏ các phần tử không hợp lệ
        const validAttributes = Array.isArray(response.data.attributes) 
          ? response.data.attributes.filter(item => item && item.id) 
          : [];
        setProductAttributes(validAttributes);
        
        // Cập nhật thông tin sản phẩm với đầy đủ chi tiết
        setSelectedProduct(response.data);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setAttributesError('Không thể lấy thông tin thuộc tính sản phẩm');
      }
      
      // Lấy danh sách biến thể
      await fetchVariants(product.id);
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi lấy thuộc tính sản phẩm:', err);
      setAttributesError('Đã xảy ra lỗi khi lấy thông tin thuộc tính sản phẩm');
    } finally {
      setAttributesLoading(false);
    }
  };
  
  // Hàm mở modal chỉnh sửa thuộc tính
  const handleEditAttribute = (attribute) => {
    if (!attribute || !attribute.id) {
      console.error('[PRODUCT MANAGEMENT] Thuộc tính không hợp lệ:', attribute);
      showNotification('danger', 'Không thể chỉnh sửa thuộc tính này');
      return;
    }
    
    console.log('[PRODUCT MANAGEMENT] Đang chỉnh sửa thuộc tính:', attribute);
    
    // Lấy tên thuộc tính từ dữ liệu hiển thị, không dùng attribute từ response
    const attributeName = attribute.attribute?.name || attribute.attributeName || 'Không xác định';
    
    setEditingAttribute({
      id: attribute.id,
      value: attribute.value || '',
      attributeName: attributeName // Chỉ lưu tên thuộc tính, không cập nhật attribute object
    });
    
    setAttributeModalError('');
    setShowEditAttributeModal(true);
  };
  
  // Hàm lưu chỉnh sửa thuộc tính
  const handleSaveAttribute = async () => {
    if (!editingAttribute.id) {
      setAttributeModalError('Thuộc tính không hợp lệ');
      return;
    }
    
    if (!editingAttribute.value.trim()) {
      setAttributeModalError('Vui lòng nhập giá trị thuộc tính');
      return;
    }
    
    try {
      setAttributeModalLoading(true);
      setAttributeModalError('');
      
      console.log('[PRODUCT MANAGEMENT] Đang cập nhật thuộc tính:', editingAttribute);
      const response = await productService.updateProductAttribute({
        id: editingAttribute.id,
        value: editingAttribute.value
      });
      
      if (response && response.data) {
        // Cập nhật danh sách thuộc tính, giữ nguyên tên thuộc tính gốc
        setProductAttributes(prevAttributes => 
          prevAttributes.map(attr => {
            if (attr.id === editingAttribute.id) {
              // Giữ nguyên attribute object, chỉ cập nhật value
              return { 
                ...attr, 
                value: response.data.value || editingAttribute.value
              };
            }
            return attr;
          })
        );
        
        // Hiển thị thông báo
        showNotification('success', 'Cập nhật thuộc tính thành công');
        
        // Đóng modal
        setShowEditAttributeModal(false);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setAttributeModalError('Không thể cập nhật thuộc tính');
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi cập nhật thuộc tính:', err);
      setAttributeModalError('Đã xảy ra lỗi khi cập nhật thuộc tính');
    } finally {
      setAttributeModalLoading(false);
    }
  };

  // Hàm lấy danh sách biến thể của sản phẩm
  const fetchVariants = async (productId) => {
    try {
      setVariantsLoading(true);
      setVariantsError('');
      
      console.log('[PRODUCT MANAGEMENT] Đang lấy danh sách biến thể của sản phẩm có ID:', productId);
      const response = await productService.getVariantsByProductId(productId);
      
      if (response && response.data) {
        console.log('[PRODUCT MANAGEMENT] Đã lấy danh sách biến thể:', response.data);
        setVariants(response.data || []);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setVariantsError('Không thể lấy danh sách biến thể sản phẩm');
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi lấy danh sách biến thể:', err);
      setVariantsError('Đã xảy ra lỗi khi lấy danh sách biến thể sản phẩm');
    } finally {
      setVariantsLoading(false);
    }
  };
  
  // Hàm xem chi tiết biến thể
  const handleViewVariantDetail = async (variantId) => {
    if (!variantId) {
      console.error('[PRODUCT MANAGEMENT] ID biến thể không hợp lệ');
      showNotification('danger', 'Không thể xem chi tiết biến thể này');
      return;
    }
    
    setVariantDetailLoading(true);
    setVariantDetailError('');
    setSelectedVariant(null);
    setShowVariantDetailModal(true);
    
    try {
      console.log('[PRODUCT MANAGEMENT] Đang lấy thông tin chi tiết biến thể có ID:', variantId);
      const response = await productService.getVariantById(variantId);
      
      if (response && response.data) {
        console.log('[PRODUCT MANAGEMENT] Đã lấy thông tin chi tiết biến thể:', response.data);
        setSelectedVariant(response.data);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setVariantDetailError('Không thể lấy thông tin chi tiết biến thể');
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi lấy thông tin chi tiết biến thể:', err);
      setVariantDetailError('Đã xảy ra lỗi khi lấy thông tin chi tiết biến thể');
    } finally {
      setVariantDetailLoading(false);
    }
  };
  
  // Hàm mở modal thêm biến thể mới
  const handleAddVariant = () => {
    setVariantModalTitle('Thêm biến thể mới');
    
    // Tạo mã biến thể duy nhất dựa trên timestamp
    const uniqueCode = `VAR-${selectedProduct?.code || ''}-${new Date().getTime()}`;
    
    setEditingVariant({
      id: null,
      code: uniqueCode,
      color: '',
      productId: selectedProduct.id,
      images: [],
      available: 0
    });
    setVariantImagePreview(null);
    setVariantModalError('');
    setShowVariantModal(true);
  };
  
  // Hàm xử lý khi chọn file ảnh cho biến thể
  const handleVariantImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setEditingVariant({
          ...editingVariant,
          images: [
            {
              // Không cần gửi ID cho ảnh mới
              base64: base64.split(',')[1],
              isPrimary: true
            }
          ]
        });
        setVariantImagePreview(base64);
      } catch (error) {
        console.error('[PRODUCT MANAGEMENT] Lỗi khi chuyển đổi ảnh sang base64:', error);
        setVariantModalError('Không thể tải ảnh. Vui lòng thử lại.');
      }
    }
  };
  
  // Hàm lưu biến thể
  const handleSaveVariant = async () => {
    // Kiểm tra các trường bắt buộc
    if (!editingVariant.color.trim()) {
      setVariantModalError('Vui lòng nhập màu sắc');
      return;
    }
    
    if (!editingVariant.code.trim()) {
      setVariantModalError('Mã biến thể không hợp lệ');
      return;
    }
    
    if (!editingVariant.available || editingVariant.available <= 0) {
      setVariantModalError('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    
    if (editingVariant.images.length === 0) {
      setVariantModalError('Vui lòng tải lên ít nhất một hình ảnh');
      return;
    }
    
    try {
      setVariantModalLoading(true);
      setVariantModalError('');
      
      // Chuẩn bị dữ liệu
      const variantData = {
        code: editingVariant.code,
        color: editingVariant.color,
        productId: Number(editingVariant.productId), // Đảm bảo productId là số
        available: parseInt(editingVariant.available, 10),
        images: editingVariant.images.map(img => ({
          base64: img.base64,
          isPrimary: img.isPrimary
        }))
      };
      
      console.log('[PRODUCT MANAGEMENT] Đang tạo biến thể mới:', variantData);
      const response = await productService.createVariant(variantData);
      
      if (response && response.data) {
        // Cập nhật danh sách
        setVariants(prevVariants => [...prevVariants, response.data]);
        
        // Hiển thị thông báo
        showNotification('success', 'Thêm biến thể thành công');
        
        // Đóng modal
        setShowVariantModal(false);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setVariantModalError('Không thể tạo biến thể mới');
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi tạo biến thể mới:', err);
      setVariantModalError('Đã xảy ra lỗi khi tạo biến thể mới: ' + (err.response?.data?.message || err.message));
    } finally {
      setVariantModalLoading(false);
    }
  };
  
  // Hàm mở modal cập nhật tồn kho
  const handleUpdateInventory = (variant) => {
    if (!variant || !variant.id) {
      console.error('[PRODUCT MANAGEMENT] Biến thể không hợp lệ:', variant);
      showNotification('danger', 'Không thể cập nhật tồn kho cho biến thể này');
      return;
    }
    
    setEditingInventory({
      variantId: variant.id,
      available: variant.inventory?.available || 0
    });
    
    setInventoryModalError('');
    setShowInventoryModal(true);
  };
  
  // Hàm lưu cập nhật tồn kho
  const handleSaveInventory = async () => {
    if (!editingInventory.variantId) {
      setInventoryModalError('ID biến thể không hợp lệ');
      return;
    }
    
    if (editingInventory.available < 0) {
      setInventoryModalError('Số lượng tồn kho không được nhỏ hơn 0');
      return;
    }
    
    try {
      setInventoryModalLoading(true);
      setInventoryModalError('');
      
      console.log('[PRODUCT MANAGEMENT] Đang cập nhật tồn kho:', editingInventory);
      const response = await productService.updateVariantInventory(editingInventory);
      
      if (response && response.data) {
        // Cập nhật thông tin tồn kho trong danh sách biến thể
        setVariants(prevVariants => 
          prevVariants.map(variant => 
            variant.id === editingInventory.variantId 
              ? { ...variant, inventory: response.data } 
              : variant
          )
        );
        
        // Cập nhật thông tin tồn kho trong biến thể được chọn
        if (selectedVariant && selectedVariant.id === editingInventory.variantId) {
          setSelectedVariant({
            ...selectedVariant,
            inventory: response.data
          });
        }
        
        // Hiển thị thông báo
        showNotification('success', 'Cập nhật tồn kho thành công');
        
        // Đóng modal
        setShowInventoryModal(false);
      } else {
        console.error('[PRODUCT MANAGEMENT] Phản hồi API không hợp lệ:', response);
        setInventoryModalError('Không thể cập nhật tồn kho');
      }
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi cập nhật tồn kho:', err);
      setInventoryModalError('Đã xảy ra lỗi khi cập nhật tồn kho');
    } finally {
      setInventoryModalLoading(false);
    }
  };
  
  // Hàm xóa ảnh
  const handleDeleteImage = async (imageId) => {
    if (!imageId) {
      console.error('[PRODUCT MANAGEMENT] ID ảnh không hợp lệ');
      showNotification('danger', 'Không thể xóa ảnh này');
      return;
    }
    
    try {
      console.log('[PRODUCT MANAGEMENT] Đang xóa ảnh có ID:', imageId);
      await productService.deleteImage(imageId);
      
      // Cập nhật thông tin biến thể đã chọn
      if (selectedVariant) {
        setSelectedVariant({
          ...selectedVariant,
          images: selectedVariant.images.filter(img => img.id !== imageId)
        });
      }
      
      // Hiển thị thông báo
      showNotification('success', 'Xóa ảnh thành công');
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi xóa ảnh:', err);
      showNotification('danger', 'Đã xảy ra lỗi khi xóa ảnh');
    }
  };

  // Hàm mở modal xác nhận xóa biến thể
  const handleDeleteVariantConfirm = (variant) => {
    if (!variant || !variant.id) {
      console.error('[PRODUCT MANAGEMENT] Biến thể không hợp lệ:', variant);
      showNotification('danger', 'Không thể xóa biến thể này');
      return;
    }
    
    setDeletingVariant(variant);
    setShowDeleteVariantModal(true);
  };

  // Hàm xóa biến thể và các ảnh liên quan
  const handleDeleteVariant = async () => {
    if (!deletingVariant) return;
    
    try {
      setDeleteVariantLoading(true);
      
      // Xóa các ảnh liên quan trước
      if (deletingVariant.images && deletingVariant.images.length > 0) {
        for (const image of deletingVariant.images) {
          if (image && image.id) {
            console.log('[PRODUCT MANAGEMENT] Đang xóa ảnh có ID:', image.id);
            await productService.deleteImage(image.id);
          }
        }
      }
      
      // Sau đó xóa biến thể
      console.log('[PRODUCT MANAGEMENT] Đang xóa biến thể:', deletingVariant);
      await productService.deleteVariant(deletingVariant.id);
      
      // Cập nhật danh sách
      setVariants(prevVariants => 
        prevVariants.filter(v => v.id !== deletingVariant.id)
      );
      
      // Hiển thị thông báo
      showNotification('success', 'Xóa biến thể thành công');
      
      // Đóng modal
      setShowDeleteVariantModal(false);
    } catch (err) {
      console.error('[PRODUCT MANAGEMENT] Lỗi khi xóa biến thể:', err);
      showNotification('danger', 'Đã xảy ra lỗi khi xóa biến thể');
    } finally {
      setDeleteVariantLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Quản lý dòng sản phẩm</h2>

      {/* Hiển thị thông báo */}
      {notification.show && (
        <Alert variant={notification.type} onClose={() => setNotification({ show: false, type: '', message: '' })} dismissible>
          {notification.message}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center card-header-tgdd">
          <span>
            {isSearchResult 
              ? `Kết quả tìm kiếm: "${searchTerm}" (${productLines.length} dòng sản phẩm)` 
              : 'Danh sách dòng sản phẩm'
            }
          </span>
          <div>
            {isSearchResult && (
              <Button variant="outline-light" size="sm" className="me-2" onClick={clearSearch}>
                <i className="bi bi-arrow-left me-1"></i> Quay lại
              </Button>
            )}
            <Button variant="light" size="sm" onClick={handleAddProductLine}>
              <i className="bi bi-plus-circle me-1"></i> Thêm dòng sản phẩm
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải danh sách dòng sản phẩm...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : productLines.length === 0 ? (
            <div className="text-center py-4">
              {isSearchResult ? (
                <>
                  <p className="text-muted">Không tìm thấy dòng sản phẩm phù hợp với từ khóa "{searchTerm}"</p>
                  <Button variant="outline-secondary" onClick={clearSearch}>
                    <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted">Chưa có dòng sản phẩm nào</p>
                  <Button variant="primary" onClick={handleAddProductLine}>
                    <i className="bi bi-plus-circle me-1"></i> Thêm dòng sản phẩm mới
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Tên dòng sản phẩm</th>
                  <th style={{ width: '15%' }}>Mã dòng sản phẩm</th>
                  <th style={{ width: '20%' }}>Danh mục</th>
                  <th style={{ width: '20%' }}>Thương hiệu</th>
                  <th style={{ width: '15%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {productLines.map((productLine, index) => (
                  <tr key={productLine.id}>
                    <td>{index + 1}</td>
                    <td>{productLine.name || ''}</td>
                    <td>{productLine.code || ''}</td>
                    <td>{productLine.category?.name || 'Không xác định'}</td>
                    <td>{productLine.brand?.name || 'Không xác định'}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleViewProducts(productLine)}>
                        <i className="bi bi-box"></i>
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditProductLine(productLine)}>
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteConfirm(productLine)}>
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

      {/* Modal thêm/sửa dòng sản phẩm */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="productLineName">
              <Form.Label>Tên dòng sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên dòng sản phẩm"
                value={editingProductLine.name}
                onChange={(e) => setEditingProductLine({ ...editingProductLine, name: e.target.value })}
                required
              />
            </Form.Group>
            
            {!editingProductLine.id && (
              <Form.Group className="mb-3" controlId="productLineCode">
                <Form.Label>Mã dòng sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập mã dòng sản phẩm"
                  value={editingProductLine.code}
                  onChange={(e) => setEditingProductLine({ ...editingProductLine, code: e.target.value })}
                  required
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3" controlId="productLineCategory">
              <Form.Label>Danh mục sản phẩm</Form.Label>
              <Form.Select
                value={editingProductLine.categoryId}
                onChange={(e) => setEditingProductLine({ ...editingProductLine, categoryId: e.target.value })}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories && categories.filter(Boolean).map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productLineBrand">
              <Form.Label>Thương hiệu</Form.Label>
              <Form.Select
                value={editingProductLine.brandId}
                onChange={(e) => setEditingProductLine({ ...editingProductLine, brandId: e.target.value })}
                required
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands && brands.filter(Boolean).map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveProductLine} disabled={modalLoading}>
            {modalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa dòng sản phẩm */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa dòng sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa dòng sản phẩm <strong>{deletingProductLine?.name}</strong>?
          <p className="text-danger mt-2">Lưu ý: Hành động này không thể hoàn tác.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteProductLine} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal xem sản phẩm của dòng sản phẩm */}
      <Modal show={showProductsModal} onHide={() => setShowProductsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sản phẩm thuộc dòng: {selectedProductLine?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productsError && <Alert variant="danger">{productsError}</Alert>}
          
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" size="sm" onClick={handleAddProduct}>
              <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
            </Button>
          </div>
          
          {productsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải danh sách sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Chưa có sản phẩm nào thuộc dòng sản phẩm này</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>ID</th>
                  <th style={{ width: '30%' }}>Tên sản phẩm</th>
                  <th style={{ width: '15%' }}>Hình ảnh</th>
                  <th style={{ width: '15%' }}>Giá</th>
                  <th style={{ width: '20%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name || 'Không xác định'}</td>
                    <td className="text-center">
                      {product.image && product.image.base64 ? (
                        <Image 
                          src={`data:image/jpeg;base64,${product.image.base64}`} 
                          alt={product.name} 
                          style={{ height: '50px', maxWidth: '100%' }} 
                          thumbnail 
                        />
                      ) : (
                        <span className="text-muted">Không có ảnh</span>
                      )}
                    </td>
                    <td>{product.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) : 'Chưa cập nhật'}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleViewAttributes(product)}>
                        <i className="bi bi-info-circle"></i>
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditProduct(product)}>
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteProductConfirm(product)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductsModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal thêm/sửa sản phẩm */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{productModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productModalError && <Alert variant="danger">{productModalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productCode">
              <Form.Label>Mã sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã sản phẩm"
                value={editingProduct.code}
                onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Mã sản phẩm phải là duy nhất
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Mô tả sản phẩm</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả sản phẩm"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productBasePrice">
              <Form.Label>Giá cơ bản (VNĐ)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá cơ bản"
                value={editingProduct.basePrice}
                onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Hình ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <Image 
                    src={imagePreview} 
                    alt="Hình ảnh sản phẩm" 
                    style={{ maxHeight: '200px', maxWidth: '100%' }} 
                    thumbnail 
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveProduct} disabled={productModalLoading}>
            {productModalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal show={showDeleteProductModal} onHide={() => setShowDeleteProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa sản phẩm <strong>{deletingProduct?.name}</strong>?
          <p className="text-danger mt-2">Lưu ý: Hành động này không thể hoàn tác.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteProductModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={deleteProductLoading}>
            {deleteProductLoading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal xem thuộc tính sản phẩm */}
      <Modal show={showAttributesModal} onHide={() => setShowAttributesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm: {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attributesError && <Alert variant="danger">{attributesError}</Alert>}
          {variantsError && <Alert variant="danger">{variantsError}</Alert>}
          
          {attributesLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải thông tin sản phẩm...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 row">
                <div className="col-md-6">
                  <h5>Thông tin cơ bản</h5>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tên sản phẩm:</label>
                    <p>{selectedProduct?.name || 'Chưa cập nhật'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Mã sản phẩm:</label>
                    <p>{selectedProduct?.code || 'Chưa cập nhật'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Giá cơ bản:</label>
                    <p>{selectedProduct?.basePrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.basePrice) : 'Chưa cập nhật'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Mô tả:</label>
                    <p>{selectedProduct?.description || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h5 className="mb-3">Hình ảnh sản phẩm</h5>
                  {selectedProduct && selectedProduct.image && selectedProduct.image.base64 ? (
                    <div className="text-center">
                      <Image 
                        src={`data:image/jpeg;base64,${selectedProduct.image.base64}`} 
                        alt={selectedProduct.name} 
                        style={{ maxHeight: '200px', maxWidth: '100%' }} 
                        thumbnail 
                      />
                    </div>
                  ) : (
                    <p className="text-muted">Không có hình ảnh</p>
                  )}
                </div>
              </div>
              
              <hr />
              
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="attributes" title="Thuộc tính sản phẩm">
                  {productAttributes.length === 0 ? (
                    <p className="text-muted">Sản phẩm này chưa có thuộc tính nào</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: '30%' }}>Tên thuộc tính</th>
                          <th>Giá trị</th>
                          <th style={{ width: '15%' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productAttributes.map((attribute) => (
                          <tr key={attribute.id}>
                            <td>{attribute.attribute?.name || 'Không xác định'}</td>
                            <td>{attribute.value || 'Chưa cập nhật'}</td>
                            <td>
                              <Button 
                                variant="warning" 
                                size="sm" 
                                onClick={() => handleEditAttribute(attribute)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
                <Tab eventKey="variants" title="Biến thể sản phẩm">
                  <div className="d-flex justify-content-end mb-3">
                    <Button variant="primary" size="sm" onClick={handleAddVariant}>
                      <i className="bi bi-plus-circle me-1"></i> Thêm biến thể mới
                    </Button>
                  </div>
                  
                  {variantsLoading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">Đang tải danh sách biến thể...</p>
                    </div>
                  ) : variants.length === 0 ? (
                    <p className="text-muted">Sản phẩm này chưa có biến thể nào</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th style={{ width: '10%' }}>ID</th>
                          <th style={{ width: '15%' }}>Tên sản phẩm</th>
                          <th style={{ width: '15%' }}>Màu sắc</th>
                          <th style={{ width: '15%' }}>Số lượng còn</th>
                          <th style={{ width: '20%' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((variant) => (
                          <tr key={variant.id}>
                            <td>{variant.id}</td>
                            <td>{selectedProduct?.name || 'Không xác định'}</td>
                            <td>{variant.color || 'Không xác định'}</td>
                            <td>{variant.inventory?.available || 0}</td>
                            <td>
                              <Button variant="info" size="sm" className="me-2" onClick={() => handleViewVariantDetail(variant.id)}>
                                <i className="bi bi-info-circle"></i>
                              </Button>
                              <Button variant="warning" size="sm" onClick={() => handleUpdateInventory(variant)}>
                                <i className="bi bi-box-seam"></i>
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteVariantConfirm(variant)}>
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
              </Tabs>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttributesModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal thêm biến thể mới */}
      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{variantModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {variantModalError && <Alert variant="danger">{variantModalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="variantCode">
              <Form.Label>Mã biến thể</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã biến thể"
                value={editingVariant.code}
                onChange={(e) => setEditingVariant({ ...editingVariant, code: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Mã biến thể phải là duy nhất
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="variantColor">
              <Form.Label>Màu sắc</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập màu sắc (ví dụ: Đen, Trắng, Vàng...)"
                value={editingVariant.color}
                onChange={(e) => setEditingVariant({ ...editingVariant, color: e.target.value })}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="variantAvailable">
              <Form.Label>Số lượng tồn kho</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số lượng tồn kho"
                value={editingVariant.available}
                onChange={(e) => setEditingVariant({ ...editingVariant, available: e.target.value })}
                required
                min="0"
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="variantImage">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={variantFileInputRef}
                onChange={handleVariantImageChange}
                required
              />
              {variantImagePreview && (
                <div className="mt-2 text-center">
                  <Image 
                    src={variantImagePreview} 
                    alt="Hình ảnh biến thể" 
                    style={{ maxHeight: '200px', maxWidth: '100%' }} 
                    thumbnail 
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveVariant} disabled={variantModalLoading}>
            {variantModalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal xem chi tiết biến thể */}
      <Modal show={showVariantDetailModal} onHide={() => setShowVariantDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết biến thể</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {variantDetailError && <Alert variant="danger">{variantDetailError}</Alert>}
          
          {variantDetailLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải thông tin chi tiết...</p>
            </div>
          ) : selectedVariant ? (
            <div>
              <div className="mb-3">
                <label className="form-label fw-bold">ID:</label>
                <p>{selectedVariant.id}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Mã sản phẩm:</label>
                <p>{selectedVariant.code || 'Chưa cập nhật'}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Màu sắc:</label>
                <p>{selectedVariant.color || 'Không xác định'}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Tồn kho:</label>
                <p>{selectedVariant.inventory?.available || 0} sản phẩm</p>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold">Hình ảnh:</label>
                  <Button variant="warning" size="sm" onClick={() => handleUpdateInventory(selectedVariant)}>
                    <i className="bi bi-box-seam me-1"></i> Cập nhật tồn kho
                  </Button>
                </div>
                
                {selectedVariant.images && selectedVariant.images.length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {selectedVariant.images.map((image, index) => (
                      <div key={image.id || index} className="position-relative">
                        <Image 
                          src={`data:image/jpeg;base64,${image.base64}`} 
                          alt={`Hình ảnh ${index + 1}`} 
                          style={{ height: '150px', width: 'auto' }} 
                          thumbnail 
                        />
                        {image.id && (
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="position-absolute top-0 end-0"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Không có hình ảnh</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted">Không tìm thấy thông tin biến thể</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVariantDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal cập nhật tồn kho */}
      <Modal show={showInventoryModal} onHide={() => setShowInventoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật tồn kho</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inventoryModalError && <Alert variant="danger">{inventoryModalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="inventoryAvailable">
              <Form.Label>Số lượng tồn kho</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số lượng tồn kho"
                value={editingInventory.available}
                onChange={(e) => setEditingInventory({ ...editingInventory, available: parseInt(e.target.value, 10) })}
                required
                min="0"
              />
              <Form.Text className="text-muted">
                Nhập số lượng sản phẩm hiện có trong kho
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInventoryModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveInventory} disabled={inventoryModalLoading}>
            {inventoryModalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa thuộc tính */}
      <Modal show={showEditAttributeModal} onHide={() => setShowEditAttributeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thuộc tính</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attributeModalError && <Alert variant="danger">{attributeModalError}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="attributeName">
              <Form.Label>Tên thuộc tính</Form.Label>
              <Form.Control
                type="text"
                value={editingAttribute.attributeName || 'Không xác định'}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="attributeValue">
              <Form.Label>Giá trị</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập giá trị thuộc tính"
                value={editingAttribute.value}
                onChange={(e) => setEditingAttribute({ ...editingAttribute, value: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAttributeModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveAttribute} disabled={attributeModalLoading}>
            {attributeModalLoading ? <Spinner animation="border" size="sm" /> : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa biến thể */}
      <Modal show={showDeleteVariantModal} onHide={() => setShowDeleteVariantModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa biến thể</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa biến thể màu <strong>{deletingVariant?.color}</strong> của sản phẩm <strong>{selectedProduct?.name}</strong>?
          <p className="text-danger mt-2">Lưu ý: Hành động này không thể hoàn tác và sẽ xóa tất cả hình ảnh liên quan.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteVariantModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteVariant} disabled={deleteVariantLoading}>
            {deleteVariantLoading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductLineManagement; 