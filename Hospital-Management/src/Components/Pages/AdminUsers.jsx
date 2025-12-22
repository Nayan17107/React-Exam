import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Badge, Row, Col, Form, Card, Pagination, Spinner, Container } from 'react-bootstrap';
import { getDocs, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../Config/firebase.config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        setLoading(false);
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await fetchUsers();
        })();
        return () => { mounted = false; };
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.trim().toLowerCase();
        return users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    }, [users, search]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const paged = useMemo(() => filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [filtered, page, pageSize]);

    const makeAdmin = async (u) => {
        if (!window.confirm(`Make ${u.name || u.email} an admin?`)) return;
        await setDoc(doc(db, 'users', u.uid), { ...u, role: 'admin' });
        fetchUsers();
    };

    const removeUser = async (u) => {
        if (!window.confirm('Remove user from users collection? This does NOT delete the auth account.')) return;
        await deleteDoc(doc(db, 'users', u.uid));
        fetchUsers();
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row mt-5">
                <div>
                    <h2 className="fw-bold mb-0">Manage Users</h2>
                    <small className="text-muted">{total} user(s)</small>
                </div>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                    <Button variant="outline-secondary" size="sm" onClick={fetchUsers}>Refresh</Button>
                </div>
            </div>

            <Row className="align-items-center mb-3">
                <Col xs={12} md={6} lg={5} className="mb-2">
                    <Form.Control placeholder="Search name or email" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </Col>

                <Col xs={6} md={3} lg={2} className="mb-2">
                    <Form.Select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
                        <option value={5}>5 / page</option>
                        <option value={8}>8 / page</option>
                        <option value={12}>12 / page</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <div className="d-none d-md-block">
                        <Table hover responsive className="bg-white shadow-sm rounded">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map(u => (
                                    <tr key={u.uid}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role || 'user'}</td>
                                        <td className="text-end">
                                            {u.role !== 'admin' && <Button variant="outline-primary" size="sm" className="me-2" onClick={() => makeAdmin(u)}>Make Admin</Button>}
                                            <Button variant="outline-danger" size="sm" onClick={() => removeUser(u)}>Remove</Button>
                                        </td>
                                    </tr>
                                ))}
                                {paged.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted py-4">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-md-none">
                        {paged.map(u => (
                            <Card key={u.uid} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">{u.name}</h5>
                                            <div className="small text-muted">{u.email}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="mb-2"><small className="text-muted">{u.role || 'user'}</small></div>
                                            <div>
                                                {u.role !== 'admin' && <Button variant="outline-primary" size="sm" className="me-2" onClick={() => makeAdmin(u)}>Make Admin</Button>}
                                                <Button variant="outline-danger" size="sm" onClick={() => removeUser(u)}>Remove</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                        {paged.length === 0 && (<div className="text-center text-muted py-4">No users found</div>)}
                    </div>

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

export default AdminUsers;
