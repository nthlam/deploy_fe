import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import { authService } from '../services/api';

const Profile = () => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  
  // State cho thông tin cá nhân
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loadingPersonalInfo, setLoadingPersonalInfo] = useState(false);
  
  // State cho form thông tin cá nhân
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [updateInfoLoading, setUpdateInfoLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });
  
  // State cho form đổi mật khẩu
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Lấy thông tin cá nhân khi component mount
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoadingPersonalInfo(true);
        const response = await authService.getPersonalInfo();
        
        if (response && response.success && response.data) {
          setPersonalInfo(response.data);
          setFullName(response.data.fullName || '');
        } else {
          console.error('API trả về lỗi:', response);
          // Sử dụng thông tin từ currentUser nếu không lấy được từ API
          setPersonalInfo(currentUser);
          setFullName(currentUser?.fullName || '');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cá nhân:', error);
        // Sử dụng thông tin từ currentUser nếu có lỗi
        setPersonalInfo(currentUser);
        setFullName(currentUser?.fullName || '');
      } finally {
        setLoadingPersonalInfo(false);
      }
    };

    fetchPersonalInfo();
  }, [currentUser]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setInfoMessage({ type: 'danger', text: 'Vui lòng nhập họ tên' });
      return;
    }
    
    setUpdateInfoLoading(true);
    setInfoMessage({ type: '', text: '' });
    
    try {
      console.log('Calling updateProfile with fullName:', fullName);
      const result = await updateProfile(fullName);
      console.log('Update profile result:', result);
      
      if (result.success) {
        setInfoMessage({ type: 'success', text: 'Cập nhật thông tin thành công' });
        
        // Không cần gọi lại API vì updateProfile đã cập nhật currentUser
        if (result.data) {
          setPersonalInfo(result.data);
        } else {
          // Nếu không có data, gọi lại API để lấy thông tin mới nhất
          const response = await authService.getPersonalInfo();
          if (response && response.success && response.data) {
            setPersonalInfo(response.data);
          }
        }
      } else {
        setInfoMessage({ type: 'danger', text: result.message || 'Không thể cập nhật thông tin' });
      }
    } catch (error) {
      console.error('Profile update error in component:', error);
      setInfoMessage({ type: 'danger', text: error.message || 'Đã xảy ra lỗi khi cập nhật thông tin' });
    } finally {
      setUpdateInfoLoading(false);
    }
  };

  // Kiểm tra mật khẩu hợp lệ
  const validatePassword = (password) => {
    // Mật khẩu phải có ít nhất 8 ký tự
    if (password.length < 8) {
      return { valid: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' };
    }
    return { valid: true, message: '' };
  };

  // Xử lý đổi mật khẩu
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu nhập vào
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'danger', text: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'danger', text: 'Mật khẩu mới không khớp' });
      return;
    }
    
    // Kiểm tra định dạng mật khẩu mới
    const validationResult = validatePassword(newPassword);
    if (!validationResult.valid) {
      setPasswordMessage({ type: 'danger', text: validationResult.message });
      return;
    }
    
    setUpdatePasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      console.log('Calling updatePassword with length:', newPassword.length);
      const result = await updatePassword(oldPassword, newPassword);
      console.log('Update password result:', result);
      
      if (result.success) {
        setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công' });
        
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Nếu có thông tin người dùng mới từ API, cập nhật lại state
        if (result.data) {
          setPersonalInfo(result.data);
        }
      } else {
        setPasswordMessage({ type: 'danger', text: result.message || 'Không thể đổi mật khẩu' });
      }
    } catch (error) {
      console.error('Password update error in component:', error);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Đã xảy ra lỗi khi đổi mật khẩu';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Mật khẩu không hợp lệ. Có thể mật khẩu cũ không chính xác hoặc mật khẩu mới không đáp ứng yêu cầu.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
        setPasswordMessage({ 
          type: 'danger', 
        text: errorMessage
        });
    } finally {
      setUpdatePasswordLoading(false);
    }
  };

  // Dùng thông tin từ personalInfo nếu có, nếu không dùng currentUser
  const userInfo = personalInfo || currentUser || {};

  return (
    <Container>
      <h2 className="mb-4">Tài khoản của tôi</h2>
      
      {loadingPersonalInfo ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải thông tin cá nhân...</p>
        </div>
      ) : (
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  backgroundColor: '#FEE800',
                  color: '#000',
                  fontSize: '2rem'
                }}
              >
                  {userInfo?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
                <h5>{userInfo?.fullName || 'Người dùng'}</h5>
                <p className="text-muted mb-0">{userInfo?.email || 'email@example.com'}</p>
                <p className="text-muted mb-0">
                  {userInfo?.role?.name || (userInfo?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên')}
                </p>
                {userInfo?.phoneNumber && (
                  <p className="text-muted mb-0">SĐT: {userInfo.phoneNumber}</p>
                )}
              <p className="text-muted mb-0">
                  Trạng thái: {userInfo?.isActive ? 
                    <span className="text-success">Đang hoạt động</span> : 
                    <span className="text-danger">Bị khóa</span>
                  }
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card>
            <Card.Header className="card-header-tgdd">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-0 border-0"
              >
                <Tab eventKey="info" title="Thông tin cá nhân" />
                <Tab eventKey="password" title="Đổi mật khẩu" />
              </Tabs>
            </Card.Header>
            
            <Card.Body>
              {activeTab === 'info' && (
                <>
                  {infoMessage.text && (
                    <Alert variant={infoMessage.type}>
                      {infoMessage.text}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleUpdateInfo}>
                    <Form.Group className="mb-3" controlId="profileEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                          value={userInfo?.email || ''}
                        disabled
                        aria-describedby="emailHelpText"
                      />
                      <Form.Text id="emailHelpText" className="text-muted">
                        Email không thể thay đổi
                      </Form.Text>
                    </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="profileRole">
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Control
                          type="text"
                          value={userInfo?.role?.name || (userInfo?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên')}
                          disabled
                        />
                      </Form.Group>
                      
                      {userInfo?.phoneNumber && (
                        <Form.Group className="mb-3" controlId="profilePhone">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="text"
                            value={userInfo.phoneNumber}
                            disabled
                          />
                        </Form.Group>
                      )}
                    
                    <Form.Group className="mb-4" controlId="profileFullName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      className="btn-primary-tgdd"
                      disabled={updateInfoLoading}
                    >
                      {updateInfoLoading ? 'Đang xử lý...' : 'Cập nhật thông tin'}
                    </Button>
                  </Form>
                </>
              )}
              
              {activeTab === 'password' && (
                <>
                  {passwordMessage.text && (
                    <Alert variant={passwordMessage.type}>
                      {passwordMessage.text}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleUpdatePassword}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                      <Form.Label>Mật khẩu hiện tại</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        aria-describedby="passwordHelpText"
                      />
                      <Form.Text id="passwordHelpText" className="text-muted">
                          Mật khẩu phải có ít nhất 8 ký tự
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      className="btn-primary-tgdd"
                      disabled={updatePasswordLoading}
                    >
                      {updatePasswordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      )}
    </Container>
  );
};

export default Profile; 