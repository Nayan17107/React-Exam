import React from 'react';
import { Card, Button, Badge, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
    const user = useSelector(state => state.auth?.user);
    const { reservations = [] } = useSelector(state => state.reservations || {});

    const userReservations = (reservations || []).filter(r => (r.guestEmail && user && r.guestEmail === user.email) || (r.createdBy && user && r.createdBy === user.uid));

    const recent = [...userReservations].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

    return (
        <Container>
            <h1 className="mb-4">My Profile</h1>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 72, height: 72 }}>
                            <span style={{ fontSize: '1.25rem' }}>{(user?.name || 'U')[0]}</span>
                        </div>
                        <div>
                            <div className="fw-bold">{user?.name || 'User'}</div>
                            <div className="text-muted small">{user?.email}</div>
                            <div className="text-muted small">Role: {user?.role || 'user'}</div>
                        </div>
                    </div>
                    <hr />
                    <div className="mt-3">
                        <Button as={Link} to="/reservations" variant="primary">My Bookings</Button>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">My Reservations</h5>
                    <Button as={Link} to="/reservations" variant="link" size="sm">View all</Button>
                </Card.Header>
                <Card.Body>
                    {recent.length === 0 ? (
                        <p className="text-muted">No reservations found for this account.</p>
                    ) : (
                        <div className="list-group list-group-flush">
                            {recent.map(r => (
                                <div key={r.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                    <div>
                                        <div className="fw-semibold">Room {r.roomId}</div>
                                        <div className="small text-muted">{new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-end">
                                        <div>
                                            {r.status === 'pending_payment' && <Badge bg="warning" text="dark" className="me-1">Pending</Badge>}
                                            {r.status === 'confirmed' && <Badge bg="success" className="me-1">Confirmed</Badge>}
                                            {r.status === 'cancelled' && <Badge bg="secondary" className="me-1">Cancelled</Badge>}
                                        </div>
                                        <div className="small text-muted">{r.totalPrice ? `$${r.totalPrice}` : ''}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
