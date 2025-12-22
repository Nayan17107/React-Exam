import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Form,
    Button,
    Alert,
    Spinner,
    Card,
    Row,
    Col,
    Badge,
    ProgressBar,
    InputGroup
} from 'react-bootstrap';
import { addReservationAsync } from '../../Services/Actions/ReservationActions';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBed,
    FaCalendarAlt,
    FaUsers,
    FaComment,
    FaCalculator,
    FaArrowLeft,
    FaCheck,
    FaExclamationTriangle,
    FaCalendarCheck,
    FaCalendarTimes,
    FaDollarSign,
    FaWifi,
    FaTv,
    FaCoffee,
    FaSnowflake
} from 'react-icons/fa';
import './ReservationForm.css';

const ReservationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const queryParams = new URLSearchParams(location.search);
    const roomIdFromUrl = queryParams.get('roomId');

    const { rooms } = useSelector(state => state.rooms);
    const { isLoading, errorMsg } = useSelector(state => state.reservations);

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        roomId: roomIdFromUrl || '',
        checkIn: '',
        checkOut: '',
        numberOfGuests: 1,
        specialRequests: ''
    });

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formStep, setFormStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    useEffect(() => {
        if (formData.roomId && rooms.length > 0) {
            const room = rooms.find(r => r.id === formData.roomId);
            setSelectedRoom(room);
        }
    }, [formData.roomId, rooms]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const calculateTotal = () => {
        if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0;

        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        return nights * selectedRoom.price;
    };

    const calculateNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;

        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    const validateStep = () => {
        const errors = {};

        if (formStep === 1) {
            if (!formData.guestName.trim()) errors.guestName = 'Name is required';
            if (!formData.guestEmail.trim()) errors.guestEmail = 'Email is required';
            if (!formData.guestPhone.trim()) errors.guestPhone = 'Phone is required';
        } else if (formStep === 2) {
            if (!formData.roomId) errors.roomId = 'Please select a room';
            if (!formData.checkIn) errors.checkIn = 'Check-in date is required';
            if (!formData.checkOut) errors.checkOut = 'Check-out date is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setFormStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevStep = () => {
        setFormStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            setValidationErrors(prev => ({
                ...prev,
                checkIn: 'Check-in date cannot be in the past'
            }));
            setFormStep(2);
            return;
        }

        if (checkOut <= checkIn) {
            setValidationErrors(prev => ({
                ...prev,
                checkOut: 'Check-out date must be after check-in date'
            }));
            setFormStep(2);
            return;
        }

        const reservationData = {
            ...formData,
            totalPrice: calculateTotal(),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        try {
            await dispatch(addReservationAsync(reservationData));
            navigate('/reservations');
        } catch (error) {
            console.error('Reservation error:', error);
        }
    };

    const availableRooms = rooms.filter(room => room.isAvailable);
    const amenityIcons = {
        'WiFi': <FaWifi className="me-1" />,
        'TV': <FaTv className="me-1" />,
        'AC': <FaSnowflake className="me-1" />,
        'Breakfast': <FaCoffee className="me-1" />,
        'default': <FaCheck className="me-1" />
    };

    return (
        <div className="reservation-form-container">
            {/* Progress Steps */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`d-flex flex-column align-items-center position-relative ${step < 3 ? 'flex-grow-1' : ''
                                    }`}
                            >
                                <div className={`step-circle ${formStep >= step ? 'active' : ''} ${formStep === step ? 'current' : ''}`}>
                                    {formStep > step ? <FaCheck /> : step}
                                </div>
                                <div className="step-label mt-2 small text-center">
                                    {step === 1 && 'Guest Info'}
                                    {step === 2 && 'Booking Details'}
                                    {step === 3 && 'Confirmation'}
                                </div>
                                {step < 3 && (
                                    <div className={`step-line ${formStep > step ? 'active' : ''}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Form Header */}
            <div className="mb-4">
                <h1 className="fw-bold display-6 mb-2">Create New Reservation</h1>
                <p className="text-muted">
                    Fill in the details below to book a room for your guest
                </p>
            </div>

            {errorMsg && (
                <Alert variant="danger" className="border-0 shadow-sm mb-4">
                    <Alert.Heading className="d-flex align-items-center">
                        <FaExclamationTriangle className="me-2" />
                        Reservation Error
                    </Alert.Heading>
                    <p className="mb-0">{errorMsg}</p>
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Step 1: Guest Information */}
                {formStep === 1 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaUser className="me-2" />
                                Guest Information
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaUser className="me-2" />
                                            Full Name *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="guestName"
                                            value={formData.guestName}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className={validationErrors.guestName ? 'is-invalid' : ''}
                                        />
                                        {validationErrors.guestName && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.guestName}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaEnvelope className="me-2" />
                                            Email Address *
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaEnvelope />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                name="guestEmail"
                                                value={formData.guestEmail}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className={validationErrors.guestEmail ? 'is-invalid' : ''}
                                            />
                                        </InputGroup>
                                        {validationErrors.guestEmail && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.guestEmail}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaPhone className="me-2" />
                                            Phone Number *
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaPhone />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="tel"
                                                name="guestPhone"
                                                value={formData.guestPhone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+1 (555) 123-4567"
                                                className={validationErrors.guestPhone ? 'is-invalid' : ''}
                                            />
                                        </InputGroup>
                                        {validationErrors.guestPhone && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.guestPhone}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaUsers className="me-2" />
                                            Number of Guests *
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaUsers />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                name="numberOfGuests"
                                                value={formData.numberOfGuests}
                                                onChange={handleChange}
                                                min="1"
                                                max={selectedRoom?.maxGuests || 10}
                                                required
                                                className="text-center"
                                            />
                                            <InputGroup.Text>guests</InputGroup.Text>
                                        </InputGroup>
                                        <Form.Text className="text-muted small">
                                            {selectedRoom
                                                ? `Max capacity: ${selectedRoom.maxGuests} guests`
                                                : 'Select a room to see capacity'}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}

                {/* Step 2: Booking Details */}
                {formStep === 2 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-info text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaCalendarAlt className="me-2" />
                                Booking Details
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                {/* Room Selection */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaBed className="me-2" />
                                            Select Room *
                                        </Form.Label>
                                        <Form.Select
                                            name="roomId"
                                            value={formData.roomId}
                                            onChange={handleChange}
                                            required
                                            disabled={roomIdFromUrl}
                                            className={validationErrors.roomId ? 'is-invalid' : ''}
                                            size="lg"
                                        >
                                            <option value="">Choose a room...</option>
                                            {availableRooms.map(room => (
                                                <option key={room.id} value={room.id}>
                                                    Room {room.roomNumber} - {room.type} (${room.price}/night)
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {roomIdFromUrl && (
                                            <Form.Text className="text-muted d-flex align-items-center mt-2">
                                                <FaCheck className="me-1 text-success" />
                                                Pre-selected room from booking link
                                            </Form.Text>
                                        )}
                                        {validationErrors.roomId && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.roomId}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {/* Selected Room Details */}
                                {selectedRoom && (
                                    <Col md={12}>
                                        <Card className="border border-info">
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col md={8}>
                                                        <h5 className="fw-bold mb-3">
                                                            <FaBed className="me-2" />
                                                            Room {selectedRoom.roomNumber} - {selectedRoom.type}
                                                        </h5>
                                                        <Row>
                                                            <Col md={6}>
                                                                <div className="mb-2">
                                                                    <small className="text-muted d-block">PRICE PER NIGHT</small>
                                                                    <strong className="text-primary h4">
                                                                        ${selectedRoom.price}
                                                                    </strong>
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className="mb-2">
                                                                    <small className="text-muted d-block">MAX CAPACITY</small>
                                                                    <strong className="h5">
                                                                        {selectedRoom.maxGuests} guests
                                                                    </strong>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        {selectedRoom.amenities?.length > 0 && (
                                                            <div className="mt-3">
                                                                <small className="text-muted d-block mb-2">AMENITIES</small>
                                                                <div className="d-flex flex-wrap gap-2">
                                                                    {selectedRoom.amenities.map((amenity, index) => (
                                                                        <Badge key={index} bg="light" text="dark" className="px-3 py-2">
                                                                            {amenityIcons[amenity] || amenityIcons.default}
                                                                            {amenity}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Col>
                                                    <Col md={4} className="text-center">
                                                        <div className="display-1 text-info opacity-25">
                                                            <FaBed />
                                                        </div>
                                                        <Badge bg="success" className="px-3 py-2 mt-2">
                                                            Available
                                                        </Badge>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}

                                {/* Dates */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaCalendarCheck className="me-2" />
                                            Check-in Date *
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaCalendarCheck />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="date"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleChange}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className={validationErrors.checkIn ? 'is-invalid' : ''}
                                            />
                                        </InputGroup>
                                        {validationErrors.checkIn && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.checkIn}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaCalendarTimes className="me-2" />
                                            Check-out Date *
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaCalendarTimes />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="date"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleChange}
                                                required
                                                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                                className={validationErrors.checkOut ? 'is-invalid' : ''}
                                            />
                                        </InputGroup>
                                        {validationErrors.checkOut && (
                                            <div className="invalid-feedback d-flex align-items-center">
                                                <FaExclamationTriangle className="me-1" />
                                                {validationErrors.checkOut}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>

                                {/* Price Calculation */}
                                {formData.checkIn && formData.checkOut && selectedRoom && (
                                    <Col md={12}>
                                        <Card className="border border-warning">
                                            <Card.Body>
                                                <h6 className="fw-bold d-flex align-items-center mb-3">
                                                    <FaCalculator className="me-2" />
                                                    Price Calculation
                                                </h6>
                                                <Row className="text-center">
                                                    <Col md={4}>
                                                        <small className="text-muted d-block">NIGHTS</small>
                                                        <div className="display-6 fw-bold text-primary">
                                                            {calculateNights()}
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <small className="text-muted d-block">PRICE PER NIGHT</small>
                                                        <div className="display-6 fw-bold text-info">
                                                            ${selectedRoom.price}
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <small className="text-muted d-block">TOTAL</small>
                                                        <div className="display-6 fw-bold text-success">
                                                            <FaDollarSign className="me-1" />
                                                            {calculateTotal()}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                )}

                {/* Step 3: Special Requests & Confirmation */}
                {formStep === 3 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-success text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaComment className="me-2" />
                                Special Requests & Confirmation
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                {/* Special Requests */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold d-flex align-items-center">
                                            <FaComment className="me-2" />
                                            Special Requests
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            placeholder="Any special requests, dietary requirements, or additional notes for your stay..."
                                            className="resize-none"
                                        />
                                        <Form.Text className="text-muted">
                                            Optional: Let us know how we can make your stay more comfortable
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                {/* Reservation Summary */}
                                {selectedRoom && (
                                    <Col md={12}>
                                        <Card className="border border-success">
                                            <Card.Header className="bg-success bg-opacity-10 border-0">
                                                <h6 className="fw-bold mb-0">Reservation Summary</h6>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">GUEST</small>
                                                            <strong>{formData.guestName}</strong>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">EMAIL</small>
                                                            <strong>{formData.guestEmail}</strong>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">PHONE</small>
                                                            <strong>{formData.guestPhone}</strong>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">ROOM</small>
                                                            <strong>Room {selectedRoom.roomNumber} - {selectedRoom.type}</strong>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">DATES</small>
                                                            <strong>
                                                                {formData.checkIn} to {formData.checkOut}
                                                            </strong>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block">TOTAL AMOUNT</small>
                                                            <div className="display-6 fw-bold text-success">
                                                                ${calculateTotal()}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                {/* Final Calculation */}
                                                <div className="bg-light p-3 rounded mt-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <small className="text-muted d-block">Stay Duration</small>
                                                            <strong>{calculateNights()} nights</strong>
                                                        </div>
                                                        <div className="text-center">
                                                            <small className="text-muted d-block">Room Price</small>
                                                            <strong>${selectedRoom.price}/night</strong>
                                                        </div>
                                                        <div className="text-end">
                                                            <small className="text-muted d-block">Total</small>
                                                            <strong className="h4 text-success">${calculateTotal()}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                )}

                {/* Form Navigation */}
                <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                    <Button
                        variant="outline-secondary"
                        onClick={formStep === 1 ? () => navigate('/rooms') : handlePrevStep}
                        disabled={isLoading}
                        className="px-4"
                    >
                        <FaArrowLeft className="me-2" />
                        {formStep === 1 ? 'Back to Rooms' : 'Previous'}
                    </Button>

                    {formStep < 3 ? (
                        <Button
                            variant="primary"
                            onClick={handleNextStep}
                            disabled={isLoading}
                            className="px-5"
                        >
                            Continue to {formStep === 1 ? 'Booking Details' : 'Confirmation'}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="success"
                            disabled={isLoading || !formData.roomId}
                            className="px-5"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="me-2" />
                                    Confirm Reservation
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default ReservationForm;