import React, { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { productAPI } from "../api/productAPI";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getAllProducts();
        // getAllProducts returns either just array or structured response
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
        // Set first 6 products as featured
        setFeaturedProducts(productsArray.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      description: "Latest gadgets and electronics",
      icon: "fas fa-laptop",
    },
    {
      name: "Fashion",
      slug: "fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      description: "Trendy clothing and accessories",
      icon: "fas fa-tshirt",
    },
    {
      name: "Home & Garden",
      slug: "home-garden",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      description: "Everything for your home",
      icon: "fas fa-home",
    },
    {
      name: "Books",
      slug: "books",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      description: "Discover new worlds",
      icon: "fas fa-book",
    },
  ];

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel className="hero-carousel mb-5" fade>
        <Carousel.Item>
          <div
            className="carousel-slide d-flex align-items-center justify-content-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "400px",
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold mb-3 fade-in">
                Welcome to ShopKart
              </h1>
              <p className="lead mb-4 fade-in">
                Discover amazing products at unbeatable prices
              </p>
              <Button
                variant="primary"
                size="lg"
                className="fade-in btn-modern"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="carousel-slide d-flex align-items-center justify-content-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "400px",
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold mb-3 fade-in">
                Latest Electronics
              </h1>
              <p className="lead mb-4 fade-in">
                Cutting-edge technology at your fingertips
              </p>
              <Button
                variant="success"
                size="lg"
                className="fade-in btn-modern"
              >
                Explore Electronics
              </Button>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="carousel-slide d-flex align-items-center justify-content-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "400px",
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold mb-3 fade-in">Free Shipping</h1>
              <p className="lead mb-4 fade-in">
                On orders over 1000. Limited time offer!
              </p>
              <Button
                variant="warning"
                size="lg"
                className="fade-in btn-modern"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container>
        {/* Categories Section */}
        <section className="categories-section mb-5">
          <h2 className="text-center mb-4 section-title fade-in">
            Shop by Category
          </h2>
          <Row>
            {categories.map((category, index) => (
              <Col key={category.slug} md={3} sm={6} className="mb-4">
                <Card
                  className="category-card h-100 fade-in shadow-hover"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <Card.Img
                    variant="top"
                    src={category.image}
                    className="category-image"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="text-center d-flex flex-column">
                    <div className="mb-3">
                      <i
                        className={`${category.icon} fa-2x text-primary mb-2`}
                      ></i>
                    </div>
                    <Card.Title className="h5 fw-bold">
                      {category.name}
                    </Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                      {category.description}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      className="mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.slug);
                      }}
                    >
                      <i className="fas fa-arrow-right me-2"></i>
                      Browse {category.name}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Products Section */}
        <section className="featured-section mb-5">
          <h2 className="text-center mb-4 section-title fade-in">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row>
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={4}
                    className="mb-4"
                  >
                    <div
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <p className="text-muted">No featured products available</p>
                </Col>
              )}
            </Row>
          )}
        </section>

        {/* Latest Products Section */}
        <section className="latest-section">
          <h2 className="text-center mb-4 section-title fade-in">
            Latest Products
          </h2>
          {loading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row>
              {products && products.length > 6 ? (
                products.slice(6).map((product, index) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="mb-4"
                  >
                    <div
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <p className="text-muted">No additional products available</p>
                </Col>
              )}
            </Row>
          )}
        </section>
      </Container>
    </div>
  );
};

export default Home;
