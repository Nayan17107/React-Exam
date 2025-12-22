import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Badge, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import { getAllReservationsAsync } from '../../Services/Actions/ReservationActions';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../Config/firebase.config';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { rooms } = useSelector(state => state.rooms);
    const { reservations } = useSelector(state => state.reservations);
    const authUser = useSelector(state => state.auth?.user);
    const [usersCount, setUsersCount] = useState(0);
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        dispatch(getAllRoomsAsync());
        dispatch(getAllReservationsAsync());

        const fetchUsers = async () => {
            const snap = await getDocs(collection(db, 'users'));
            setUsersCount(snap.size);

            const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
            // sort by updatedAt (if present) or createdAt
            users.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
            setRecentUsers(users.slice(0, 6));
        };

        fetchUsers();
    }, [dispatch]);

    const recentReservations = [...(reservations || [])].sort((a,b) => (new Date(b.createdAt) - new Date(a.createdAt))).slice(0,5);

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold display-5 mt-5">Admin Dashboard</h1>
                    <p className="text-muted">Overview of hotel operations</p>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/admin/rooms" variant="outline-primary">Manage Rooms</Button>
                    <Button as={Link} to="/admin/reservations" variant="outline-success">Manage Reservations</Button>
                    <Button as={Link} to="/admin/users" variant="outline-secondary">Manage Users</Button>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex align-items-start gap-3">
                                <div>
                                    <h3 className="fw-bold mb-0">{rooms?.length || 0}</h3>
                                    <div className="text-muted small">Total Rooms</div>
                                </div>
                                <div className="ms-auto">
                                    <div className="bg-light rounded p-2 text-center" style={{ minWidth: 60 }}>
                                        🛏️
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex align-items-start gap-3">
                                <div>
                                    <h3 className="fw-bold mb-0">{reservations?.length || 0}</h3>
                                    <div className="text-muted small">Total Reservations</div>
                                </div>
                                <div className="ms-auto">
                                    <div className="bg-light rounded p-2 text-center" style={{ minWidth: 60 }}>
                                        📋
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={4} lg={3}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex align-items-start gap-3">
                                <div>
                                    <h3 className="fw-bold mb-0">{usersCount}</h3>
                                    <div className="text-muted small">Registered Users</div>
                                </div>
                                <div className="ms-auto">
                                    <div className="bg-light rounded p-2 text-center" style={{ minWidth: 60 }}>
                                        👥
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} md={12} lg={3}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex align-items-start gap-3">
                                <div>
                                    <h3 className="fw-bold mb-0">{(reservations || []).filter(r => r.status === 'pending_payment').length}</h3>
                                    <div className="text-muted small">Pending Payments</div>
                                </div>
                                <div className="ms-auto">
                                    <div className="bg-light rounded p-2 text-center" style={{ minWidth: 60 }}>
                                        💳
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Admin profile & recent users */}
                <Col xs={12} lg={4} className="order-lg-last">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <h6 className="mb-0">Admin Profile</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                                    <span style={{ fontSize: '1.25rem' }}>A</span>
                                </div>
                                <div>
                                    <div className="fw-semibold">{authUser?.name || 'Admin'}</div>
                                    <div className="small text-muted">{authUser?.email}</div>
                                    <div className="small text-muted">Role: {authUser?.role}</div>
                                </div>
                            </div>

                            <hr />

                            <h6 className="mb-2">Recent users</h6>
                            {recentUsers.length === 0 ? (
                                <div className="text-muted small">No users found</div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {recentUsers.map(u => (
                                        <div key={u.uid} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                            <div>
                                                <div className="fw-semibold">{u.name || u.email}</div>
                                                <div className="small text-muted">{u.email}</div>
                                            </div>
                                            <div className="small text-muted">{u.role || 'user'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Recent Reservations</h5>
                    <div>
                        <Button as={Link} to="/admin/reservations" variant="link" size="sm">View all</Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {recentReservations.length === 0 ? (
                        <p className="text-muted mb-0">No recent reservations</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Guest</th>
                                        <th>Room</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReservations.map(r => (
                                        <tr key={r.id}>
                                            <td>
                                                <div className="fw-semibold">{r.guestName}</div>
                                                <div className="small text-muted">{r.guestEmail || r.createdBy}</div>
                                            </td>
                                            <td>Room {r.roomId}</td>
                                            <td>
                                                <div className="small text-muted">{new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                {r.status === 'pending_payment' && <Badge bg="warning" text="dark">Pending</Badge>}
                                                {r.status === 'confirmed' && <Badge bg="success">Confirmed</Badge>}
                                                {r.status === 'cancelled' && <Badge bg="secondary">Cancelled</Badge>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
