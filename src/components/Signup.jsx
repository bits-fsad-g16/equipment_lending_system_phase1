import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const { username, email, password, role } = formData;

    // if (password !== confirmPassword) {
    //   alert("Passwords do not match!");
    //   return;
    // }
    // Payload must match FastAPI UserCreate
    const payload = {
      "username": username,
      "email": email,
      "password": password,
      "role": role
    }

    try {
      const res = fetch("http://127.0.0.1:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      

      if (res.status === 201) {
        alert("Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const data = res.json();
        alert(data.detail || "Signup failed!");
      }
    } catch (err) {
      alert("Could not connect to server!");
    }

    console.log("Signup details:", formData);

    alert("Account created successfully!");
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
       <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <Card style={{ width: "26rem" }} className="shadow-lg border-0">
        <Card.Body>
          <h3 className="text-center mb-4">Sign Up</h3>

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="role"
                placeholder="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="primary" type="submit" className="w-50 me-2">
                Sign Up
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleLoginRedirect}
                className="w-50"
              >
                Back to Login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Signup;
