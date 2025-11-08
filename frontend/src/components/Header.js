import React, { useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const logoutHandler = () => {
    logout();
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header>
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        collapseOnSelect
        className="navbar-custom"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-logo">ShopKart</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Search Bar */}
            <Form
              className="d-flex mx-auto search-form"
              onSubmit={searchHandler}
            >
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <Button variant="outline-light" type="submit">
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Form>

            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="cart-link">
                  <i className="fas fa-shopping-cart"></i> Cart
                  {cartItemsCount > 0 && (
                    <span className="badge bg-success ms-1 cart-badge">
                      {cartItemsCount}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
              {user ? (
                <NavDropdown
                  title={user.name}
                  id="username"
                  className="user-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <i className="fas fa-user me-2"></i>Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <NavDropdown.Item>
                      <i className="fas fa-list me-2"></i>My Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {user && user.role === "admin" && (
                <NavDropdown
                  title="Admin"
                  id="adminmenu"
                  className="admin-dropdown"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>
                      <i className="fas fa-box me-2"></i>Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>
                      <i className="fas fa-shopping-bag me-2"></i>Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
