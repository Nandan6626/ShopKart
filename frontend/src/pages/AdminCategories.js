import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentCategory: '',
  });

  // Mock categories data
  const mockCategories = [
    {
      _id: '1',
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      parentCategory: null,
      productCount: 15,
      subcategories: [
        { _id: '1a', name: 'Phones', productCount: 8 },
        { _id: '1b', name: 'Laptops', productCount: 5 },
        { _id: '1c', name: 'Headphones', productCount: 2 },
      ]
    },
    {
      _id: '2',
      name: 'Fashion',
      description: 'Clothing and accessories',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      parentCategory: null,
      productCount: 12,
      subcategories: [
        { _id: '2a', name: 'Mens Clothing', productCount: 6 },
        { _id: '2b', name: 'Womens Clothing', productCount: 4 },
        { _id: '2c', name: 'Shoes', productCount: 2 },
      ]
    },
    {
      _id: '3',
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      parentCategory: null,
      productCount: 8,
      subcategories: [
        { _id: '3a', name: 'Kitchen', productCount: 4 },
        { _id: '3b', name: 'Cleaning', productCount: 2 },
        { _id: '3c', name: 'Furniture', productCount: 2 },
      ]
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const handleShowModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        parentCategory: category.parentCategory || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        parentCategory: '',
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      parentCategory: '',
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalMode === 'create') {
        const newCategory = {
          _id: Date.now().toString(),
          ...formData,
          productCount: 0,
          subcategories: []
        };
        setCategories(prev => [...prev, newCategory]);
      } else {
        setCategories(prev => prev.map(cat => 
          cat._id === selectedCategory._id 
            ? { ...cat, ...formData }
            : cat
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      setError('Failed to save category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setActionLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      } catch (error) {
        setError('Failed to delete category');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return (
    <Container>
      <div className="text-center my-5">
        <Loader />
        <p className="mt-3 text-muted">Loading categories...</p>
      </div>
    </Container>
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div>
          <h1 className="display-5 fw-bold">
            <i className="fas fa-layer-group me-3"></i>
            Category Management
          </h1>
          <p className="text-muted">Organize your products into categories and subcategories</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Dashboard
          </Link>
          <Button variant="primary" onClick={() => handleShowModal('create')}>
            <i className="fas fa-plus me-2"></i>
            Add Category
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="fade-in">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row className="mb-4 fade-in" style={{ animationDelay: '0.1s' }}>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-layer-group fa-2x text-primary mb-2"></i>
              <h4>{categories.length}</h4>
              <small className="text-muted">Main Categories</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-sitemap fa-2x text-success mb-2"></i>
              <h4>{categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}</h4>
              <small className="text-muted">Subcategories</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-boxes fa-2x text-info mb-2"></i>
              <h4>{categories.reduce((acc, cat) => acc + cat.productCount, 0)}</h4>
              <small className="text-muted">Total Products</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <i className="fas fa-chart-pie fa-2x text-warning mb-2"></i>
              <h4>{categories.filter(cat => cat.productCount > 0).length}</h4>
              <small className="text-muted">Active Categories</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="fade-in" style={{ animationDelay: '0.2s' }}>
        {categories.map((category, index) => (
          <Col lg={6} xl={4} className="mb-4" key={category._id}>
            <Card className="category-management-card h-100">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={category.image}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <Badge bg="primary">{category.productCount} products</Badge>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {category.name}
                  <div className="btn-group">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowModal('edit', category)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteCategory(category._id)}
                      disabled={actionLoading}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </Card.Title>
                <Card.Text className="text-muted">{category.description}</Card.Text>
                
                <div className="mt-3">
                  <h6>Subcategories:</h6>
                  {category.subcategories.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {category.subcategories.map(sub => (
                        <Badge key={sub._id} bg="secondary" className="me-1 mb-1">
                          {sub.name} ({sub.productCount})
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <small className="text-muted">No subcategories</small>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={`fas ${modalMode === 'create' ? 'fa-plus' : 'fa-edit'} me-2`}></i>
              {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Parent Category</Form.Label>
                  <Form.Select
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleInputChange}
                  >
                    <option value="">None (Main Category)</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Image</Form.Label>
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
                placeholder="Enter category description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <i className={`fas ${modalMode === 'create' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                  {modalMode === 'create' ? 'Create Category' : 'Update Category'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCategories;