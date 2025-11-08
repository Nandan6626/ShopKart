import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error, register, clearErrors } =
    useContext(UserContext);

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    // Clear errors when component mounts
    clearErrors();
  }, [clearErrors]); // Include clearErrors in dependency array

  // Password validation function
  const validatePassword = (pwd) => {
    const validation = {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setMessage("Password does not meet requirements");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage(null);
    register(name, email, password, role);
  };

  return (
    <div className="signup-card">
      <h1 className="card-title">Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <div className="signup-form">
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            ></Form.Control>

            {/* Password Requirements */}
            <div className="password-requirements">
              <small className="text-muted mb-2 d-block">
                Password must contain:
              </small>
              <div
                className={`requirement-item ${
                  passwordValidation.length ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {passwordValidation.length ? "✓" : "✗"}
                </span>
                At least 6 characters
              </div>
              <div
                className={`requirement-item ${
                  passwordValidation.uppercase ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {passwordValidation.uppercase ? "✓" : "✗"}
                </span>
                One uppercase letter (A-Z)
              </div>
              <div
                className={`requirement-item ${
                  passwordValidation.lowercase ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {passwordValidation.lowercase ? "✓" : "✗"}
                </span>
                One lowercase letter (a-z)
              </div>
              <div
                className={`requirement-item ${
                  passwordValidation.number ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {passwordValidation.number ? "✓" : "✗"}
                </span>
                One number (0-9)
              </div>
              <div
                className={`requirement-item ${
                  passwordValidation.special ? "valid" : "invalid"
                }`}
              >
                <span className="requirement-icon">
                  {passwordValidation.special ? "✓" : "✗"}
                </span>
                One special character (!@#$%^&*)
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" className="signup-submit-btn">
            Register
          </Button>
        </Form>

        <div className="signup-link">
          <p>
            Have an Account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
