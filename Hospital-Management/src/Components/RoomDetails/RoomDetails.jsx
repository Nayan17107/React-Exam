import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Badge,
    Row,
    Col,
    Alert,
    Spinner,
    ListGroup,
    ProgressBar,
    Tabs,
    Tab,
    Carousel,
    Modal,
    Container
} from 'react-bootstrap';
import {
    FaBed,
    FaUsers,
    FaWifi,
    FaTv,
    FaCoffee,
    FaCar,
    FaSnowflake,
    FaShower,
    FaEdit,
    FaTrash,
    FaCalendarPlus,
    FaArrowLeft,
    FaStar,
    FaHotel,
    FaRulerCombined,
    FaDoorOpen,
    FaThermometerHalf,
    FaBath,
    FaCouch,
    FaUtensils,
    FaSwimmingPool,
    FaDumbbell,
    FaShareAlt,
    FaPrint,
    FaHeart
} from 'react-icons/fa';
import { getRoomAsync, deleteRoomAsync } from '../../Services/Actions/RoomActions';
import './RoomDetails.css';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { room, isLoading, errorMsg } = useSelector(state => state.rooms);
    const { user } = useSelector(state => state.auth);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('details');

    useEffect(() => {
        if (id) {
            dispatch(getRoomAsync(id));
        }
    }, [dispatch, id]);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteRoomAsync(id));
            setShowDeleteModal(false);
            navigate('/rooms');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleEdit = () => {
        navigate(`/rooms/edit/${id}`);
    };

    const handleBook = () => {
        navigate(`/reservations/new?roomId=${id}`);
    };

    // Amenity icons
    const amenityIcons = {
        'WiFi': { icon: <FaWifi />, color: 'primary' },
        'TV': { icon: <FaTv />, color: 'info' },
        'AC': { icon: <FaSnowflake />, color: 'info' },
        'Breakfast': { icon: <FaCoffee />, color: 'warning' },
        'Parking': { icon: <FaCar />, color: 'secondary' },
        'Shower': { icon: <FaShower />, color: 'primary' },
        'Bath': { icon: <FaBath />, color: 'info' },
        'Kitchen': { icon: <FaUtensils />, color: 'danger' },
        'Pool': { icon: <FaSwimmingPool />, color: 'info' },
        'Gym': { icon: <FaDumbbell />, color: 'warning' },
        'default': { icon: <FaStar />, color: 'success' }
    };

    const roomImages = [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w-800'
    ];

    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-4 text-muted fs-5">Loading luxury room details...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="danger" className="border-0 shadow-sm">
                <Alert.Heading className="d-flex align-items-center">
                    <FaHotel className="me-2" />
                    Room Not Found
                </Alert.Heading>
                <p>{errorMsg}</p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button
                        variant="outline-danger"
                        onClick={() => navigate('/rooms')}
                    >
                        Back to Rooms
                    </Button>
                </div>
            </Alert>
        );
    }

    if (!room) {
        return null;
    }

    return (
        <Container className="room-details-container">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb bg-light p-3 rounded">
                    <li className="breadcrumb-item">
                        <a href="/" className="text-decoration-none">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="/rooms" className="text-decoration-none">Rooms</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Room {room.roomNumber}
                    </li>
                </ol>
            </nav>

            <Row className="g-4">
                {/* Left Column - Room Images & Basic Info */}
                <Col lg={8}>
                    {/* Room Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <div className="d-flex align-items-center mb-2">
                                <Badge
                                    bg={room.isAvailable ? "success" : "danger"}
                                    className="px-3 py-2 me-3"
                                >
                                    {room.isAvailable ? 'AVAILABLE' : 'BOOKED'}
                                </Badge>
                                <Badge bg="warning" className="px-3 py-2">
                                    <FaStar className="me-1" />
                                    PREMIUM
                                </Badge>
                            </div>
                            <h1 className="display-5 fw-bold mb-2">
                                Room {room.roomNumber} - {room.type}
                            </h1>
                            <p className="text-muted mb-0">
                                Experience luxury and comfort in our premium {room.type.toLowerCase()} room
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary" size="sm">
                                <FaShareAlt />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <FaPrint />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <FaHeart />
                            </Button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                        <Carousel controls indicators className="room-carousel">
                            {roomImages.map((img, index) => (
                                <Carousel.Item key={index}>
                                    <div
                                        className="room-image"
                                        style={{
                                            backgroundImage: `url(${img})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            height: '400px'
                                        }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="fw-bold text-primary mb-0">
                                        ${room.price} <small className="text-muted fs-6">/ night</small>
                                    </h3>
                                    <small className="text-muted">Exclusive of taxes</small>
                                </div>
                                <Button
                                    variant={room.isAvailable ? "primary" : "secondary"}
                                    size="lg"
                                    onClick={handleBook}
                                    disabled={!room.isAvailable}
                                    className="px-5"
                                >
                                    <FaCalendarPlus className="me-2" />
                                    {room.isAvailable ? 'Book Now' : 'Not Available'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Room Tabs */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="border-0"
                                fill
                            >
                                <Tab eventKey="details" title="Room Details">
                                    <div className="p-4">
                                        <Row>
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-3">Room Specifications</h5>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 py-3">
                                                        <span className="d-flex align-items-center">
                                                            <FaBed className="me-3 text-primary" />
                                                            Room Type
                                                        </span>
                                                        <Badge bg="primary">{room.type}</Badge>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 py-3">
                                                        <span className="d-flex align-items-center">
                                                            <FaUsers className="me-3 text-success" />
                                                            Maximum Guests
                                                        </span>
                                                        <strong>{room.maxGuests} persons</strong>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 py-3">
                                                        <span className="d-flex align-items-center">
                                                            <FaRulerCombined className="me-3 text-warning" />
                                                            Room Size
                                                        </span>
                                                        <strong>
                                                            {room.type === 'Single' ? '250' :
                                                                room.type === 'Double' ? '350' :
                                                                    room.type === 'Suite' ? '500' : '600'} sq ft
                                                        </strong>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 py-3">
                                                        <span className="d-flex align-items-center">
                                                            <FaDoorOpen className="me-3 text-info" />
                                                            Room Number
                                                        </span>
                                                        <Badge bg="info" className="fs-6">#{room.roomNumber}</Badge>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-3">Room Features</h5>
                                                <div className="row g-3">
                                                    <Col xs={6}>
                                                        <div className="text-center p-3 border rounded">
                                                            <FaThermometerHalf className="text-primary fs-3 mb-2" />
                                                            <div className="small">Air Conditioning</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-center p-3 border rounded">
                                                            <FaBath className="text-info fs-3 mb-2" />
                                                            <div className="small">Private Bathroom</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-center p-3 border rounded">
                                                            <FaCouch className="text-warning fs-3 mb-2" />
                                                            <div className="small">Sitting Area</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-center p-3 border rounded">
                                                            <FaUtensils className="text-danger fs-3 mb-2" />
                                                            <div className="small">Mini Bar</div>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab>

                                <Tab eventKey="amenities" title="Amenities">
                                    <div className="p-4">
                                        <h5 className="fw-bold mb-4">Included Amenities</h5>
                                        <Row className="g-4">
                                            {(room.amenities || []).map((amenity, index) => {
                                                const amenityConfig = amenityIcons[amenity] || amenityIcons.default;
                                                return (
                                                    <Col key={index} md={4} sm={6}>
                                                        <Card className="border-0 bg-light h-100">
                                                            <Card.Body className="text-center p-4">
                                                                <div className={`text-${amenityConfig.color} mb-3`}>
                                                                    <div className="fs-1">{amenityConfig.icon}</div>
                                                                </div>
                                                                <h6 className="fw-bold">{amenity}</h6>
                                                                <small className="text-muted">
                                                                    {amenity === 'WiFi' && 'High-speed internet access'}
                                                                    {amenity === 'TV' && 'Smart TV with streaming'}
                                                                    {amenity === 'AC' && 'Climate control system'}
                                                                    {amenity === 'Breakfast' && 'Complimentary breakfast'}
                                                                    {amenity === 'Parking' && 'Free parking space'}
                                                                    {amenity === 'Shower' && 'Rain shower system'}
                                                                    {!['WiFi', 'TV', 'AC', 'Breakfast', 'Parking', 'Shower'].includes(amenity) && 'Premium feature included'}
                                                                </small>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </Tab>

                                <Tab eventKey="description" title="Description">
                                    <div className="p-4">
                                        <h5 className="fw-bold mb-3">Room Description</h5>
                                        <div className="bg-light p-4 rounded">
                                            <p className="lead mb-4">
                                                {room.description || `Experience unparalleled luxury in our ${room.type} room. This elegantly appointed space combines modern amenities with classic comfort, offering the perfect retreat for both business and leisure travelers.`}
                                            </p>
                                            <div className="row g-4">
                                                <Col md={6}>
                                                    <h6 className="fw-bold mb-3">What's Included</h6>
                                                    <ul className="list-unstyled">
                                                        <li className="mb-2"><FaCheck className="text-success me-2" />Daily housekeeping</li>
                                                        <li className="mb-2"><FaCheck className="text-success me-2" />24/7 room service</li>
                                                        <li className="mb-2"><FaCheck className="text-success me-2" />Complimentary toiletries</li>
                                                        <li><FaCheck className="text-success me-2" />Laundry service available</li>
                                                    </ul>
                                                </Col>
                                                <Col md={6}>
                                                    <h6 className="fw-bold mb-3">Special Features</h6>
                                                    <ul className="list-unstyled">
                                                        <li className="mb-2"><FaStar className="text-warning me-2" />Premium bedding</li>
                                                        <li className="mb-2"><FaStar className="text-warning me-2" />Soundproof walls</li>
                                                        <li className="mb-2"><FaStar className="text-warning me-2" />Blackout curtains</li>
                                                        <li><FaStar className="text-warning me-2" />Work desk with ergonomic chair</li>
                                                    </ul>
                                                </Col>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Booking & Actions */}
                <Col lg={4}>
                    {/* Quick Stats */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaHotel className="me-2" />
                                Room Statistics
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <div className="display-6 fw-bold text-primary">{room.isAvailable ? '100%' : '0%'}</div>
                                <small className="text-muted">Availability Rate</small>
                                <ProgressBar
                                    now={room.isAvailable ? 100 : 0}
                                    variant={room.isAvailable ? "success" : "danger"}
                                    className="mt-2"
                                    style={{ height: '8px' }}
                                />
                            </div>
                            <Row className="text-center">
                                <Col xs={4} className="border-end">
                                    <div className="fw-bold text-primary">{room.maxGuests}</div>
                                    <small className="text-muted">Guests</small>
                                </Col>
                                <Col xs={4} className="border-end">
                                    <div className="fw-bold text-success">${room.price}</div>
                                    <small className="text-muted">Price</small>
                                </Col>
                                <Col xs={4}>
                                    <div className="fw-bold text-warning">
                                        {room.type === 'Single' ? '250' :
                                            room.type === 'Double' ? '350' :
                                                room.type === 'Suite' ? '500' : '600'}
                                    </div>
                                    <small className="text-muted">Sq Ft</small>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-info text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaEdit className="me-2" />
                                Management Actions
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="d-grid gap-2 p-3">
                                {user?.role === 'admin' && (
                                    <>
                                        <Button
                                            variant="outline-primary"
                                            onClick={handleEdit}
                                            className="d-flex align-items-center justify-content-center py-3"
                                        >
                                            <FaEdit className="me-2" />
                                            Edit Room Details
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            onClick={handleDelete}
                                            className="d-flex align-items-center justify-content-center py-3"
                                        >
                                            <FaTrash className="me-2" />
                                            Delete Room
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant="outline-success"
                                    onClick={handleBook}
                                    disabled={!room.isAvailable}
                                    className="d-flex align-items-center justify-content-center py-3"
                                >
                                    <FaCalendarPlus className="me-2" />
                                    Create Reservation
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate('/rooms')}
                                    className="d-flex align-items-center justify-content-center py-3"
                                >
                                    <FaArrowLeft className="me-2" />
                                    Back to All Rooms
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Price Breakdown - visible to admins only */}
                    {user?.role === 'admin' && (
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-success text-white border-0 py-3">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FaHotel className="me-2" />
                                    Price Breakdown
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between border-0 py-3">
                                        <span>Room per night</span>
                                        <strong>${room.price}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between border-0 py-3">
                                        <span>Service fee</span>
                                        <strong>${(room.price * 0.1).toFixed(2)}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between border-0 py-3">
                                        <span>Taxes</span>
                                        <strong>${(room.price * 0.18).toFixed(2)}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between border-0 py-3 bg-light">
                                        <span className="fw-bold">Total per night</span>
                                        <strong className="text-success fs-5">
                                            ${(room.price * 1.28).toFixed(2)}
                                        </strong>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        *Prices include all taxes and service charges
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-danger">
                        <FaTrash className="me-2" />
                        Delete Room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger" className="border-0">
                        <Alert.Heading>⚠️ Permanent Action</Alert.Heading>
                        <p>
                            Are you sure you want to delete <strong>Room {room.roomNumber}</strong>?
                            This action cannot be undone and will remove all associated reservations.
                        </p>
                    </Alert>
                    <div className="bg-light p-3 rounded">
                        <h6 className="fw-bold">Room Details:</h6>
                        <p className="mb-2"><strong>Type:</strong> {room.type}</p>
                        <p className="mb-2"><strong>Price:</strong> ${room.price}/night</p>
                        <p className="mb-0"><strong>Status:</strong> {room.isAvailable ? 'Available' : 'Booked'}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete Room
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RoomDetails;