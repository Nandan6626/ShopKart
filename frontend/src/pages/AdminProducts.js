import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Card, Modal, Form, Badge, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { productAPI } from '../api/productAPI';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    brand: '',
    category: '',
    countInStock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getAllProducts();
      // getAllProducts might return array directly or structured response
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        brand: product.brand || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        brand: '',
        category: '',
        countInStock: '',
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      brand: '',
      category: '',
      countInStock: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock),
      };
      
      if (modalMode === 'create') {
        await productAPI.createProduct(productData);
      } else {
        await productAPI.updateProduct(selectedProduct._id, productData);
      }
      
      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        await productAPI.deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'];

  if (loading) return (
    <Container>
      <div className="text-center my-5">
        <Loader />
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    </Container>
  );

  return (
    <Container fluid>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div>
          <h1 className="display-5 fw-bold">
            <i className="fas fa-box me-3"></i>
            Product Management
          </h1>
          <p className="text-muted">Manage your product inventory</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Dashboard
          </Link>
          <Button 
            variant="primary" 
            onClick={() => handleShowModal('create')}
          >
            <i className="fas fa-plus me-2"></i>
            Add Product
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="fade-in">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Stats and Search */}
      <Row className="mb-4 fade-in" style={{ animationDelay: '0.1s' }}>
        <Col md={8}>
          <Row>
            <Col md={3}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <i className="fas fa-boxes fa-2x text-primary mb-2"></i>
                  <h4>{products.length}</h4>
                  <small className="text-muted">Total Products</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <i className="fas fa-exclamation-triangle fa-2x text-warning mb-2"></i>
                  <h4>{products.filter(p => p.countInStock < 10).length}</h4>
                  <small className="text-muted">Low Stock</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <i className="fas fa-times-circle fa-2x text-danger mb-2"></i>
                  <h4>{products.filter(p => p.countInStock === 0).length}</h4>
                  <small className="text-muted">Out of Stock</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <i className="fas fa-layer-group fa-2x text-info mb-2"></i>
                  <h4>{[...new Set(products.map(p => p.category))].length}</h4>
                  <small className="text-muted">Categories</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Products Table */}
      <Card className="fade-in" style={{ animationDelay: '0.2s' }}>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Products ({filteredProducts.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {currentProducts.length > 0 ? (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={product.image || 'https://via.placeholder.com/50'} 
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded me-3"
                          />
                          <div>
                            <div className="fw-bold">{product.name || 'Unknown Product'}</div>
                            <small className="text-muted">ID: {product._id?.slice(-6) || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold text-success">₹{product.price || '0.00'}</td>
                      <td>
                        <Badge bg={
                          product.countInStock === 0 ? 'danger' : 
                          product.countInStock < 10 ? 'warning' : 'success'
                        }>
                          {product.countInStock || 0}
                        </Badge>
                      </td>
                      <td>{product.category || 'N/A'}</td>
                      <td>{product.brand || 'N/A'}</td>
                      <td>
                        <Badge bg={product.countInStock > 0 ? 'success' : 'danger'}>
                          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowModal('edit', product)}
                            title="Edit Product"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteHandler(product._id)}
                            disabled={actionLoading}
                            title="Delete Product"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <span className="align-self-center mx-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="ms-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h5>No Products Found</h5>
              <p className="text-muted">
                {searchTerm ? 'No products match your search criteria.' : 'No products in inventory.'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={`fas ${modalMode === 'create' ? 'fa-plus' : 'fa-edit'} me-2`}></i>
              {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                    />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <i className={`fas ${modalMode === 'create' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                  {modalMode === 'create' ? 'Create Product' : 'Update Product'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProducts;