import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Form, Row, Col, InputGroup, Pagination, Spinner, Card, Container } from 'react-bootstrap';
import { getAllReservationsAsync, updateReservationAsync, deleteReservationAsync } from '../../Services/Actions/ReservationActions';

const AdminReservations = () => {
    const dispatch = useDispatch();
    const { reservations = [], isLoading } = useSelector(state => state.reservations);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        dispatch(getAllReservationsAsync());
    }, [dispatch]);

    const filtered = useMemo(() => {
        let list = reservations.slice();
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(r => (r.guestName || '').toLowerCase().includes(q) || (r.guestEmail || '').toLowerCase().includes(q) || String(r.roomId).toLowerCase().includes(q));
        }
        if (status !== 'all') list = list.filter(r => r.status === status);
        return list;
    }, [reservations, search, status]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));



    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAllOnPage = () => {
        setSelected(prev => {
            const next = new Set(prev);
            paged.forEach(r => next.add(r.id));
            return next;
        });
    };

    const clearSelection = () => setSelected(new Set());

    const bulkChangeStatus = async (newStatus) => {
        if (selected.size === 0) return;
        if (!window.confirm(`Change status of ${selected.size} reservation(s) to ${newStatus}?`)) return;
        try {
            for (const id of selected) {
                await dispatch(updateReservationAsync(id, { status: newStatus }));
            }
            clearSelection();
            dispatch(getAllReservationsAsync());
        } catch (err) {
            console.error('Bulk status change failed', err);
        }
    };

    const bulkDelete = async () => {
        if (selected.size === 0) return;
        if (!window.confirm(`Delete ${selected.size} reservation(s)? This cannot be undone.`)) return;
        try {
            for (const id of selected) {
                const res = reservations.find(r => r.id === id);
                await dispatch(deleteReservationAsync(id, res?.roomId));
            }
            clearSelection();
            dispatch(getAllReservationsAsync());
        } catch (err) {
            console.error('Bulk delete failed', err);
        }
    };

    const changeStatus = async (id, newStatus) => {
        try {
            await dispatch(updateReservationAsync(id, { status: newStatus }));
            dispatch(getAllReservationsAsync());
        } catch (err) {
            console.error('Status change failed', err);
        }
    };

    const handleDelete = async (res) => {
        if (!window.confirm('Delete reservation?')) return;
        try {
            await dispatch(deleteReservationAsync(res.id, res.roomId));
            dispatch(getAllReservationsAsync());
        } catch (err) {
            console.error('Delete reservation failed', err);
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row mt-5">
                <div>
                    <h2 className="fw-bold mb-0">Manage Reservations</h2>
                    <small className="text-muted">{total} reservation(s)</small>
                </div>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                    <Button variant="outline-secondary" size="sm" onClick={() => dispatch(getAllReservationsAsync())}>Refresh</Button>
                </div>
            </div>

            <Row className="align-items-center mb-3">
                <Col xs={12} md={6} lg={5} className="mb-2">
                    <InputGroup>
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control placeholder="Guest name, email or room" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    </InputGroup>
                </Col>

                <Col xs={6} md={3} lg={2} className="mb-2">
                    <Form.Select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                        <option value="all">All</option>
                        <option value="pending_payment">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </Col>

                <Col xs={6} md={3} lg={2} className="mb-2">
                    <Form.Select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                        <option value={5}>5 / page</option>
                        <option value={8}>8 / page</option>
                        <option value={12}>12 / page</option>
                    </Form.Select>
                </Col>
            </Row>

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <Button size="sm" variant="outline-primary" className="me-2" onClick={selectAllOnPage}>Select page</Button>
                            <Button size="sm" variant="outline-secondary" className="me-2" onClick={clearSelection}>Clear</Button>
                            <Button size="sm" variant="success" className="me-2" onClick={() => bulkChangeStatus('confirmed')}>Confirm Selected</Button>
                            <Button size="sm" variant="danger" onClick={bulkDelete}>Delete Selected</Button>
                        </div>
                        <div className="text-muted">Showing {total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} of {total}</div>
                    </div>

                    {/* Desktop table */}
                    <div className="d-none d-md-block">
                        <Table hover responsive className="bg-white shadow-sm rounded">
                            <thead>
                                <tr>
                                    <th><Form.Check checked={paged.every(r => selected.has(r.id)) && paged.length>0} onChange={(e) => e.target.checked ? selectAllOnPage() : clearSelection()} /></th>
                                    <th>Guest</th>
                                    <th>Room</th>
                                    <th>Dates</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map(r => (
                                    <tr key={r.id}>
                                        <td><Form.Check checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                                        <td>
                                            <div className="fw-semibold">{r.guestName}</div>
                                            <div className="small text-muted">{r.guestEmail || r.createdBy}</div>
                                        </td>
                                        <td>Room {r.roomId}</td>
                                        <td>{new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</td>
                                        <td>${r.totalPrice || 0}</td>
                                        <td>
                                            {r.status === 'pending_payment' && <Badge bg="warning" text="dark">Pending</Badge>}
                                            {r.status === 'confirmed' && <Badge bg="success">Confirmed</Badge>}
                                            {r.status === 'cancelled' && <Badge bg="secondary">Cancelled</Badge>}
                                        </td>
                                        <td className="text-end text-center">
                                            {r.status !== 'confirmed' && <Button size="sm" variant="success" className="me-2 mb-2" onClick={() => changeStatus(r.id, 'confirmed')}>Confirm</Button>}
                                            {r.status !== 'cancelled' && <Button size="sm" variant="danger" className="me-2 mb-2" onClick={() => changeStatus(r.id, 'cancelled')}>Cancel</Button>}
                                            <Button className='mb-2' size="sm" variant="outline-danger" onClick={() => handleDelete(r)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                                {paged.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">No reservations found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Mobile cards */}
                    <div className="d-md-none">
                        {paged.map(r => (
                            <Card key={r.id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">{r.guestName}</h5>
                                            <div className="small text-muted">Room {r.roomId} • {new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</div>
                                            <div className="mt-2"><strong>${r.totalPrice || 0}</strong></div>
                                        </div>
                                        <div className="text-end">
                                            <div className="mb-2">{r.status === 'confirmed' ? <Badge bg="success">Confirmed</Badge> : r.status === 'pending_payment' ? <Badge bg="warning" text="dark">Pending</Badge> : <Badge bg="secondary">{r.status}</Badge>}</div>
                                            <div>
                                                <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => changeStatus(r.id, 'confirmed')}>Confirm</Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r)}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                        {paged.length === 0 && (<div className="text-center text-muted py-4">No reservations found</div>)}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.Prev disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
                                <Pagination.Item key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
                            ))}
                            <Pagination.Next disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
};

export default AdminReservations;
