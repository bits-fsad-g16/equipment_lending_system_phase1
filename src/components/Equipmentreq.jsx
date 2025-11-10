import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Equipmentreq() {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [search, setSearch] = useState("");

  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    // Fetch available equipment list (could be all or filtered as per business logic)
    fetch("http://127.0.0.1:8000/equipment/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load equipment list");
        return res.json();
      })
      .then(setEquipments)
      .catch(() => alert("Failed to load equipment list"));

    // Fetch borrowed equipment requests for current user
    fetch(`http://127.0.0.1:8000/request/my_requests/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load borrowed requests");
        return res.json();
      })
      .then(setBorrowed)
      .catch(() => alert("Failed to load borrowed requests"));
  }, [userId]);

  const filteredEquipments = equipments.filter((eq) =>
    eq.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRequest = (itemName) => {
    navigate("/requestfrom", { state: { equipmentName: itemName } });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Equipment Request</h2>

      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Equipment Name</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.length > 0 ? (
                filteredEquipments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRequest(item.name)}
                      >
                        Request
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No equipment found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <h4 className="text-center mb-3">Borrowed Equipments</h4>
      <Row className="justify-content-center">
        <Col md={10}>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-secondary">
              <tr>
                <th>Equipment Name</th>
                <th>Borrowed Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowed.length > 0 ? (
                borrowed.map((item, index) => (
                  <tr key={index}>
                    <td>{item.equipment_name}</td>
                    <td>{item.borrow_date}</td>
                    <td>{item.return_date}</td>
                    <td>
                      <span
                        className={
                          item.status === "Returned"
                            ? "text-success fw-semibold"
                            : "text-danger fw-semibold"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No borrowed equipment yet
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

export default Equipmentreq;
