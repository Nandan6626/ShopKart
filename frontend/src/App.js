import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import './styles/custom.css';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 py-3">
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/order/:id" 
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminProducts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminOrders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminUsers />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/categories" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminCategories />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Container>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
