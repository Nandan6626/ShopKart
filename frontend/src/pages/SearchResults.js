import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { productAPI } from "../api/productAPI";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const query = searchParams.get("q") || "";

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = { keyword: query.trim() };

        // Add sorting parameters
        if (sortBy === "price-low") {
          params.sortBy = "price";
          params.sortOrder = "asc";
        } else if (sortBy === "price-high") {
          params.sortBy = "price";
          params.sortOrder = "desc";
        } else if (sortBy === "newest") {
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
        } else if (sortBy === "rating") {
          params.sortBy = "rating";
          params.sortOrder = "desc";
        }

        const data = await productAPI.getProducts(params);
        // getProducts returns structured response
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError(error.message || "Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <Loader />
        </div>
      </Container>
    );
  }

  return (
    <Container className="search-results-page">
      {/* Breadcrumb */}
      <Breadcrumb className="fade-in mb-4">
        <Breadcrumb.Item
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-home me-1"></i>Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Search Results</Breadcrumb.Item>
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

      {/* Search Header */}
      <div className="search-header fade-in mb-4">
        <h1 className="display-5 fw-bold text-gradient mb-2">
          <i className="fas fa-search me-3"></i>
          Search Results
        </h1>
        {query && (
          <p className="lead text-muted">
            Showing results for: <strong>"{query}"</strong>
          </p>
        )}
      </div>

      {/* Search Bar */}
      <Card
        className="search-card fade-in mb-4"
        style={{ animationDelay: "0.1s" }}
      >
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button variant="primary" type="submit">
                <i className="fas fa-search"></i> Search
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {error && <Message variant="danger">{error}</Message>}

      {/* Results Section */}
      <div
        className="results-section fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {products.length} Product{products.length !== 1 ? "s" : ""} Found
          </h4>
          <div className="d-flex align-items-center">
            <span className="text-muted me-2">Sort by:</span>
            <Form.Select
              size="sm"
              style={{ width: "auto" }}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Customer Rating</option>
            </Form.Select>
          </div>
        </div>

        {!query.trim() ? (
          <Alert variant="info" className="text-center py-5">
            <i className="fas fa-search fa-3x mb-3 text-muted"></i>
            <h4>Start Your Search</h4>
            <p className="mb-0">Enter a search term above to find products</p>
          </Alert>
        ) : products.length === 0 ? (
          <Alert variant="warning" className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x mb-3 text-muted"></i>
            <h4>No Results Found</h4>
            <p className="mb-3">
              We couldn't find any products matching "<strong>{query}</strong>".
              Try different keywords or browse our categories.
            </p>
            <div className="navigation-buttons">
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                className="back-to-home-primary"
              >
                <i className="fas fa-home me-2"></i>
                Back to Home
              </Button>
            </div>
          </Alert>
        ) : (
          <Row>
            {products.map((product, index) => (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="mb-4"
              >
                <div
                  className="fade-in product-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Suggestions for no results */}
      {query.trim() && products.length === 0 && !loading && (
        <Card
          className="suggestions-card fade-in mt-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Card.Body>
            <h5 className="mb-3">
              <i className="fas fa-lightbulb me-2"></i>
              Search Suggestions
            </h5>
            <Row>
              <Col md={6}>
                <h6>Try searching for:</h6>
                <ul className="list-unstyled">
                  <li>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSearchParams({ q: "laptop" })}
                    >
                      Laptops
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSearchParams({ q: "phone" })}
                    >
                      Phones
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSearchParams({ q: "shoes" })}
                    >
                      Shoes
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSearchParams({ q: "electronics" })}
                    >
                      Electronics
                    </Button>
                  </li>
                </ul>
              </Col>
              <Col md={6}>
                <h6>Popular Categories:</h6>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/category/electronics")}
                  >
                    Electronics
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/category/fashion")}
                  >
                    Fashion
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/category/home-garden")}
                  >
                    Home & Garden
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/category/books")}
                  >
                    Books
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SearchResults;
