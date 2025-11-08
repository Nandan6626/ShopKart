import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto footer-custom">
      <Container>
        <Row>
          <Col md={3} className="mb-3">
            <h5 className="footer-title">ShopKart</h5>
            <p className="footer-text">
              Your one-stop destination for quality products at unbeatable prices.
            </p>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="footer-subtitle">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/products" className="footer-link">Products</a></li>
              <li><a href="/about" className="footer-link">About Us</a></li>
              <li><a href="/contact" className="footer-link">Contact</a></li>
            </ul>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="footer-subtitle">Categories</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="/category/electronics" className="footer-link">Electronics</a></li>
              <li><a href="/category/clothing" className="footer-link">Clothing</a></li>
              <li><a href="/category/books" className="footer-link">Books</a></li>
              <li><a href="/category/home" className="footer-link">Home & Garden</a></li>
            </ul>
          </Col>
          <Col md={2} className="mb-3">
            <h6 className="footer-subtitle">Support</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="/help" className="footer-link">Help Center</a></li>
              <li><a href="/shipping" className="footer-link">Shipping Info</a></li>
              <li><a href="/returns" className="footer-link">Returns</a></li>
              <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <h6 className="footer-subtitle">Follow Us</h6>
            <div className="social-icons">
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="mt-3">
              <h6 className="footer-subtitle">Newsletter</h6>
              <p className="footer-text small">Subscribe for updates and exclusive offers</p>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col className="text-center py-2">
            <p className="mb-0 footer-copyright">
              &copy; 2024 ShopKart. All rights reserved. | 
              <a href="/terms" className="footer-link ms-2">Terms of Service</a> |
              <a href="/privacy" className="footer-link ms-2">Privacy Policy</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;