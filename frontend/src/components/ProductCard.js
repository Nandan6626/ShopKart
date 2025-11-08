import React, { useContext, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Message from "./Message";

const ProductCard = ({ product }) => {
  const { addToCart, error, clearCartError } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const addToCartHandler = async () => {
    try {
      setIsAdding(true);
      clearCartError();

      await addToCart({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1,
      });

      // Show success alert
      alert("Item added to cart successfully!");

      // Show success message
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4);
    const hasHalfStar = (rating || 4) % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <i key={i} className="fas fa-star-half-alt text-warning"></i>
        );
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    return stars;
  };

  return (
    <Card className="product-card h-100 position-relative">
      {/* Success Message */}
      {showMessage && (
        <div
          className="position-absolute"
          style={{ top: "10px", right: "10px", zIndex: 10 }}
        >
          <Badge bg="success" className="success-badge">
            <i className="fas fa-check me-1"></i>
            Added!
          </Badge>
        </div>
      )}

      {/* Stock Badge */}
      {product.countInStock === 0 && (
        <div
          className="position-absolute"
          style={{ top: "10px", left: "10px", zIndex: 10 }}
        >
          <Badge bg="danger">Out of Stock</Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="product-image-container" onClick={handleViewDetails}>
        <Card.Img
          src={product.image || "https://via.placeholder.com/300x300"}
          variant="top"
          alt={product.name}
          className="product-image"
        />
        <div className="image-overlay">
          <Button
            variant="outline-light"
            size="sm"
            className="view-details-btn"
          >
            <i className="fas fa-eye me-2"></i>
            Quick View
          </Button>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Product Title */}
        <Card.Title className="product-title mb-2" onClick={handleViewDetails}>
          {product.name}
        </Card.Title>

        {/* Rating */}
        <div className="rating-section mb-2">
          <div className="d-flex align-items-center">
            <div className="stars me-2">{renderStars(product.rating)}</div>
            <small className="text-muted">({product.numReviews || 125})</small>
          </div>
        </div>

        {/* Price */}
        <div className="price-section mb-3">
          <h5 className="product-price mb-0">₹{product.price}</h5>
          {product.originalPrice && product.originalPrice > product.price && (
            <small className="text-muted text-decoration-line-through">
              ₹{product.originalPrice}
            </small>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-2">
            <Message variant="danger" className="small">
              {error}
            </Message>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={addToCartHandler}
              disabled={product.countInStock === 0 || isAdding}
              className="add-to-cart-btn"
            >
              {isAdding ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Adding...
                </>
              ) : product.countInStock === 0 ? (
                <>
                  <i className="fas fa-times me-2"></i>
                  Out of Stock
                </>
              ) : (
                <>
                  <i className="fas fa-cart-plus me-2"></i>
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleViewDetails}
              className="view-details-full-btn"
            >
              <i className="fas fa-info-circle me-2"></i>
              View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
