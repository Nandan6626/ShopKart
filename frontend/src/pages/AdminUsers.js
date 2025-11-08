import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { userAPI } from '../api/userAPI';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAllUsers();
      // getAllUsers returns structured response with users array
      const usersArray = Array.isArray(data) ? data : (data.users || []);
      setUsers(usersArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(true);
      await userAPI.updateUser(userId, { isActive: !currentStatus });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        await userAPI.deleteUser(userId);
        await fetchUsers(); // Refresh the list
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return (
    <Container>
      <div className="text-center my-5">
        <Loader />
        <p className="mt-3 text-muted">Loading users...</p>
      </div>
    </Container>
  );

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div>
          <h1 className="display-5 fw-bold">
            <i className="fas fa-users me-3"></i>
            User Management
          </h1>
          <p className="text-muted">Manage customer accounts and permissions</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="fade-in">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4 fade-in" style={{ animationDelay: '0.1s' }}>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h4>{users.length}</h4>
              <small className="text-muted">Total Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-user-check fa-2x text-success mb-2"></i>
              <h4>{users.filter(user => user.isActive !== false).length}</h4>
              <small className="text-muted">Active Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-user-shield fa-2x text-warning mb-2"></i>
              <h4>{users.filter(user => user.isAdmin).length}</h4>
              <small className="text-muted">Admin Users</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-user-clock fa-2x text-info mb-2"></i>
              <h4>
                {users.filter(user => {
                  const created = new Date(user.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return created >= weekAgo;
                }).length}
              </h4>
              <small className="text-muted">New This Week</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="fade-in" style={{ animationDelay: '0.2s' }}>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            All Users
          </h5>
        </Card.Header>
        <Card.Body>
          {users.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-3">
                          <i className="fas fa-user-circle fa-2x text-muted"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{user.name || 'Unknown'}</div>
                          <small className="text-muted">ID: {user._id?.slice(-6) || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <Badge bg={user.isAdmin ? 'danger' : 'primary'}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isActive !== false ? 'success' : 'secondary'}>
                        {user.isActive !== false ? 'Active' : 'Blocked'}
                      </Badge>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleShowDetails(user)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button
                          variant={user.isActive !== false ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                          disabled={actionLoading || user.isAdmin}
                          title={user.isActive !== false ? 'Block User' : 'Activate User'}
                        >
                          <i className={`fas ${user.isActive !== false ? 'fa-ban' : 'fa-check'}`}></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={actionLoading || user.isAdmin}
                          title="Delete User"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No Users Found</h5>
              <p className="text-muted">No users are registered in the system.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user me-2"></i>
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <h6>Personal Information</h6>
                <p><strong>Name:</strong> {selectedUser.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                <p><strong>User ID:</strong> {selectedUser._id || 'N/A'}</p>
                <p><strong>Role:</strong> 
                  <Badge bg={selectedUser.isAdmin ? 'danger' : 'primary'} className="ms-2">
                    {selectedUser.isAdmin ? 'Admin' : 'Customer'}
                  </Badge>
                </p>
                <p><strong>Status:</strong> 
                  <Badge bg={selectedUser.isActive !== false ? 'success' : 'secondary'} className="ms-2">
                    {selectedUser.isActive !== false ? 'Active' : 'Blocked'}
                  </Badge>
                </p>
              </Col>
              <Col md={6}>
                <h6>Account Information</h6>
                <p><strong>Joined:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Last Updated:</strong> {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Email Verified:</strong> 
                  <Badge bg={selectedUser.isEmailVerified ? 'success' : 'warning'} className="ms-2">
                    {selectedUser.isEmailVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;