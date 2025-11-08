import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';
import { orderAPI } from '../api/orderAPI';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await orderAPI.getUserOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Handle delete order confirmation
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Confirm delete order
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setDeleteLoading(orderToDelete._id);
      await orderAPI.deleteOrder(orderToDelete._id);
      
      // Remove order from state (optimistic update)
      setOrders(orders.filter(order => order._id !== orderToDelete._id));
      
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      setError(error.message || 'Failed to delete order');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Check if order can be deleted (not paid and not delivered)
  const canDeleteOrder = (order) => {
    return !order.isPaid && !order.isDelivered;
  };

  return (
    <>
      <h1>My Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
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
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt?.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          <i className="fas fa-eye me-1"></i>Details
                        </Button>
                      </LinkContainer>
                      {canDeleteOrder(order) && (
                        <Button
                          className="btn-sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deleteLoading === order._id}
                        >
                          {deleteLoading === order._id ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-1"></i>Deleting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trash me-1"></i>Delete
                            </>
                          )}
                        </Button>
                      )}
                    </div>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-exclamation-triangle text-warning me-2"></i>
            Confirm Delete Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToDelete && (
            <div>
              <p>Are you sure you want to delete this order?</p>
              <div className="alert alert-info">
                <strong>Order ID:</strong> {orderToDelete._id}<br />
                <strong>Date:</strong> {orderToDelete.createdAt?.substring(0, 10)}<br />
                <strong>Total:</strong> ₹{orderToDelete.totalPrice}
              </div>
              <div className="alert alert-warning">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Note:</strong> This action cannot be undone. The product stock will be restored.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            <i className="fas fa-times me-1"></i>Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteOrder}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-1"></i>Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-1"></i>Delete Order
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyOrders;