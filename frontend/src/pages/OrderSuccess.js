import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { orderAPI } from "../api/orderAPI";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.getOrderById(id);
        setOrder(data.order || data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(
          error.response?.data?.message || error.message || "Order not found"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <Loader />
          <p className="mt-3 text-muted">Loading order details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center my-5">
          <Message variant="danger">{error}</Message>
          <div className="navigation-buttons">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="back-to-home-primary"
            >
              <i className="fas fa-home me-2"></i>
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="text-center my-5">
          <Message variant="warning">Order not found</Message>
          <div className="navigation-buttons">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="back-to-home-primary"
            >
              <i className="fas fa-home me-2"></i>
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="order-success-page">
      {/* Success Banner */}
      <div className="text-center mb-5 fade-in">
        <div className="success-icon mb-3">
          <i className="fas fa-check-circle fa-5x text-success"></i>
        </div>
        <h1 className="display-4 fw-bold text-success mb-2">
          Order Successful!
        </h1>
        <p className="lead text-muted">
          Thank you for your order. Your order has been placed successfully.
        </p>
        <Alert
          variant="success"
          className="mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <i className="fas fa-info-circle me-2"></i>
          <strong>Order ID:</strong> {order._id}
          <br />
          {order.paymentMethod === "Cash on Delivery" ? (
            <>
              <i className="fas fa-money-bill-wave me-2"></i>
              <strong>Payment:</strong> You will pay ₹
              {order.totalPrice.toFixed(2)} when your order is delivered.
            </>
          ) : (
            <>
              <i className="fas fa-credit-card me-2"></i>
              <strong>Payment Status:</strong>{" "}
              {order.isPaid ? "Paid" : "Pending"}
            </>
          )}
        </Alert>
      </div>

      <Row>
        <Col md={8}>
          {/* Order Details */}
          <Card className="mb-4 fade-in" style={{ animationDelay: "0.1s" }}>
            <Card.Header>
              <h4 className="mb-0">
                <i className="fas fa-shopping-bag me-2"></i>
                Order Details
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>
                    <Badge
                      bg={
                        order.paymentMethod === "Cash on Delivery"
                          ? "warning"
                          : "primary"
                      }
                      className="ms-2"
                    >
                      {order.paymentMethod}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Payment Status:</strong>
                    <Badge
                      bg={order.isPaid ? "success" : "warning"}
                      className="ms-2"
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </p>
                  <p>
                    <strong>Delivery Status:</strong>
                    <Badge
                      bg={order.isDelivered ? "success" : "info"}
                      className="ms-2"
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </Badge>
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-4 fade-in" style={{ animationDelay: "0.2s" }}>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                Shipping Address
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-1">
                <strong>{order.user?.name || "Customer"}</strong>
              </p>
              <p className="mb-1">{order.shippingAddress.address}</p>
              <p className="mb-1">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="mb-0">{order.shippingAddress.country}</p>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card className="mb-4 fade-in" style={{ animationDelay: "0.3s" }}>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-box me-2"></i>
                Order Items
              </h5>
            </Card.Header>
            <ListGroup variant="flush">
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "60px" }}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">
                          Quantity: {item.qty}
                        </small>
                      </Col>
                      <Col md={2}>
                        <strong>₹{item.price}</strong>
                      </Col>
                      <Col md={2}>
                        <strong>₹{(item.qty * item.price).toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>
                  <p className="text-center text-muted mb-0">No items found</p>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          {/* Order Summary */}
          <Card className="fade-in" style={{ animationDelay: "0.4s" }}>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Order Summary
              </h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col className="text-end">
                    ₹{order.itemsPrice?.toFixed(2) || "0.00"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col className="text-end">
                    ₹{order.shippingPrice?.toFixed(2) || "0.00"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col className="text-end">
                    ₹{order.taxPrice?.toFixed(2) || "0.00"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total:</strong>
                  </Col>
                  <Col className="text-end">
                    <strong>₹{order.totalPrice?.toFixed(2) || "0.00"}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          {/* Action Buttons */}
          <div className="d-grid gap-2 mt-4">
            <Button
              variant="primary"
              onClick={() => navigate("/orders")}
              className="mb-2"
            >
              <i className="fas fa-list me-2"></i>
              View All Orders
            </Button>
            <Button variant="outline-primary" onClick={() => navigate("/")}>
              <i className="fas fa-shopping-cart me-2"></i>
              Continue Shopping
            </Button>
          </div>

          {/* Estimated Delivery */}
          {!order.isDelivered && (
            <Card className="mt-4">
              <Card.Body>
                <h6>
                  <i className="fas fa-truck me-2"></i>
                  Estimated Delivery
                </h6>
                <p className="text-muted mb-0">
                  {order.paymentMethod === "Cash on Delivery"
                    ? "3-5 business days"
                    : "2-4 business days"}
                </p>
                <small className="text-muted">
                  We'll send you tracking information once your order ships.
                </small>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;
