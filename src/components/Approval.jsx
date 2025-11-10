import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";

function Approval() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    fetch("http://127.0.0.1:8000/request/pending") // plural 'requests' for consistency
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load requests");
        return res.json();
      })
      .then(setRequests)
      .catch(() => alert("Failed to load requests"));
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (id, action) => {
    const endpoint = 
      action === "Approved"
        ? `http://127.0.0.1:8000/request/${id}/approve`
        : `http://127.0.0.1:8000/request/${id}/reject`;

    fetch(endpoint, { method: "PUT" })
      .then((res) => {
        if (!res.ok) throw new Error(`${action} failed`);
        fetchRequests();
      })
      .catch(() => alert(`${action} failed`));
  };

  return (
    <Container className="py-5">
      <h3 className="text-center mb-4">Pending Equipment Requests</h3>

      {requests.length === 0 ? (
        <p className="text-center">No pending requests found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Equipment Name</th>
              <th>Requested By</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.equipmentName}</td>
                <td>{req.requestedBy}</td>
                <td>{req.borrowDate}</td>
                <td>{req.returnDate}</td>
                <td>{req.status}</td>
                <td className="text-center">
                  {req.status === "Pending" ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction(req.id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(req.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <strong
                      className={
                        req.status === "Approved"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {req.status}
                    </strong>
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

export default Approval;
