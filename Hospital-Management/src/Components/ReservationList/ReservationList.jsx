import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReservationsAsync, deleteReservationAsync } from '../../Services/Actions/ReservationActions';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import {
    Table,
    Button,
    Badge,
    Spinner,
    Alert,
    Card,
    Row,
    Col,
    Modal,
    Dropdown,
    ProgressBar,
    Container
} from 'react-bootstrap';
import {
    FaCalendarPlus,
    FaCalendarCheck,
    FaCalendarTimes,
    FaCalendarDay,
    FaCalendarAlt,
    FaUser,
    FaBed,
    FaMoneyBillWave,
    FaEllipsisV,
    FaEye,
    FaTimes,
    FaPrint,
    FaFilter,
    FaSortAmountDown
} from 'react-icons/fa';
import { format, differenceInDays, isToday, isFuture, isPast } from 'date-fns';
import { Link } from 'react-router-dom';

const ReservationList = () => {
    const dispatch = useDispatch();
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const { reservations, isLoading, errorMsg } = useSelector(state => state.reservations);
    const { rooms } = useSelector(state => state.rooms);
    const { user } = useSelector(state => state.auth);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        dispatch(getAllReservationsAsync());
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    const filteredReservations = reservations.filter(res => {
        const checkInDate = new Date(res.checkIn);

        switch (activeTab) {
            case 'upcoming':
                return isFuture(checkInDate) || isToday(checkInDate);
            case 'active': {
                const checkOutDate = new Date(res.checkOut);
                return (isPast(checkInDate) || isToday(checkInDate)) &&
                    (isFuture(checkOutDate) || isToday(checkOutDate));
            }
            case 'past':
                return isPast(new Date(res.checkOut));
            case 'cancelled':
                return res.status === 'cancelled';
            default:
                return true;
        }
    });

    const getRoomDetails = (roomId) => {
        return rooms.find(room => room.id === roomId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const getStayDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        return differenceInDays(new Date(checkOut), new Date(checkIn));
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'confirmed': { color: 'success', icon: <FaCalendarCheck className="me-1" /> },
            'cancelled': { color: 'danger', icon: <FaCalendarTimes className="me-1" /> },
            'checked-in': { color: 'primary', icon: <FaCalendarDay className="me-1" /> },
            'checked-out': { color: 'secondary', icon: <FaCalendarAlt className="me-1" /> },
        };

        const config = statusConfig[status] || { color: 'warning', icon: <FaCalendarAlt className="me-1" /> };

        return (
            <Badge bg={config.color} className="px-3 py-2 d-inline-flex align-items-center">
                {config.icon}
                {status.toUpperCase()}
            </Badge>
        );
    };

    const handleCancelClick = (reservation) => {
        setSelectedReservation(reservation);
        setCancelModal(true);
    };

    const confirmCancel = async () => {
        if (selectedReservation) {
            try {
                await dispatch(deleteReservationAsync(selectedReservation.id, selectedReservation.roomId));
                setCancelModal(false);
                setSelectedReservation(null);
            } catch (error) {
                console.error('Cancel error:', error);
            }
        }
    };

    const totalRevenue = reservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0);
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    const todayCheckIns = reservations.filter(r =>
        formatDate(r.checkIn) === formatDate(new Date()) && r.status === 'confirmed'
    ).length;

    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading reservations...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="danger" className="border-0 shadow-sm">
                <Alert.Heading className="d-flex align-items-center">
                    <FaCalendarTimes className="me-2" />
                    Unable to Load Reservations
                </Alert.Heading>
                <p>{errorMsg}</p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                            dispatch(getAllReservationsAsync());
                            dispatch(getAllRoomsAsync());
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <Container className="reservation-list-container">
            {/* Header Section */}
            <h1 className="mb-3 fw-bold display-5 mt-5">Reservation Management</h1>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                    <p className="text-muted mb-0">
                        Manage all hotel bookings and guest reservations
                    </p>
                </div>
                <Button
                    as={Link}
                    to="/reservations/new"
                    variant="primary"
                    size="lg"
                    className="mt-3 mt-md-0 px-4 shadow"
                >
                    <FaCalendarPlus className="me-2" />
                    New Reservation
                </Button>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-4">
                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm h-100 hover-lift">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaCalendarAlt size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="fw-bold mb-1">{reservations.length}</h2>
                                    <p className="text-muted mb-0">Total Reservations</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm h-100 hover-lift">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaCalendarCheck size={24} className="text-success" />
                                </div>
                                <div>
                                    <h2 className="fw-bold mb-1">{confirmedReservations}</h2>
                                    <p className="text-muted mb-0">Confirmed</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm h-100 hover-lift">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaCalendarDay size={24} className="text-warning" />
                                </div>
                                <div>
                                    <h2 className="fw-bold mb-1">{todayCheckIns}</h2>
                                    <p className="text-muted mb-0">Today's Check-ins</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} lg={6} md={6}>
                    <Card className="border-0 shadow-sm h-100 hover-lift">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                    <FaMoneyBillWave size={24} className="text-info" />
                                </div>
                                <div>
                                    <h2 className="fw-bold mb-1">${totalRevenue}</h2>
                                    <p className="text-muted mb-0">Total Revenue</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Tabs Navigation */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-0">
                    <div className="d-flex flex-wrap border-bottom">
                        {['all', 'upcoming', 'active', 'past', 'cancelled'].map((tab) => (
                            <Button
                                key={tab}
                                variant="link"
                                className={`text-decoration-none px-4 py-3 rounded-0 flex-grow-1 ${activeTab === tab
                                    ? 'text-primary border-bottom-2 border-primary fw-bold'
                                    : 'text-muted'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <Badge bg="light" text="dark" className="ms-2">
                                    {tab === 'all' ? reservations.length :
                                        tab === 'upcoming' ? reservations.filter(r => isFuture(new Date(r.checkIn)) || isToday(new Date(r.checkIn))).length :
                                            tab === 'active' ? reservations.filter(r => {
                                                const checkIn = new Date(r.checkIn);
                                                const checkOut = new Date(r.checkOut);
                                                return (isPast(checkIn) || isToday(checkIn)) && (isFuture(checkOut) || isToday(checkOut));
                                            }).length :
                                                tab === 'past' ? reservations.filter(r => isPast(new Date(r.checkOut))).length :
                                                    reservations.filter(r => r.status === 'cancelled').length}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Table Section */}
            {filteredReservations.length === 0 ? (
                <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                        <div className="display-1 text-muted mb-4">📅</div>
                        <h3 className="fw-bold mb-3">No Reservations Found</h3>
                        <p className="text-muted mb-4">
                            {activeTab === 'all'
                                ? "Start by creating your first reservation."
                                : `No ${activeTab} reservations found.`}
                        </p>
                        <Button
                            as={Link}
                            to="/reservations/new"
                            variant="primary"
                            size="lg"
                            className="px-5"
                        >
                            <FaCalendarPlus className="me-2" />
                            Create Reservation
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {/* Table Controls */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <small className="text-muted">
                                Showing <strong>{filteredReservations.length}</strong> reservation{filteredReservations.length !== 1 ? 's' : ''}
                            </small>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary" size="sm" disabled>
                                <FaFilter className="me-1" />
                                Filter
                            </Button>
                            <Button variant="outline-secondary" size="sm" disabled>
                                <FaSortAmountDown className="me-1" />
                                Sort
                            </Button>
                            <Button variant="outline-secondary" size="sm" disabled>
                                <FaPrint className="me-1" />
                                Print
                            </Button>
                        </div>
                    </div>

                    {/* Reservations Table */}
                    <div className="table-responsive rounded shadow-sm">
                        <Table hover className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th className="py-3">GUEST</th>
                                    <th className="py-3">ROOM</th>
                                    <th className="py-3">DATES</th>
                                    <th className="py-3">DURATION</th>
                                    <th className="py-3">AMOUNT</th>
                                    <th className="py-3">STATUS</th>
                                    <th className="py-3 text-end">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.map((res) => {
                                    const room = getRoomDetails(res.roomId);
                                    const duration = getStayDuration(res.checkIn, res.checkOut);

                                    return (
                                        <tr key={res.id} className="align-middle">
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                                        <FaUser className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{res.guestName}</div>
                                                        <small className="text-muted">{isAdmin ? res.guestEmail : (res.guestEmail ? res.guestEmail.replace(/(.{3}).+(@.+)/, '$1***$2') : '')}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {room ? (
                                                    <div>
                                                        <div className="fw-bold">Room {room.roomNumber}</div>
                                                        <Badge bg="light" text="dark" className="small">
                                                            <FaBed className="me-1" />
                                                            {room.type}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <Badge bg="danger">Room Deleted</Badge>
                                                )}
                                            </td>
                                            <td>
                                                <div className="small">
                                                    <div className="fw-bold">Check-in</div>
                                                    <div>{formatDate(res.checkIn)}</div>
                                                    <div className="fw-bold mt-2">Check-out</div>
                                                    <div>{formatDate(res.checkOut)}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <div className="display-6 fw-bold text-primary">{duration}</div>
                                                    <small className="text-muted">night{duration !== 1 ? 's' : ''}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-success">
                                                    ${res.totalPrice || '0'}
                                                </div>
                                                <ProgressBar
                                                    now={res.status === 'confirmed' ? 100 :
                                                        res.status === 'checked-in' ? 50 :
                                                            res.status === 'checked-out' ? 100 : 0}
                                                    variant={
                                                        res.status === 'confirmed' ? 'success' :
                                                            res.status === 'checked-in' ? 'primary' :
                                                                res.status === 'checked-out' ? 'secondary' : 'danger'
                                                    }
                                                    className="mt-2"
                                                    style={{ height: '4px' }}
                                                />
                                            </td>
                                            <td>{getStatusBadge(res.status)}</td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        size="sm"
                                                        className="border-0"
                                                    >
                                                        <FaEllipsisV />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item as={Link} to={`/reservations/${res.id}`}>
                                                            <FaEye className="me-2" />
                                                            View Details
                                                        </Dropdown.Item>
                                                        {res.status === 'confirmed' && (
                                                            <>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item
                                                                    onClick={() => handleCancelClick(res)}
                                                                    className="text-danger"
                                                                >
                                                                    <FaTimes className="me-2" />
                                                                    Cancel Reservation
                                                                </Dropdown.Item>
                                                            </>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>

                    {/* Summary Footer */}
                    <Card className="border-0 bg-light mt-4">
                        <Card.Body className="p-3">
                            <Row className="text-center">
                                <Col md={3} className="border-end">
                                    <small className="text-muted d-block">TOTAL REVENUE</small>
                                    <strong className="text-success">
                                        ${totalRevenue}
                                    </strong>
                                </Col>
                                <Col md={3} className="border-end">
                                    <small className="text-muted d-block">AVG STAY</small>
                                    <strong className="text-primary">
                                        {filteredReservations.length > 0
                                            ? (filteredReservations.reduce((sum, res) => sum + getStayDuration(res.checkIn, res.checkOut), 0) / filteredReservations.length).toFixed(1)
                                            : '0'} nights
                                    </strong>
                                </Col>
                                <Col md={3} className="border-end">
                                    <small className="text-muted d-block">CONFIRMATION RATE</small>
                                    <strong className={confirmedReservations / reservations.length > 0.7 ? 'text-success' : 'text-warning'}>
                                        {reservations.length > 0 ? ((confirmedReservations / reservations.length) * 100).toFixed(1) : '0'}%
                                    </strong>
                                </Col>
                                <Col md={3}>
                                    <small className="text-muted d-block">AVG AMOUNT</small>
                                    <strong className="text-info">
                                        ${filteredReservations.length > 0
                                            ? (filteredReservations.reduce((sum, res) => sum + (res.totalPrice || 0), 0) / filteredReservations.length).toFixed(2)
                                            : '0'}
                                    </strong>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Cancel Confirmation Modal */}
            <Modal show={cancelModal} onHide={() => setCancelModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">
                        <FaCalendarTimes className="me-2 text-danger" />
                        Cancel Reservation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <div>
                            <Alert variant="warning" className="border-0">
                                <Alert.Heading>⚠️ Are you sure?</Alert.Heading>
                                <p>
                                    This action cannot be undone. The room will become available for new bookings.
                                </p>
                            </Alert>

                            <div className="bg-light p-3 rounded mb-3">
                                <h6 className="fw-bold mb-3">Reservation Details</h6>
                                <Row>
                                    <Col md={6}>
                                        <small className="text-muted d-block">Guest Name</small>
                                        <strong>{selectedReservation.guestName}</strong>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted d-block">Room</small>
                                        <strong>
                                            {getRoomDetails(selectedReservation.roomId)?.roomNumber || 'N/A'}
                                        </strong>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col md={6}>
                                        <small className="text-muted d-block">Check-in</small>
                                        <strong>{formatDate(selectedReservation.checkIn)}</strong>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted d-block">Check-out</small>
                                        <strong>{formatDate(selectedReservation.checkOut)}</strong>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col md={12}>
                                        <small className="text-muted d-block">Total Amount</small>
                                        <strong className="text-success h5">
                                            ${selectedReservation.totalPrice || '0'}
                                        </strong>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setCancelModal(false)}>
                        Keep Reservation
                    </Button>
                    <Button variant="danger" onClick={confirmCancel}>
                        Confirm Cancellation
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReservationList;