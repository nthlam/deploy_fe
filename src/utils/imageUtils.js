/**
 * Hàm chuyển đổi ảnh sang định dạng base64
 * @param {File} file - File ảnh được upload
 * @returns {Promise<string>} - Chuỗi base64 của ảnh
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Không tìm thấy file ảnh'));
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      reject(new Error('Định dạng file không hợp lệ. Vui lòng sử dụng JPEG, PNG, GIF hoặc WebP.'));
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('Kích thước file quá lớn. Vui lòng sử dụng file nhỏ hơn 5MB.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Hàm tạo đối tượng Image từ chuỗi base64
 * @param {string} base64 - Chuỗi base64 của ảnh
 * @param {string} id - ID của ảnh (tùy chọn)
 * @param {boolean} isPrimary - Cờ đánh dấu ảnh chính (mặc định: true)
 * @returns {Object} - Đối tượng Image phù hợp với API
 */
export const createImageObject = (base64, id = null, isPrimary = true) => {
  return {
    id: id || generateUniqueId(),
    base64,
    isPrimary
  };
};

/**
 * Tạo ID ngẫu nhiên cho ảnh
 * @returns {string} - ID ngẫu nhiên dạng chuỗi
 */
export const generateUniqueId = () => {
  return 'img_' + Math.random().toString(36).substring(2, 11);
};

/**
 * Hàm kiểm tra xem chuỗi có phải là base64 của ảnh hay không
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isBase64Image = (str) => {
  if (!str || typeof str !== 'string') {
    return false;
  }
  // Kiểm tra định dạng base64 image
  return str.startsWith('data:image/');
};

/**
 * Tạo preview URL từ file ảnh
 * @param {File} file - File ảnh
 * @returns {string} - URL để preview ảnh
 */
export const createImagePreviewUrl = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * Hàm giải phóng URL preview khi không cần thiết nữa
 * @param {string} url - URL cần giải phóng
 */
export const revokeImagePreviewUrl = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
}; 