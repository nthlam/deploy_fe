import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Row, Col } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [role, setRole] = useState('STAFF'); // Default role is STAFF
  
  const { login, error, currentUser, userRole } = useAuth();

  // Sử dụng useEffect để xử lý redirect khi đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu form
    if (!email || !password) {
      setFormError('Vui lòng nhập email và mật khẩu');
      return;
    }
    
    setLoading(true);
    setFormError('');
    
    try {
      console.log('Attempting login as', role, 'with:', { email, password: '****' });
      const success = await login(email, password, role);
      
      console.log('Login result:', success);
      
      if (!success) {
        setFormError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error('Login component error:', error);
      setFormError('Đã xảy ra lỗi khi đăng nhập: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="login-form text-center">
              <div className="login-logo mb-4">
                <h1 style={{ color: '#000000', fontWeight: 'bold' }}>
                  <span style={{ color: '#ffd700' }}>TechShop</span>
                  <span style={{ fontSize: '0.7em', color: '#ffd700' }}>.com</span>
                </h1>
                <p className="text-muted">Hệ thống quản lý</p>
              </div>
              
              <Card className="shadow">
                <Card.Body className="p-4">
                  <h4 className="text-center mb-4">Đăng nhập</h4>
                  
                  {(error || formError) && (
                    <Alert variant="danger" className="alert-pastel-danger mb-3">
                      {error || formError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    {/* Phần chọn vai trò đăng nhập */}
                    <Form.Group className="mb-4" controlId="formRole">
                      <Form.Label>Vai trò</Form.Label>
                      <div className="d-flex justify-content-center gap-4">
                        <Form.Check
                          type="radio"
                          label="Nhân viên"
                          name="roleGroup"
                          id="roleStaff"
                          value="STAFF"
                          checked={role === 'STAFF'}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        <Form.Check
                          type="radio"
                          label="Quản trị viên"
                          name="roleGroup"
                          id="roleAdmin"
                          value="ADMIN"
                          checked={role === 'ADMIN'}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </div>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        type="submit" 
                        className="btn-primary-pastel"
                        disabled={loading}
                      >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 