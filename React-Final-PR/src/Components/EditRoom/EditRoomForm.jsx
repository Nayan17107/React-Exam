import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form,
    Button,
    Alert,
    Spinner,
    Card,
    Badge,
    Row,
    Col,
    InputGroup,
    ProgressBar,
    Tabs,
    Tab
} from 'react-bootstrap';
import { getRoomAsync, updateRoomAsync } from '../../Services/Actions/RoomActions';
import {
    FaEdit,
    FaBed,
    FaDollarSign,
    FaUsers,
    FaWifi,
    FaTv,
    FaSnowflake,
    FaCoffee,
    FaCar,
    FaCheck,
    FaTimes,
    FaArrowLeft,
    FaSave,
    FaListAlt,
    FaChartLine,
    FaCalendarCheck,
    FaCalendarTimes
} from 'react-icons/fa';

const EditRoomForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { room, isLoading, errorMsg } = useSelector(state => state.rooms);

    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        maxGuests: 1,
        amenities: [],
        description: '',
        isAvailable: true
    });

    const [newAmenity, setNewAmenity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [validationErrors, setValidationErrors] = useState({});

    const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Family'];
    const popularAmenities = ['WiFi', 'TV', 'AC', 'Breakfast', 'Parking', 'Shower'];

    // Fetch room data
    useEffect(() => {
        if (id) {
            dispatch(getRoomAsync(id));
        }
    }, [dispatch, id]);

    // Update form when room loads
    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber || '',
                type: room.type || 'Single',
                price: room.price ? room.price.toString() : '',
                maxGuests: room.maxGuests || 1,
                amenities: Array.isArray(room.amenities) ? room.amenities : [],
                description: room.description || '',
                isAvailable: room.isAvailable !== undefined ? room.isAvailable : true
            });
        }
    }, [room]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                (name === 'price' || name === 'maxGuests') ?
                    (value === '' ? '' : name === 'price' ? parseFloat(value) : parseInt(value)) :
                    value
        }));

        // Clear validation error
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Add new amenity
    const handleAddAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()]
            }));
            setNewAmenity('');
        }
    };

    // Add popular amenity
    const handleAddPopularAmenity = (amenity) => {
        if (!formData.amenities.includes(amenity)) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenity]
            }));
        }
    };

    // Remove amenity
    const handleRemoveAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.roomNumber.trim()) errors.roomNumber = 'Room number is required';
        if (!formData.price) errors.price = 'Price is required';
        if (formData.price && parseFloat(formData.price) <= 0) errors.price = 'Price must be greater than 0';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const roomData = {
                roomNumber: formData.roomNumber,
                type: formData.type,
                price: parseFloat(formData.price),
                maxGuests: parseInt(formData.maxGuests),
                amenities: formData.amenities,
                description: formData.description,
                isAvailable: formData.isAvailable
            };

            await dispatch(updateRoomAsync(id, roomData));
            navigate(`/rooms/${id}`);
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Amenity icons
    const amenityIcons = {
        'WiFi': <FaWifi className="me-2" />,
        'TV': <FaTv className="me-2" />,
        'AC': <FaSnowflake className="me-2" />,
        'Breakfast': <FaCoffee className="me-2" />,
        'Parking': <FaCar className="me-2" />,
        'default': <FaCheck className="me-2" />
    };

    if (isLoading && !room) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" size="lg" />
                <p className="mt-3 text-muted">Loading room details...</p>
            </div>
        );
    }

    return (
        <div className="edit-room-form-container">
            {errorMsg && (
                <Alert variant="danger" className="border-0 shadow-sm mb-4">
                    <Alert.Heading className="d-flex align-items-center">
                        <FaTimes className="me-2" />
                        Error Loading Room
                    </Alert.Heading>
                    <p>{errorMsg}</p>
                </Alert>
            )}

            {room && (
                <>
                    {/* Current Room Stats */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                            <FaBed size={32} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="fw-bold mb-1">Room {room.roomNumber}</h3>
                                            <div className="d-flex flex-wrap gap-2">
                                                <Badge bg="primary" className="px-3 py-2">{room.type}</Badge>
                                                <Badge bg={room.isAvailable ? "success" : "danger"} className="px-3 py-2">
                                                    {room.isAvailable ? 'Available' : 'Booked'}
                                                </Badge>
                                                <Badge bg="info" className="px-3 py-2">
                                                    <FaDollarSign className="me-1" />
                                                    ${room.price}/night
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} className="text-md-end">
                                    <div className="d-flex flex-column">
                                        <small className="text-muted">Last Updated</small>
                                        <strong>
                                            {room.updatedAt
                                                ? new Date(room.updatedAt).toLocaleDateString()
                                                : 'Never'}
                                        </strong>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Form onSubmit={handleSubmit} id="edit-room-form">
                        {/* Tabs Navigation */}
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body className="p-0">
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k)}
                                    className="border-0 px-3 pt-3"
                                    fill
                                >
                                    <Tab eventKey="basic" title="Basic Information">
                                        <div className="p-3">
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">
                                                            Room Number *
                                                        </Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text>#</InputGroup.Text>
                                                            <Form.Control
                                                                type="text"
                                                                name="roomNumber"
                                                                value={formData.roomNumber}
                                                                onChange={handleChange}
                                                                required
                                                                className={validationErrors.roomNumber ? 'is-invalid' : ''}
                                                            />
                                                        </InputGroup>
                                                        {validationErrors.roomNumber && (
                                                            <div className="invalid-feedback">
                                                                {validationErrors.roomNumber}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">
                                                            Room Type *
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="type"
                                                            value={formData.type}
                                                            onChange={handleChange}
                                                            required
                                                            disabled={isSubmitting}
                                                        >
                                                            {roomTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold d-flex align-items-center">
                                                            <FaDollarSign className="me-2" />
                                                            Price per Night *
                                                        </Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text>$</InputGroup.Text>
                                                            <Form.Control
                                                                type="number"
                                                                name="price"
                                                                value={formData.price}
                                                                onChange={handleChange}
                                                                required
                                                                min="0"
                                                                step="0.01"
                                                                disabled={isSubmitting}
                                                                className={validationErrors.price ? 'is-invalid' : ''}
                                                            />
                                                            <InputGroup.Text>/ night</InputGroup.Text>
                                                        </InputGroup>
                                                        {validationErrors.price && (
                                                            <div className="invalid-feedback">
                                                                {validationErrors.price}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold d-flex align-items-center">
                                                            <FaUsers className="me-2" />
                                                            Maximum Guests *
                                                        </Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text>
                                                                <FaUsers />
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type="number"
                                                                name="maxGuests"
                                                                value={formData.maxGuests}
                                                                onChange={handleChange}
                                                                required
                                                                min="1"
                                                                max="10"
                                                                disabled={isSubmitting}
                                                                className="text-center"
                                                            />
                                                            <InputGroup.Text>guests</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-bold">
                                                            Room Description
                                                        </Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                            placeholder="Describe the room features..."
                                                            disabled={isSubmitting}
                                                            className="resize-none"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="amenities" title="Amenities">
                                        <div className="p-3">
                                            {/* Popular Amenities */}
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3">Popular Amenities</h6>
                                                <div className="d-flex flex-wrap gap-2 mb-4">
                                                    {popularAmenities.map((amenity) => (
                                                        <Button
                                                            key={amenity}
                                                            variant={formData.amenities.includes(amenity) ? "primary" : "outline-primary"}
                                                            size="sm"
                                                            onClick={() => handleAddPopularAmenity(amenity)}
                                                            disabled={isSubmitting}
                                                            className="d-flex align-items-center"
                                                        >
                                                            {amenityIcons[amenity] || amenityIcons.default}
                                                            {amenity}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Custom Amenities */}
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3">Custom Amenities</h6>
                                                <div className="d-flex mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        value={newAmenity}
                                                        onChange={(e) => setNewAmenity(e.target.value)}
                                                        placeholder="Type custom amenity"
                                                        disabled={isSubmitting}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                                    />
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={handleAddAmenity}
                                                        className="ms-2"
                                                        disabled={isSubmitting}
                                                    >
                                                        <FaEdit className="me-1" />
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Selected Amenities */}
                                            {formData.amenities.length > 0 && (
                                                <div className="mt-4">
                                                    <h6 className="fw-bold mb-3">Selected Amenities ({formData.amenities.length})</h6>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {formData.amenities.map((amenity, index) => (
                                                            <Badge
                                                                key={index}
                                                                bg="info"
                                                                className="px-3 py-2 d-flex align-items-center fs-6"
                                                            >
                                                                {amenityIcons[amenity] || amenityIcons.default}
                                                                {amenity}
                                                                <Button
                                                                    variant="link"
                                                                    className="text-white p-0 ms-2"
                                                                    onClick={() => handleRemoveAmenity(amenity)}
                                                                    style={{ fontSize: '12px' }}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    <FaTimes />
                                                                </Button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Tab>

                                    <Tab eventKey="availability" title="Availability">
                                        <div className="p-3">
                                            <div className="mb-4">
                                                <h6 className="fw-bold mb-3">Room Availability</h6>
                                                <Card className="border border-primary">
                                                    <Card.Body>
                                                        <Form.Check
                                                            type="switch"
                                                            id="availability-switch"
                                                            label={
                                                                <div className="d-flex align-items-center">
                                                                    {formData.isAvailable ? (
                                                                        <>
                                                                            <FaCalendarCheck className="text-success me-2" />
                                                                            <span className="fw-bold">Room Available for Booking</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaCalendarTimes className="text-danger me-2" />
                                                                            <span className="fw-bold">Room Not Available</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            }
                                                            name="isAvailable"
                                                            checked={formData.isAvailable}
                                                            onChange={handleChange}
                                                            disabled={isSubmitting}
                                                        />
                                                        <div className="mt-3">
                                                            <ProgressBar
                                                                now={formData.isAvailable ? 100 : 0}
                                                                variant={formData.isAvailable ? "success" : "danger"}
                                                                className="mb-2"
                                                                style={{ height: '8px' }}
                                                            />
                                                            <div className="d-flex justify-content-between">
                                                                <small className="text-muted">Current Status</small>
                                                                <Badge bg={formData.isAvailable ? "success" : "danger"}>
                                                                    {formData.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>

                                            <Alert variant="info" className="border-0">
                                                <Alert.Heading>💡 Availability Notes</Alert.Heading>
                                                <ul className="mb-0">
                                                    <li>Marking as unavailable will prevent new bookings</li>
                                                    <li>Existing reservations will not be affected</li>
                                                    <li>Use this for maintenance or renovations</li>
                                                </ul>
                                            </Alert>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="preview" title="Preview">
                                        <div className="p-3">
                                            <Row>
                                                <Col md={6}>
                                                    <Card className="border border-success h-100">
                                                        <Card.Header className="bg-success bg-opacity-10 border-success">
                                                            <h6 className="fw-bold mb-0">Updated Details</h6>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block">ROOM NUMBER</small>
                                                                <strong className="fs-5">#{formData.roomNumber}</strong>
                                                            </div>
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block">ROOM TYPE</small>
                                                                <strong className="fs-5">{formData.type}</strong>
                                                            </div>
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block">PRICE</small>
                                                                <strong className="fs-4 text-success">${formData.price}/night</strong>
                                                            </div>
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block">CAPACITY</small>
                                                                <strong className="fs-5">{formData.maxGuests} guests</strong>
                                                            </div>
                                                            <div className="mb-3">
                                                                <small className="text-muted d-block">AVAILABILITY</small>
                                                                <Badge bg={formData.isAvailable ? "success" : "danger"} className="fs-6">
                                                                    {formData.isAvailable ? "Available" : "Unavailable"}
                                                                </Badge>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>

                                                <Col md={6}>
                                                    <Card className="border border-info h-100">
                                                        <Card.Header className="bg-info bg-opacity-10 border-info">
                                                            <h6 className="fw-bold mb-0">Amenities ({formData.amenities.length})</h6>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            {formData.amenities.length > 0 ? (
                                                                <div className="row g-2">
                                                                    {formData.amenities.map((amenity, index) => (
                                                                        <Col key={index} xs={6}>
                                                                            <div className="bg-light p-2 rounded text-center small mb-2">
                                                                                {amenityIcons[amenity] || amenityIcons.default}
                                                                                {amenity}
                                                                            </div>
                                                                        </Col>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-muted text-center mb-0">
                                                                    No amenities selected
                                                                </p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            {formData.description && (
                                                <Card className="border border-warning mt-3">
                                                    <Card.Header className="bg-warning bg-opacity-10 border-warning">
                                                        <h6 className="fw-bold mb-0">Description</h6>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <p className="mb-0">{formData.description}</p>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>

                        {/* Form Actions */}
                        <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate(`/rooms/${id}`)}
                                disabled={isSubmitting}
                                className="px-4"
                            >
                                <FaArrowLeft className="me-2" />
                                Cancel
                            </Button>

                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-warning"
                                    onClick={() => {
                                        if (room) {
                                            setFormData({
                                                roomNumber: room.roomNumber || '',
                                                type: room.type || 'Single',
                                                price: room.price ? room.price.toString() : '',
                                                maxGuests: room.maxGuests || 1,
                                                amenities: Array.isArray(room.amenities) ? room.amenities : [],
                                                description: room.description || '',
                                                isAvailable: room.isAvailable !== undefined ? room.isAvailable : true
                                            });
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    className="px-4"
                                >
                                    Reset to Original
                                </Button>

                                <Button
                                    type="submit"
                                    variant="warning"
                                    disabled={isSubmitting || isLoading}
                                    className="px-5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="me-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </>
            )}
        </div>
    );
};

export default EditRoomForm;