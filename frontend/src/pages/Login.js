import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error, login, clearErrors } = useContext(UserContext);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    // Clear errors when component mounts
    clearErrors();
  }, []); // Empty dependency array to run only once

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-hover fade-in">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
                <h2 className="card-title">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>
              
              {error && (
                <div className="fade-in">
                  <Message variant="danger">{error}</Message>
                </div>
              )}
              
              {loading && (
                <div className="text-center mb-3">
                  <Loader />
                </div>
              )}
              
              <Form onSubmit={submitHandler} className="fade-in">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>
                    <i className="fas fa-envelope me-2"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot your password?
                  </Link>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="text-center bg-light">
              <p className="mb-0">
                New to ShopKart?{' '}
                <Link 
                  to={redirect ? `/signup?redirect=${redirect}` : '/signup'}
                  className="text-decoration-none fw-bold"
                >
                  Create Account
                </Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;