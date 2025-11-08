import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { orderAPI } from '../api/orderAPI';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.getAllOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const markAsPaid = async (orderId) => {
    if (window.confirm('Mark this order as paid?')) {
      try {
        setActionLoading(true);
        await orderAPI.updateOrderStatus(orderId, { action: 'markPaid' });
        // Refresh orders list
        const data = await orderAPI.getAllOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const markAsDelivered = async (orderId) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        setActionLoading(true);
        await orderAPI.updateOrderStatus(orderId, { action: 'markDelivered' });
        // Refresh orders list
        const data = await orderAPI.getAllOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYMENT METHOD</th>
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
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt?.substring(0, 10)}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    <Badge bg={order.paymentMethod === 'Cash on Delivery' ? 'warning' : 'primary'}>
                      {order.paymentMethod || 'PayPal'}
                    </Badge>
                  </td>
                  <td>
                    {order.isPaid ? (
                      <>
                        <Badge bg="success">Paid</Badge>
                        <br />
                        <small>{order.paidAt?.substring(0, 10)}</small>
                      </>
                    ) : (
                      <Badge bg={order.paymentMethod === 'Cash on Delivery' ? 'warning' : 'danger'}>
                        {order.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Unpaid'}
                      </Badge>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <>
                        <Badge bg="success">Delivered</Badge>
                        <br />
                        <small>{order.deliveredAt?.substring(0, 10)}</small>
                      </>
                    ) : (
                      <Badge bg="info">Processing</Badge>
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="outline-info" size="sm" title="View Details">
                          <i className="fas fa-eye"></i>
                        </Button>
                      </LinkContainer>
                      {order.paymentMethod === 'Cash on Delivery' && !order.isPaid && (
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          title="Mark as Paid"
                          onClick={() => markAsPaid(order._id)}
                          disabled={actionLoading}
                        >
                          <i className="fas fa-dollar-sign"></i>
                        </Button>
                      )}
                      {!order.isDelivered && order.isPaid && (
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          title="Mark as Delivered"
                          onClick={() => markAsDelivered(order._id)}
                          disabled={actionLoading}
                        >
                          <i className="fas fa-truck"></i>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminOrders;