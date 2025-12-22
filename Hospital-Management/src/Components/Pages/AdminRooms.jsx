import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Badge, Form, Row, Col, InputGroup, Pagination, Spinner, Card, Container } from 'react-bootstrap';
import { deleteRoomAsync, getAllRoomsAsync } from '../../Services/Actions/RoomActions';

const AdminRooms = () => {
    const dispatch = useDispatch();
    const { rooms = [], isLoading } = useSelector(state => state.rooms);

    const [search, setSearch] = useState('');
    const [availability, setAvailability] = useState('all'); // all / available / booked
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    // Filtered & searched list
    const filtered = useMemo(() => {
        let list = rooms.slice();
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(r => (
                String(r.roomNumber).toLowerCase().includes(q) ||
                (r.type || '').toLowerCase().includes(q)
            ));
        }
        if (availability === 'available') list = list.filter(r => r.isAvailable);
        if (availability === 'booked') list = list.filter(r => !r.isAvailable);
        return list;
    }, [rooms, search, availability]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room?')) return;
        try {
            await dispatch(deleteRoomAsync(id));
        } catch (err) {
            console.error('Delete room failed', err);
        }
    };

    const formatPrice = (p) => typeof p === 'number' ? p.toFixed(2) : p;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row mt-5">
                <div className="mb-2 mb-md-0">
                    <h2 className="fw-bold mb-0">Manage Rooms</h2>
                    <small className="text-muted">{total} room(s)</small>
                </div>

                <div className="d-flex gap-2">
                    <Button as={Link} to="/rooms/add" variant="primary">＋ Add Room</Button>
                </div>
            </div>

            <Row className="align-items-center mb-3">
                <Col xs={12} md={6} lg={5} className="mb-2">
                    <InputGroup>
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control placeholder="Room number or type" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    </InputGroup>
                </Col>

                <Col xs={6} md={3} lg={2} className="mb-2">
                    <Form.Select aria-label="Availability" value={availability} onChange={e => { setAvailability(e.target.value); setPage(1); }}>
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                    </Form.Select>
                </Col>

                <Col xs={6} md={3} lg={2} className="mb-2">
                    <Form.Select aria-label="Page size" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                        <option value={5}>5 / page</option>
                        <option value={8}>8 / page</option>
                        <option value={12}>12 / page</option>
                    </Form.Select>
                </Col>
            </Row>

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
                </div>
            ) : (
                <>
                    {/* Desktop / large: table view */}
                    <div className="d-none d-md-block">
                        <Table striped hover responsive className="bg-white shadow-sm rounded">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Number</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((r, idx) => (
                                    <tr key={r.id}>
                                        <td>{(page - 1) * pageSize + idx + 1}</td>
                                        <td>{r.roomNumber}</td>
                                        <td>{r.type}</td>
                                        <td>${formatPrice(r.price)}</td>
                                        <td>{r.isAvailable ? <Badge bg="success">Available</Badge> : <Badge bg="danger">Booked</Badge>}</td>
                                        <td className="text-end">
                                            <Button as={Link} to={`/rooms/edit/${r.id}`} variant="outline-secondary" size="sm" className="me-2">✏️ Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>🗑️ Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                                {paged.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">No rooms found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Mobile: card list */}
                    <div className="d-md-none">
                        {paged.map(r => (
                            <Card className="mb-3" key={r.id}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">Room {r.roomNumber}</h5>
                                            <div className="small text-muted">{r.type}</div>
                                            <div className="mt-2"><strong>${formatPrice(r.price)}</strong></div>
                                        </div>
                                        <div className="text-end">
                                            <div className="mb-2">{r.isAvailable ? <Badge bg="success">Available</Badge> : <Badge bg="danger">Booked</Badge>}</div>
                                            <div>
                                                <Button as={Link} to={`/rooms/edit/${r.id}`} variant="outline-secondary" size="sm" className="me-2">Edit</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                        {paged.length === 0 && (
                            <div className="text-center text-muted py-4">No rooms found</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted">Showing {(total === 0) ? 0 : Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} of {total}</div>
                        <Pagination className="mb-0">
                            <Pagination.Prev disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <Pagination.Item key={i} active={page === pageNum} onClick={() => setPage(pageNum)}>{pageNum}</Pagination.Item>
                                );
                            })}
                            <Pagination.Next disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
};

export default AdminRooms;
