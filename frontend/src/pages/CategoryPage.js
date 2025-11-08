import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Breadcrumb,
  Alert,
} from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { productAPI } from "../api/productAPI";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Define subcategories for each main category based on actual products
  const subcategoryConfig = {
    electronics: {
      title: "Electronics",
      subcategories: [
        { key: "all", label: "All Electronics", filter: null },
        {
          key: "phones",
          label: "Phones & Mobile",
          filter: ["phone", "iphone", "mobile", "smartphone"],
        },
        {
          key: "laptops",
          label: "Laptops & Computers",
          filter: ["laptop", "macbook", "pro", "computer"],
        },
        {
          key: "tablets",
          label: "Tablets",
          filter: ["tablet", "tab", "ipad", "samsung"],
        },
        {
          key: "audio",
          label: "Audio & Headphones",
          filter: ["airpods", "earbuds", "headphones", "audio", "wireless"],
        },
      ],
    },
    fashion: {
      title: "Fashion",
      subcategories: [
        { key: "all", label: "All Fashion", filter: null },
        {
          key: "women",
          label: "Women's Clothing",
          filter: ["women", "womens", "ladies"],
        },
        {
          key: "men",
          label: "Men's Clothing",
          filter: ["men", "mens", "male"],
        },
        {
          key: "kids",
          label: "Kids & Children",
          filter: ["kids", "children", "child", "rainbow"],
        },
        {
          key: "footwear",
          label: "Shoes & Footwear",
          filter: ["shoes", "sneakers", "boots", "casual"],
        },
        {
          key: "outerwear",
          label: "Jackets & Outerwear",
          filter: ["jacket", "denim", "classic", "outerwear"],
        },
      ],
    },
    "home-garden": {
      title: "Home & Garden",
      subcategories: [
        { key: "all", label: "All Home & Garden", filter: null },
        {
          key: "kitchen",
          label: "Kitchen & Dining",
          filter: [
            "plate",
            "dinner",
            "cutlery",
            "bottle",
            "cutting",
            "board",
            "stainless",
            "steel",
            "glass",
            "water",
          ],
        },
        {
          key: "cookware",
          label: "Cookware",
          filter: ["pan", "frying", "cooking", "non-stick"],
        },
        {
          key: "storage",
          label: "Storage & Organization",
          filter: ["container", "storage", "airtight", "food"],
        },
        {
          key: "garden",
          label: "Garden & Plants",
          filter: ["garden", "watering", "plant", "pot", "indoor", "ceramic"],
        },
        {
          key: "decor",
          label: "Home Decor & Lighting",
          filter: [
            "lamp",
            "pillow",
            "throw",
            "led",
            "table",
            "decorative",
            "covers",
          ],
        },
      ],
    },
    books: {
      title: "Books",
      subcategories: [
        { key: "all", label: "All Books", filter: null },
        { key: "fiction", label: "Fiction", filter: ["fiction"] },
        { key: "educational", label: "Educational", filter: ["educational"] },
        { key: "comics", label: "Comics", filter: ["comics"] },
        { key: "biography", label: "Biography", filter: ["biography"] },
      ],
    },
  };

  const currentConfig = useMemo(() => {
    return (
      subcategoryConfig[category] || {
        title: category?.charAt(0).toUpperCase() + category?.slice(1),
        subcategories: [{ key: "all", label: `All ${category}`, filter: null }],
      }
    );
  }, [category]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert URL category to backend category format
        let backendCategory;
        if (category === "home-garden") {
          backendCategory = "Home & Garden";
        } else {
          backendCategory = category.replace("-", " ");
        }

        const data = await productAPI.getProducts({
          category: backendCategory,
        });

        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category]);

  // Filter products based on subcategory
  const filterProductsBySubcategory = (subcategoryKey) => {
    let filtered;
    if (subcategoryKey === "all") {
      filtered = products;
    } else {
      const subcategory = currentConfig.subcategories.find(
        (sub) => sub.key === subcategoryKey
      );
      if (subcategory?.filter) {
        const filterTerms = Array.isArray(subcategory.filter)
          ? subcategory.filter
          : [subcategory.filter];
        filtered = products.filter((product) => {
          const searchText =
            `${product.name} ${product.description}`.toLowerCase();
          return filterTerms.some((term) =>
            searchText.includes(term.toLowerCase())
          );
        });
      } else {
        filtered = products;
      }
    }

    // Apply sorting
    const sorted = sortProducts(filtered, sortBy);
    setFilteredProducts(sorted);
  };

  // Sort products based on selected criteria
  const sortProducts = (products, sortType) => {
    const productsCopy = [...products];

    switch (sortType) {
      case "price-low-high":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return productsCopy.sort(
          (a, b) =>
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
        );
      case "rating":
        return productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "relevance":
      default:
        return productsCopy; // Return original order
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sorted = sortProducts(filteredProducts, newSortBy);
    setFilteredProducts(sorted);
  };

  useEffect(() => {
    // Get subcategory from URL params
    const subcategory = searchParams.get("subcategory") || "all";
    if (subcategory !== activeSubcategory) {
      setActiveSubcategory(subcategory);
    }
  }, [searchParams]);

  // Update filtered products when products or activeSubcategory changes
  useEffect(() => {
    if (products.length > 0) {
      filterProductsBySubcategory(activeSubcategory);
    }
  }, [products, activeSubcategory, sortBy]);

  const handleSubcategoryChange = (subcategoryKey) => {
    setActiveSubcategory(subcategoryKey);

    // Update URL params
    if (subcategoryKey === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ subcategory: subcategoryKey });
    }

    // Immediately filter products for real-time updates
    filterProductsBySubcategory(subcategoryKey);
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

  if (error) {
    return (
      <Container>
        <Message variant="danger">{error}</Message>
      </Container>
    );
  }

  return (
    <Container className="category-page">
      {/* Breadcrumb */}
      <Breadcrumb className="fade-in mb-4">
        <Breadcrumb.Item
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-home me-1"></i>Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{currentConfig.title}</Breadcrumb.Item>
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

      {/* Page Header */}
      <div className="category-header fade-in mb-4">
        <h1 className="display-5 fw-bold text-gradient mb-2">
          <i className="fas fa-th-large me-3"></i>
          {currentConfig.title}
        </h1>
        <p className="lead text-muted">
          Discover amazing products in {currentConfig.title.toLowerCase()}
        </p>
      </div>

      {/* Subcategory Filters */}
      <Card
        className="filter-card fade-in mb-4"
        style={{ animationDelay: "0.1s" }}
      >
        <Card.Body>
          <h5 className="mb-3">
            <i className="fas fa-filter me-2"></i>
            Browse by Category
          </h5>
          <Nav variant="pills" className="flex-wrap">
            {currentConfig.subcategories.map((subcategory, index) => (
              <Nav.Item key={subcategory.key} className="me-2 mb-2">
                <Nav.Link
                  active={activeSubcategory === subcategory.key}
                  onClick={() => handleSubcategoryChange(subcategory.key)}
                  className="filter-pill"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {subcategory.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {/* Products Grid */}
      <div
        className="products-section fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {filteredProducts.length} Product
            {filteredProducts.length !== 1 ? "s" : ""} Found
          </h4>
          <div className="d-flex align-items-center">
            <span className="text-muted me-2">Sort by:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <i className="fas fa-search fa-3x mb-3 text-muted"></i>
            <h4>No products found</h4>
            <p className="mb-3">
              We couldn't find any products in this category. Try browsing other
              categories or check back later.
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
            {filteredProducts.map((product, index) => (
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

      {/* Load More Button (for future pagination) */}
      {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
        <div
          className="text-center mt-5 fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <Button variant="outline-primary" size="lg">
            <i className="fas fa-plus me-2"></i>
            Load More Products
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CategoryPage;
