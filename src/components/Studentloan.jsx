import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col } from "react-bootstrap";

function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const userIdString = localStorage.getItem("user_id");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  useEffect(() => {
    if (!userId) {
      alert("User ID not found");
      return;
    }

    fetch(`http://127.0.0.1:8000/request/my_requests/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load requests");
        return res.json();
      })
      .then(setRequests)
      .catch((err) => alert(err.message));
  }, [userId]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">My Loan Requests</h2>

      <Row className="justify-content-center">
        <Col md={10}>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Loan Detail</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.loan_detail || req.equipment_name}</td>
                    <td
                      className={
                        req.status === "Returned" || req.status === "Approved"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {req.status}
                    </td>
                    <td>{/* Optional: Add action buttons here */}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No loan requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDashboard;
