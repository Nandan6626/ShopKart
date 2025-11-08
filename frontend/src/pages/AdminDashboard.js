import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, ProgressBar, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { orderAPI } from '../api/orderAPI';
import { productAPI } from '../api/productAPI';
import { userAPI } from '../api/userAPI';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrdersList, setRecentOrdersList] = useState([]);
  const [lowStockProductsList, setLowStockProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data with error handling
        const [ordersResponse, productsResponse, usersResponse] = await Promise.allSettled([
          orderAPI.getAllOrders(),
          productAPI.getAllProducts(),
          userAPI.getAllUsers(),
        ]);

        // Safely extract data or use empty arrays
        const ordersData = ordersResponse.status === 'fulfilled' ? (ordersResponse.value || []) : [];
        const productsData = productsResponse.status === 'fulfilled' ? (productsResponse.value || []) : [];
        const usersData = usersResponse.status === 'fulfilled' ? (usersResponse.value || []) : [];

        // Extract arrays from structured responses
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
        const products = Array.isArray(productsData) ? productsData : (productsData.products || []);
        const users = Array.isArray(usersData) ? usersData : (usersData.users || []);

        // Ensure arrays are actually arrays
        const ordersArray = Array.isArray(orders) ? orders : [];
        const productsArray = Array.isArray(products) ? products : [];
        const usersArray = Array.isArray(users) ? users : [];

        // Calculate stats safely
        const totalRevenue = ordersArray.reduce((acc, order) => {
          return (order && order.isPaid && order.totalPrice) ? acc + Number(order.totalPrice) : acc;
        }, 0);
        
        const recentOrders = ordersArray.filter(order => {
          if (!order || !order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        }).length;
        
        const pendingOrders = ordersArray.filter(order => {
          return order && !order.isDelivered;
        }).length;
        
        const lowStockProducts = productsArray.filter(product => {
          return product && product.countInStock < 10;
        });

        // Get recent orders for display
        const recentOrdersForDisplay = ordersArray
          .filter(order => order && order.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalOrders: ordersArray.length,
          totalProducts: productsArray.length,
          totalUsers: usersArray.length,
          totalRevenue: totalRevenue.toFixed(2),
          recentOrders,
          pendingOrders,
          lowStockProducts: lowStockProducts.length,
        });
        
        setRecentOrdersList(recentOrdersForDisplay);
        setLowStockProductsList(lowStockProducts.slice(0, 5));
        
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, delay, subtitle, progress, onClick }) => (
    <Col xl={3} md={6} className="mb-4">
      <Card 
        className={`stat-card h-100 fade-in shadow-hover ${onClick ? 'cursor-pointer' : ''}`} 
        style={{ animationDelay: `${delay}s` }}
        onClick={onClick}
      >
        <Card.Body>
          <div className="d-flex align-items-center">
            <div className={`stat-icon bg-${color}`}>
              <i className={`fas ${icon} fa-2x text-white`}></i>
            </div>
            <div className="ms-3 flex-grow-1">
              <div className="stat-number">{value}</div>
              <div className="stat-title">{title}</div>
              {subtitle && <small className="text-muted">{subtitle}</small>}
              {progress !== undefined && (
                <ProgressBar 
                  variant={color} 
                  now={progress} 
                  className="mt-2"
                  style={{ height: '4px' }}
                />
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  const QuickActionCard = ({ title, icon, color, description, link }) => (
    <Col md={3} className="mb-3">
      <Link to={link} className="text-decoration-none">
        <Card className="quick-action-card h-100 text-center shadow-hover">
          <Card.Body>
            <div className={`quick-action-icon bg-${color} mx-auto mb-3`}>
              <i className={`fas ${icon} fa-2x text-white`}></i>
            </div>
            <h6 className="fw-bold">{title}</h6>
            <small className="text-muted">{description}</small>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );

  if (loading) return (
    <Container>
      <div className="text-center my-5">
        <Loader />
        <p className="mt-3 text-muted">Loading dashboard data...</p>
      </div>
    </Container>
  );
  
  if (error) return (
    <Container>
      <div className="text-center my-5">
        <Message variant="danger">{error}</Message>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()} 
          className="mt-3"
        >
          <i className="fas fa-redo me-2"></i>
          Retry
        </Button>
      </div>
    </Container>
  );

  return (
    <Container fluid>
      {/* Dashboard Header */}
      <div className="dashboard-header fade-in mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="display-4 fw-bold text-gradient mb-2">
              <i className="fas fa-tachometer-alt me-3"></i>
              Admin Dashboard
            </h1>
            <p className="lead text-muted">Welcome back! Here's what's happening with your store today.</p>
          </Col>
          <Col xs="auto">
            <Badge bg="success" className="px-3 py-2">
              <i className="fas fa-circle me-2"></i>
              System Online
            </Badge>
          </Col>
        </Row>
      </div>
      
      {/* Stats Cards */}
      <Row>
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="fa-shopping-bag"
          color="primary"
          delay={0.1}
          subtitle={`${stats.pendingOrders} pending`}
          progress={75}
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon="fa-dollar-sign"
          color="success"
          delay={0.2}
          subtitle="Total earnings"
          progress={85}
        />
        
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="fa-box"
          color="info"
          delay={0.3}
          subtitle={`${stats.lowStockProducts} low stock`}
          progress={60}
        />
        
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="fa-users"
          color="warning"
          delay={0.4}
          subtitle="Registered customers"
          progress={90}
        />
      </Row>
      
      {/* Quick Actions */}
      <Row className="mt-5 fade-in" style={{ animationDelay: '0.5s' }}>
        <Col>
          <Card className="quick-actions-card">
            <Card.Header>
              <h4 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <QuickActionCard
                  title="Product Management"
                  icon="fa-box"
                  color="primary"
                  description="Add, edit, or delete products"
                  link="/admin/products"
                />
                <QuickActionCard
                  title="Order Management"
                  icon="fa-shopping-cart"
                  color="success"
                  description="View and manage orders"
                  link="/admin/orders"
                />
                <QuickActionCard
                  title="User Management"
                  icon="fa-users"
                  color="info"
                  description="Manage customer accounts"
                  link="/admin/users"
                />
                <QuickActionCard
                  title="Category Management"
                  icon="fa-layer-group"
                  color="warning"
                  description="Organize product categories"
                  link="/admin/categories"
                />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="mt-4 fade-in" style={{ animationDelay: '0.6s' }}>
        <Col md={8}>
          <Card className="recent-orders-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Orders
              </h5>
            </Card.Header>
            <Card.Body>
              {recentOrdersList.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrdersList.map((order, index) => (
                      <tr key={order._id || index}>
                        <td className="fw-bold text-primary">
                          #{order._id?.slice(-6) || 'N/A'}
                        </td>
                        <td>{order.user?.name || 'Unknown'}</td>
                        <td className="fw-bold text-success">₹{order.totalPrice || '0.00'}</td>
                        <td>
                          <Badge bg={order.isDelivered ? 'success' : order.isPaid ? 'warning' : 'danger'}>
                            {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                          </Badge>
                        </td>
                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No recent orders</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="low-stock-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Low Stock Alert
              </h5>
            </Card.Header>
            <Card.Body>
              {lowStockProductsList.length > 0 ? (
                lowStockProductsList.map((product, index) => (
                  <div key={product._id || index} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-bold">{product.name || 'Unknown Product'}</div>
                      <small className="text-muted">Stock: {product.countInStock || 0}</small>
                    </div>
                    <Badge bg="danger">{product.countInStock || 0} left</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <p className="text-muted">All products well stocked</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;