import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, Dropdown, Image } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutAsync } from '../../Services/Actions/AuthActions';
import {
    FaHotel,
    FaCalendarAlt,
    FaBed,
    FaBars,
    FaTimes,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaUserCircle,
    FaCog,
    FaHistory
} from 'react-icons/fa';

const CustomNavbar = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const { reservations } = useSelector(state => state.reservations);

    const activeReservations = reservations?.filter(r => r.status === 'confirmed')?.length || 0;

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/rooms', label: 'Rooms' },
        { path: '/reservations', label: 'Reservations', badge: activeReservations },
    ];

    const authNavItems = isAuthenticated
        ? [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/profile', label: 'Profile' }
        ]
        : [];

    const allNavItems = [...navItems, ...authNavItems];

    const handleLogout = () => {
        dispatch(signOutAsync());
        setExpanded(false);
        navigate('/');
    };

    const handleLogin = () => {
        setExpanded(false);
        navigate('/login');
    };

    const handleRegister = () => {
        setExpanded(false);
        navigate('/register');
    };

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
                {/* Logo/Brand Section */}
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

                {/* Mobile Toggle Button */}
                <Navbar.Toggle
                    aria-controls="navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                    className="border-0"
                    style={{ boxShadow: 'none' }}
                >
                    {expanded ? <FaTimes size={20} /> : <FaBars size={20} />}
                </Navbar.Toggle>

                <Navbar.Collapse id="navbar-nav">
                    {/* Navigation Links */}
                    <Nav className="mx-auto">
                        {allNavItems.map((item) => (
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
                                {item.label === 'Dashboard' && <FaCog className="me-2" />}
                                {item.label === 'Profile' && <FaUserCircle className="me-2" />}
                                {item.label}
                                {item.badge > 0 && (
                                    <Badge pill bg="danger" className="ms-2">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Nav.Link>
                        ))}
                    </Nav>

                    {/* Authentication Section */}
                    <div className="d-flex align-items-center">
                        {/* Book Now Button - Always Visible */}
                        <Button
                            variant="warning"
                            className="fw-bold px-4 me-3"
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

                        {/* User Authentication Area */}
                        {isAuthenticated ? (
                            // Logged In User Dropdown
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="outline-light"
                                    className="d-flex align-items-center border-0 bg-transparent"
                                    id="user-dropdown"
                                >
                                    <div className="d-flex align-items-center">
                                        {user?.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                roundedCircle
                                                width={36}
                                                height={36}
                                                className="me-2 border border-white"
                                            />
                                        ) : (
                                            <div className="bg-primary rounded-circle p-2 me-2">
                                                <FaUser className="text-white" size={16} />
                                            </div>
                                        )}
                                        <div className="text-start d-none d-lg-block">
                                            <div className="text-white fw-medium" style={{ fontSize: '0.9rem' }}>
                                                {user?.name || 'User'}
                                            </div>
                                            <div className="text-light opacity-75" style={{ fontSize: '0.75rem' }}>
                                                {user?.email || ''}
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="shadow-lg border-0">
                                    <Dropdown.Header className="text-dark">
                                        <div className="fw-bold">{user?.name || 'User'}</div>
                                        <small className="text-muted">{user?.email || ''}</small>
                                    </Dropdown.Header>
                                    <Dropdown.Divider />

                                    <Dropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                                        <FaUserCircle className="me-2 text-primary" />
                                        My Profile
                                    </Dropdown.Item>

                                    <Dropdown.Item as={Link} to="/dashboard" onClick={() => setExpanded(false)}>
                                        <FaCog className="me-2 text-secondary" />
                                        Dashboard
                                    </Dropdown.Item>

                                    <Dropdown.Item as={Link} to="/reservations" onClick={() => setExpanded(false)}>
                                        <FaHistory className="me-2 text-info" />
                                        My Bookings
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    <Dropdown.Item
                                        className="text-danger"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="me-2" />
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            // Login/Register Buttons
                            <div className="d-flex">
                                <Button
                                    variant="outline-light"
                                    className="me-2 d-flex align-items-center"
                                    onClick={handleLogin}
                                >
                                    <FaSignInAlt className="me-2" />
                                    <span className="d-none d-md-inline">Login</span>
                                </Button>

                                <Button
                                    variant="light"
                                    className="d-flex align-items-center"
                                    onClick={handleRegister}
                                >
                                    <FaUserPlus className="me-2" />
                                    <span className="d-none d-md-inline">Register</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;