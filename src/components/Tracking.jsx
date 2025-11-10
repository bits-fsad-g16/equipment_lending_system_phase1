import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";

function Tracking() {
  const [requests, setRequests] = useState([]);
  const userIdString = localStorage.getItem("user_id");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  useEffect(() => {
    if (!userId) {
      alert("User ID not found");
      return;
    }

    const fetchRequests = () => {
      fetch(`http://127.0.0.1:8000/request/track`, {
      method: "GET"})
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load requests");
          return res.json();
        })
        .then(setRequests)
        .catch(() => alert("Failed to load requests"));
    };

    fetchRequests();
  }, [userId]);

  const handleReturn = (id) => {
    fetch(`http://127.0.0.1:8000/request/${id}/return`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to mark returned");
        // Re-fetch after successful return
        return fetch(`http://127.0.0.1:8000/request/track`);
      })
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => alert("Failed to mark returned"));
  };

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4">Equipment Tracking</h3>

      {requests.length === 0 ? (
        <p className="text-center text-muted">No equipment requests found.</p>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Equipment Name</th>
              <th>Borrowed Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.requestedBy?.username || req.requestedBy || "Unknown"}</td>
                <td>{req.equipmentName}</td>
                <td>{req.borrowDate}</td>
                <td>{req.returnDate}</td>
                <td>
                  <Badge
                    bg={
                      req.status === "Approved"
                        ? "success"
                        : req.status === "Returned"
                        ? "secondary"
                        : req.status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {req.status}
                  </Badge>
                </td>
                <td className="text-center">
                  {req.status === "Approved" ? (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleReturn(req.id)}
                    >
                      Mark Returned
                    </Button>
                  ) : req.status === "Returned" ? (
                    <span className="text-muted">Returned</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Tracking;
