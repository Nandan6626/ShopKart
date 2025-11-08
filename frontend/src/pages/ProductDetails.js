import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Button,
  Form,
  Badge,
  Carousel,
  Breadcrumb,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { productAPI } from "../api/productAPI";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProductById(id);
        setProduct(data);

        // Fetch related products (mock for now)
        const allProducts = await productAPI.getAllProducts();
        const related = allProducts
          .filter((p) => p._id !== id && p.category === data.category)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    try {
      setAddingToCart(true);
      await addToCart({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: Number(quantity),
      });

      // Show success alert
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    // Here you would typically save to backend or localStorage
  };

  const handleBuyNow = async () => {
    try {
      setBuyingNow(true);
      await addToCart({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: Number(quantity),
      });
      // Navigate to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Failed to buy now:", error);
    } finally {
      setBuyingNow(false);
    }
  };

  // Mock multiple images for the product
  const productImages = [
    product.image,
    product.image, // In real app, these would be different images
    product.image,
    product.image,
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={
            i <= rating
              ? "fas fa-star text-warning"
              : "far fa-star text-warning"
          }
        ></i>
      );
    }
    return stars;
  };

  return (
    <Container className="product-details-page">
      {loading ? (
        <div className="text-center my-5">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb className="fade-in mb-4">
            <Breadcrumb.Item
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-home me-1"></i>Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() =>
                navigate(
                  `/category/${product.category
                    ?.toLowerCase()
                    .replace(" ", "-")}`
                )
              }
              style={{ cursor: "pointer" }}
            >
              {product.category}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
          </Breadcrumb>

          {/* Back to Home Button */}
          <div className="navigation-buttons">
            <Button
              variant="outline-primary"
              onClick={() => navigate("/")}
              className="back-to-home-outline"
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back to Home
            </Button>
          </div>

          <Row className="fade-in">
            {/* Product Images - Large Carousel */}
            <Col lg={6}>
              <div className="product-image-section">
                <Carousel
                  className="product-carousel"
                  indicators={false}
                  controls={productImages.length > 1}
                >
                  {productImages.map((img, index) => (
                    <Carousel.Item key={index}>
                      <div
                        className={`main-image-container ${
                          isZoomed ? "zoomed" : ""
                        }`}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          fluid
                          className="main-product-image"
                        />
                        {product.countInStock === 0 && (
                          <Badge bg="danger" className="stock-badge">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <Row className="mt-3">
                    {productImages.map((img, index) => (
                      <Col key={index} xs={3}>
                        <Image
                          src={img}
                          thumbnail
                          className={`thumbnail-image ${
                            selectedImage === index ? "active" : ""
                          }`}
                          onClick={() => setSelectedImage(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>

            {/* Product Info */}
            <Col lg={6}>
              <div className="product-info">
                <div className="product-header mb-4">
                  <h1 className="product-title mb-3">{product.name}</h1>

                  <div className="rating-section mb-3">
                    <div className="d-flex align-items-center">
                      <div className="stars me-3">
                        {renderStars(product.rating || 4)}
                      </div>
                      <span className="rating-text">
                        <strong>{product.rating || 4}</strong> (
                        {product.numReviews || 125} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="price-section mb-4">
                    <h2 className="product-price mb-2">
                      ₹{product.price} × {quantity} = ₹
                      {product.price * quantity}
                    </h2>
                    <div className="pricing-details">
                      <span className="text-success">
                        <i className="fas fa-truck me-1"></i>
                        Free shipping on orders over ₹500
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-details mb-4">
                  <h5 className="mb-3">Product Description</h5>
                  <p className="text-muted">{product.description}</p>

                  {product.brand && (
                    <div className="brand-info mb-3">
                      <strong>Brand: </strong>
                      <span className="text-primary">{product.brand}</span>
                    </div>
                  )}
                </div>

                {/* Purchase Section */}
                <Card className="purchase-card">
                  <Card.Body>
                    <Row className="align-items-center mb-3">
                      <Col>
                        <h6 className="mb-0">Availability:</h6>
                      </Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success" className="px-3 py-2">
                            <i className="fas fa-check me-1"></i>
                            In Stock ({product.countInStock} available)
                          </Badge>
                        ) : (
                          <Badge bg="danger" className="px-3 py-2">
                            <i className="fas fa-times me-1"></i>
                            Out Of Stock
                          </Badge>
                        )}
                      </Col>
                    </Row>

                    {product.countInStock > 0 && (
                      <Row className="align-items-center mb-4">
                        <Col sm={3}>
                          <Form.Label className="mb-0">Quantity:</Form.Label>
                        </Col>
                        <Col sm={9}>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="quantity-select"
                            style={{ width: "auto" }}
                          >
                            {[
                              ...Array(
                                Math.min(product.countInStock, 10)
                              ).keys(),
                            ].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    )}

                    <div className="action-buttons">
                      <Row className="g-2">
                        <Col md={6}>
                          <Button
                            onClick={addToCartHandler}
                            variant="outline-primary"
                            size="lg"
                            className="w-100"
                            disabled={
                              product.countInStock === 0 || addingToCart
                            }
                          >
                            {addingToCart ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                ></span>
                                Adding...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-shopping-cart me-2"></i>
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </Col>
                        <Col md={6}>
                          <Button
                            onClick={handleBuyNow}
                            variant="primary"
                            size="lg"
                            className="w-100"
                            disabled={product.countInStock === 0 || buyingNow}
                          >
                            {buyingNow ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                ></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-bolt me-2"></i>
                                Buy Now
                              </>
                            )}
                          </Button>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col>
                          <Button
                            variant={wishlist ? "danger" : "outline-danger"}
                            onClick={toggleWishlist}
                            className="w-100"
                          >
                            <i
                              className={`fa${
                                wishlist ? "s" : "r"
                              } fa-heart me-2`}
                            ></i>
                            {wishlist
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="related-products-section mt-5 fade-in">
              <h3 className="section-title mb-4">Related Products</h3>
              <Row>
                {relatedProducts.map((relatedProduct, index) => (
                  <Col
                    key={relatedProduct._id}
                    sm={12}
                    md={6}
                    lg={3}
                    className="mb-4"
                  >
                    <div
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={relatedProduct} />
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductDetails;
