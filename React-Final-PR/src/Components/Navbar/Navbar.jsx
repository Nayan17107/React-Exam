import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHotel, FaCalendarAlt, FaBed, FaBars, FaTimes } from 'react-icons/fa';

const CustomNavbar = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { reservations } = useSelector(state => state.reservations);
    const activeReservations = reservations?.filter(r => r.status === 'confirmed')?.length || 0;

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/rooms', label: 'Rooms' },
        { path: '/reservations', label: 'Reservations', badge: activeReservations },
    ];

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            expanded={expanded}
            fixed="top"
            className="shadow-lg"
            style={{
                background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                padding: '0.5rem 0'
            }}
        >
            <Container fluid="xxl">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <div className="bg-white rounded p-2 me-2">
                        <FaHotel size={24} className="text-primary" />
                    </div>
                    <div>
                        <span className="fs-4 fw-bold text-white">LuxuryStay</span>
                        <small className="d-block text-light opacity-75" style={{ fontSize: '0.75rem' }}>
                            Hotel Management
                        </small>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                    className="border-0"
                    style={{ boxShadow: 'none' }}
                >
                    {expanded ? <FaTimes size={20} /> : <FaBars size={20} />}
                </Navbar.Toggle>

                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto">
                        {navItems.map((item) => (
                            <Nav.Link
                                key={item.path}
                                as={Link}
                                to={item.path}
                                className={`mx-2 px-3 py-2 rounded ${location.pathname === item.path ? 'bg-white bg-opacity-10 active' : ''
                                    }`}
                                onClick={() => setExpanded(false)}
                                style={{
                                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.9)',
                                    fontWeight: 500,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {item.label === 'Rooms' && <FaBed className="me-2" />}
                                {item.label === 'Reservations' && <FaCalendarAlt className="me-2" />}
                                {item.label}
                                {item.badge > 0 && (
                                    <Badge pill bg="danger" className="ms-2">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <Button
                        variant="warning"
                        className="fw-bold px-4"
                        onClick={() => {
                            setExpanded(false);
                            navigate('/reservations/new');
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #ff9800, #ff5722)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
                        }}
                    >
                        <FaCalendarAlt className="me-2" />
                        Book Now
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;