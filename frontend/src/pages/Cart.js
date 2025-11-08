import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image, Button, Card, Alert } from 'react-bootstrap';
import Message from '../components/Message';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    resetCart,
    itemsPrice, 
    error, 
    clearCartError 
  } = useContext(CartContext);
  
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});

  const handleQuantityChange = async (itemId, newQuantity) => {
    // Validate quantity
    if (newQuantity < 1) return;
    
    const item = cart.find(cartItem => cartItem._id === itemId);
    if (!item) return;
    
    if (newQuantity > item.countInStock) {
      alert(`Sorry, only ${item.countInStock} items are available in stock.`);
      return;
    }
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    clearCartError();
    
    try {
      await updateCartQuantity(itemId, Number(newQuantity));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setRemovingItems(prev => ({ ...prev, [itemId]: true }));
    clearCartError();
    
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setRemovingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <Container>
      {/* Debug Section - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-3 p-2 bg-light border rounded">
          <small className="text-muted">
            Debug: Cart has {cart.length} items. 
            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={resetCart}
              className="ms-2"
            >
              Clear Cart Data
            </Button>
          </small>
        </div>
      )}
      <Row>
        <Col md={8}>
          <h1 className="fade-in">
            <i className="fas fa-shopping-cart me-2"></i>
            Shopping Cart
          </h1>
          
          {error && (
            <div className="fade-in mb-3">
              <Message variant="danger">{error}</Message>
            </div>
          )}
          
          {cart.length === 0 ? (
            <div className="fade-in">
              <Alert variant="info" className="text-center py-4">
                <i className="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                <h4>Your cart is empty</h4>
                <p className="mb-3">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Continue Shopping
                </Link>
              </Alert>
            </div>
          ) : (
            <ListGroup variant="flush" className="fade-in">
              {cart.map((item, index) => (
                <ListGroup.Item 
                  key={item._id} 
                  className={`cart-item ${removingItems[item._id] ? 'removing' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: removingItems[item._id] ? 0.5 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fluid 
                        rounded 
                        className="cart-item-image"
                        style={{ height: '80px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col md={3}>
                      <Link 
                        to={`/product/${item._id}`} 
                        className="text-decoration-none fw-bold"
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <strong className="text-success">₹{item.price}</strong>
                    </Col>
                    <Col md={3}>
                      <div className="d-flex flex-column align-items-center">
                        <small className="text-muted mb-1">Quantity</small>
                        <div className="quantity-controls d-flex align-items-center border rounded">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn border-0"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems[item._id]}
                            style={{ 
                              borderRadius: '0',
                              minWidth: '35px',
                              height: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fas fa-minus"></i>
                          </Button>
                          
                          <div className="quantity-display d-flex align-items-center justify-content-center"
                               style={{
                                 minWidth: '50px',
                                 height: '35px',
                                 backgroundColor: '#f8f9fa',
                                 borderLeft: '1px solid #dee2e6',
                                 borderRight: '1px solid #dee2e6',
                                 fontWeight: 'bold'
                               }}>
                            {updatingItems[item._id] ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              item.quantity
                            )}
                          </div>
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn border-0"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.countInStock || updatingItems[item._id]}
                            style={{
                              borderRadius: '0',
                              minWidth: '35px',
                              height: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                        {item.quantity >= item.countInStock && (
                          <small className="text-warning mt-1">Max stock reached</small>
                        )}
                      </div>
                    </Col>
                    <Col md={2} className="text-center">
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={removingItems[item._id]}
                        className="remove-btn"
                      >
                        {removingItems[item._id] ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        
        <Col md={4}>
          <Card className="fade-in order-summary-card" style={{ animationDelay: '0.2s' }}>
            <Card.Header>
              <h4 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Order Summary
              </h4>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Items ({cart.reduce((acc, item) => acc + item.quantity, 0)}):</Col>
                  <Col className="text-end">
                    <strong>₹{itemsPrice.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col className="text-end">
                    <span className="text-success">
                      {itemsPrice > 500 ? 'FREE' : '₹50.00'}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax (15%):</Col>
                  <Col className="text-end">
                    ₹{(itemsPrice * 0.15).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col><strong>Total:</strong></Col>
                  <Col className="text-end">
                    <strong className="text-primary fs-5">
                      ₹{(itemsPrice + (itemsPrice > 500 ? 0 : 50) + (itemsPrice * 0.15)).toFixed(2)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to="/checkout">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-100"
                    disabled={cart.length === 0}
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceed To Checkout
                  </Button>
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;