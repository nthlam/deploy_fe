import api from './api';

const API_URL = 'https://phone-selling-app-mw21.onrender.com';

// Dịch vụ quản lý sản phẩm
export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      console.log('[PRODUCT SERVICE] Đang lấy danh sách sản phẩm');
      const response = await api.get('/api/v1/product');
      console.log('[PRODUCT SERVICE] Đã lấy danh sách sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    try {
      console.log('[PRODUCT SERVICE] Đang lấy thông tin sản phẩm có ID:', id);
      const response = await api.get(`/api/v1/product/${id}`);
      console.log('[PRODUCT SERVICE] Đã lấy thông tin sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi lấy thông tin sản phẩm:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      console.log('[PRODUCT SERVICE] Đang tạo sản phẩm mới:', productData);
      
      // Đảm bảo dữ liệu hợp lệ
      const validData = { 
        name: productData.name,
        code: productData.code,
        description: productData.description || '',
        basePrice: Number(productData.basePrice),
        productLineId: Number(productData.productLineId)
      };
      
      // Thêm hình ảnh nếu có
      if (productData.image && productData.image.base64) {
        validData.image = {
          base64: productData.image.base64,
          isPrimary: productData.image.isPrimary || true
        };
      }
      
      console.log('[PRODUCT SERVICE] Đang gửi dữ liệu sản phẩm:', validData);
      const response = await api.post('/api/v1/product', validData);
      console.log('[PRODUCT SERVICE] Đã tạo sản phẩm mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi tạo sản phẩm mới:', error);
      throw error;
    }
  },

  // Cập nhật thông tin sản phẩm
  updateProduct: async (productData) => {
    try {
      console.log('[PRODUCT SERVICE] Đang cập nhật sản phẩm:', productData);
      
      // Đảm bảo dữ liệu hợp lệ
      const validData = { 
        id: productData.id,
        name: productData.name,
        code: productData.code,
        description: productData.description || '',
        basePrice: Number(productData.basePrice)
      };
      
      // Thêm hình ảnh nếu có
      if (productData.image && productData.image.base64) {
        validData.image = {
          base64: productData.image.base64,
          isPrimary: productData.image.isPrimary || true
        };
      }
      
      console.log('[PRODUCT SERVICE] Đang gửi dữ liệu cập nhật:', validData);
      const response = await api.put('/api/v1/product', validData);
      console.log('[PRODUCT SERVICE] Đã cập nhật sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi cập nhật sản phẩm:', error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      console.log('[PRODUCT SERVICE] Đang xóa sản phẩm có ID:', id);
      const response = await api.delete(`/api/v1/product/${id}`);
      console.log('[PRODUCT SERVICE] Đã xóa sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi xóa sản phẩm:', error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm của dòng sản phẩm theo ID
  getProductsByProductLineId: async (productLineId) => {
    try {
      console.log('[PRODUCT SERVICE] Đang lấy danh sách sản phẩm của dòng sản phẩm có ID:', productLineId);
      const response = await api.get(`/api/v1/product/product-line/${productLineId}`);
      console.log('[PRODUCT SERVICE] Đã lấy danh sách sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi lấy danh sách sản phẩm:', error);
      throw error;
    }
  },

  // Cập nhật thuộc tính sản phẩm
  updateProductAttribute: async (attributeData) => {
    try {
      console.log('[PRODUCT SERVICE] Đang cập nhật thuộc tính sản phẩm:', attributeData);
      const response = await api.put('/api/v1/product/attribute', attributeData);
      console.log('[PRODUCT SERVICE] Đã cập nhật thuộc tính sản phẩm:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi cập nhật thuộc tính sản phẩm:', error);
      throw error;
    }
  },

  // Lấy danh sách biến thể của sản phẩm theo ID sản phẩm
  getVariantsByProductId: async (productId) => {
    try {
      console.log('[PRODUCT SERVICE] Đang lấy danh sách biến thể của sản phẩm có ID:', productId);
      const response = await api.get(`/api/v1/variant/product/${productId}`);
      console.log('[PRODUCT SERVICE] Đã lấy danh sách biến thể:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi lấy danh sách biến thể:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết biến thể theo ID
  getVariantById: async (variantId) => {
    try {
      console.log('[PRODUCT SERVICE] Đang lấy thông tin chi tiết biến thể có ID:', variantId);
      const response = await api.get(`/api/v1/variant/${variantId}`);
      console.log('[PRODUCT SERVICE] Đã lấy thông tin chi tiết biến thể:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi lấy thông tin chi tiết biến thể:', error);
      throw error;
    }
  },

  // Tạo biến thể mới
  createVariant: async (variantData) => {
    try {
      console.log('[PRODUCT SERVICE] Đang tạo biến thể mới:', variantData);
      
      // Đảm bảo dữ liệu đầu vào hợp lệ
      const validData = {
        code: variantData.code,
        color: variantData.color,
        productId: Number(variantData.productId),
        available: Number(variantData.available),
        images: variantData.images.map(img => ({
          // Không gửi ID cho ảnh mới
          base64: img.base64,
          isPrimary: img.isPrimary
        }))
      };
      
      console.log('[PRODUCT SERVICE] Đang gửi dữ liệu biến thể:', validData);
      const response = await api.post('/api/v1/variant', validData);
      console.log('[PRODUCT SERVICE] Đã tạo biến thể mới:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi tạo biến thể mới:', error);
      throw error;
    }
  },

  // Cập nhật số lượng tồn kho cho biến thể
  updateVariantInventory: async (inventoryData) => {
    try {
      console.log('[PRODUCT SERVICE] Đang cập nhật tồn kho biến thể:', inventoryData);
      const response = await api.put('/api/v1/variant/available', inventoryData);
      console.log('[PRODUCT SERVICE] Đã cập nhật tồn kho biến thể:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi cập nhật tồn kho biến thể:', error);
      throw error;
    }
  },

  // Xóa ảnh
  deleteImage: async (imageId) => {
    try {
      console.log('[PRODUCT SERVICE] Đang xóa ảnh có ID:', imageId);
      const response = await api.delete(`/api/v1/image/${imageId}`);
      console.log('[PRODUCT SERVICE] Đã xóa ảnh:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi xóa ảnh:', error);
      throw error;
    }
  },

  // Xóa biến thể sản phẩm
  deleteVariant: async (variantId) => {
    try {
      console.log('[PRODUCT SERVICE] Đang xóa biến thể có ID:', variantId);
      const response = await api.delete(`/api/v1/variant/${variantId}`);
      console.log('[PRODUCT SERVICE] Đã xóa biến thể:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PRODUCT SERVICE] Lỗi khi xóa biến thể:', error);
      throw error;
    }
  }
};

export default productService; 