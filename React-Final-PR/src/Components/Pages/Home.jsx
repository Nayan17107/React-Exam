import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container>
            <h1 className="text-center mb-4">Welcome to Hotel Management System</h1>
            <Row className="g-4">
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>🏨 Room Management</Card.Title>
                            <Card.Text>
                                View, add, edit, and delete rooms. Manage room availability and details.
                            </Card.Text>
                            <Button as={Link} to="/rooms" variant="primary">
                                Manage Rooms
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>📅 Reservations</Card.Title>
                            <Card.Text>
                                Create, view, update, and cancel reservations. Check room availability.
                            </Card.Text>
                            <Button as={Link} to="/reservations" variant="success">
                                Manage Reservations
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>📊 Dashboard</Card.Title>
                            <Card.Text>
                                View analytics, reports, and hotel performance metrics.
                            </Card.Text>
                            <Button variant="info" disabled>
                                Coming Soon
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;