import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import { orderAPI } from "../api/orderAPI";

const Profile = () => {
  const { user, loading, error, updateProfile, clearErrors } =
    useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Clear errors when component mounts
    clearErrors();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setOrdersLoading(true);
        const data = await orderAPI.getUserOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setOrdersError(error.response?.data?.message || error.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
      updateProfile({
        name,
        email,
        password: password || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  return (
    <Row>
      <Col md={3}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>User Profile</h2>
          {!isEditing && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleEditClick}
            >
              <i className="fas fa-edit me-1"></i>Edit
            </Button>
          )}
        </div>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        {isEditing ? (
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Update
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <div className="profile-display">
            <div className="mb-3">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="mb-3">
              <strong>Role:</strong>{" "}
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </div>
          </div>
        )}
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {ordersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant="danger">{ordersError}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt?.substring(0, 10)}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt?.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt?.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          <i className="fas fa-eye me-1"></i>Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    You have no orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default Profile;
