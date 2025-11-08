import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Message from '../components/Message';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { orderAPI } from '../api/orderAPI';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const {
    cart,
    shippingAddress,
    paymentMethod,
    saveShippingAddress,
    savePaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useContext(CartContext);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || 'Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping address fields');
      return;
    }

    const shippingData = { address, city, postalCode, country };
    saveShippingAddress(shippingData);
    savePaymentMethod(selectedPaymentMethod);

    try {
      setLoading(true);
      setIsProcessingOrder(true);
      
      // Transform cart items to match backend order item structure
      const transformedOrderItems = cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id, // Map _id to product field
      }));
      
      console.log('Sending order with items:', transformedOrderItems);
      
      const orderData = {
        orderItems: transformedOrderItems,
        shippingAddress: shippingData,
        paymentMethod: selectedPaymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const order = await orderAPI.createOrder(orderData);
      
      // Navigate to order success page with the order data (use replace to prevent back navigation issues)
      navigate(`/order/${order.order?._id || order._id}`, { 
        replace: true,
        state: { 
          orderSuccess: true, 
          paymentMethod: selectedPaymentMethod,
          totalAmount: totalPrice 
        } 
      });
      
      // Clear cart after navigation with a small delay
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setIsProcessingOrder(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0 && !isProcessingOrder) {
    navigate('/cart');
    return null;
  }

  return (
    <Container>
      <Row>
        <Col md={8}>
          <Form onSubmit={submitHandler}>
            <h2>Shipping Address</h2>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>

            <h2><i className="fas fa-credit-card me-2"></i>Payment Method</h2>
            <Form.Group className="mb-3">
              <Form.Label as="legend">Select Payment Method</Form.Label>
              <Col>
                <Form.Check
                  type="radio"
                  label={<><i className="fab fa-paypal me-2"></i>PayPal or Credit Card</>}
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={selectedPaymentMethod === 'PayPal'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label={<><i className="fas fa-money-bill-wave me-2"></i>Cash on Delivery</>}
                  id="CashOnDelivery"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={selectedPaymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                {selectedPaymentMethod === 'Cash on Delivery' && (
                  <div className="alert alert-info mt-2">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>You will pay when your order is delivered to your address.</small>
                  </div>
                )}
              </Col>
            </Form.Group>

            {error && <Message variant="danger">{error}</Message>}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Form>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;