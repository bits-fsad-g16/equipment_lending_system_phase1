import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    
    const userIdString = localStorage.getItem("user_id");
    const userId = userIdString ? parseInt(userIdString) : null;

    console.log(userId)

    fetch(`http://127.0.0.1:8000/user/me?user_id=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        console.log(res)
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(() => alert("Failed to load profile2"));
  }, []);

  const handleGoToEquipmentReq = () => {
    navigate("/equipmentreq");
  };

  const handleGoToLoanDetails = () => {
    navigate("/studentloan");
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Student Dashboard</h2>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4 className="mb-3">Student Profile</h4>
          {profile ? (
            <>
              <p><strong>User:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <h5>Equipment Request Details</h5>
              <p>Borrow or request lab equipment easily.</p>
              <Button variant="primary" onClick={handleGoToEquipmentReq}>
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <h5>Student Loan Details</h5>
              <p>Check the status of borrowed equipment and loans.</p>
              <Button variant="secondary" onClick={handleGoToLoanDetails}>
                View
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDashboard;
