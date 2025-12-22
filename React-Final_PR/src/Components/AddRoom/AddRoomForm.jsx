import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Button,
    Alert,
    Spinner,
    Card,
    Row,
    Col,
    InputGroup,
    Badge,
    ProgressBar
} from 'react-bootstrap';
import { addRoomAsync } from '../../Services/Actions/RoomActions';
import {
    FaPlus,
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
    FaListAlt
} from 'react-icons/fa';
import './AddRoomForm.css';

const AddRoomForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, errorMsg } = useSelector(state => state.rooms);

    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        maxGuests: 1,
        amenities: [],
        description: ''
    });

    const [newAmenity, setNewAmenity] = useState('');
    const [formStep, setFormStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});

    // Room type options with icons
    const roomTypes = [
        { value: 'Single', label: 'Single Room', icon: '🛌', capacity: '1-2 guests' },
        { value: 'Double', label: 'Double Room', icon: '🛏️', capacity: '2 guests' },
        { value: 'Suite', label: 'Suite', icon: '🏨', capacity: '2-4 guests' },
        { value: 'Deluxe', label: 'Deluxe Room', icon: '⭐', capacity: '2-3 guests' },
        { value: 'Family', label: 'Family Room', icon: '👨‍👩‍👧‍👦', capacity: '4-6 guests' }
    ];

    // Popular amenities
    const popularAmenities = ['WiFi', 'TV', 'AC', 'Breakfast', 'Parking', 'Shower', 'Pool', 'Gym'];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Handle number input
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : parseInt(value)
        }));
    };

    // Add amenity from input
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

    // Validate current step
    const validateStep = () => {
        const errors = {};

        if (formStep === 1) {
            if (!formData.roomNumber.trim()) errors.roomNumber = 'Room number is required';
            if (!formData.price) errors.price = 'Price is required';
            if (formData.price && parseFloat(formData.price) <= 0) errors.price = 'Price must be greater than 0';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle next step
    const handleNextStep = () => {
        if (validateStep()) {
            setFormStep(prev => Math.min(prev + 1, 3));
        }
    };

    // Handle previous step
    const handlePrevStep = () => {
        setFormStep(prev => Math.max(prev - 1, 1));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        const roomData = {
            ...formData,
            isAvailable: true,
            price: parseFloat(formData.price),
            maxGuests: parseInt(formData.maxGuests),
            createdAt: new Date().toISOString()
        };

        try {
            await dispatch(addRoomAsync(roomData));
            navigate('/rooms');
        } catch (error) {
            console.error('Add room error:', error);
        }
    };

    const amenityIcons = {
        'WiFi': <FaWifi className="me-2" />,
        'TV': <FaTv className="me-2" />,
        'AC': <FaSnowflake className="me-2" />,
        'Breakfast': <FaCoffee className="me-2" />,
        'Parking': <FaCar className="me-2" />,
        'default': <FaCheck className="me-2" />
    };

    return (
        <div className="add-room-form-container">
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
                                    {step === 1 && 'Basic Info'}
                                    {step === 2 && 'Amenities'}
                                    {step === 3 && 'Review'}
                                </div>
                                {step < 3 && (
                                    <div className={`step-line ${formStep > step ? 'active' : ''}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {errorMsg && (
                <Alert variant="danger" className="border-0 shadow-sm mb-4">
                    <Alert.Heading className="d-flex align-items-center">
                        <FaTimes className="me-2" />
                        Error Adding Room
                    </Alert.Heading>
                    <p className="mb-0">{errorMsg}</p>
                </Alert>
            )}

            <Form onSubmit={handleSubmit} id="add-room-form">
                {/* Step 1: Basic Information */}
                {formStep === 1 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaBed className="me-2" />
                                Basic Room Information
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
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
                                                placeholder="101, 202, etc."
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
                                            className="form-select-lg"
                                        >
                                            {roomTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.icon} {type.label} ({type.capacity})
                                                </option>
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
                                                placeholder="99.99"
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
                                                onChange={handleNumberChange}
                                                required
                                                min="1"
                                                max="10"
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
                                            placeholder="Describe the room features, view, special characteristics..."
                                            className="resize-none"
                                        />
                                        <Form.Text className="text-muted">
                                            Provide a compelling description to attract guests
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}

                {/* Step 2: Amenities */}
                {formStep === 2 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-info text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaListAlt className="me-2" />
                                Room Amenities
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
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
                                <h6 className="fw-bold mb-3">Add Custom Amenities</h6>
                                <div className="d-flex mb-3">
                                    <Form.Control
                                        type="text"
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        placeholder="Type custom amenity and press Enter"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                    />
                                    <Button
                                        variant="outline-info"
                                        onClick={handleAddAmenity}
                                        className="ms-2"
                                    >
                                        <FaPlus className="me-1" />
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
                                                >
                                                    <FaTimes />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Amenity Progress */}
                            <div className="mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">Amenity Coverage</small>
                                    <small className="fw-bold">
                                        {formData.amenities.length} / {popularAmenities.length} selected
                                    </small>
                                </div>
                                <ProgressBar
                                    now={(formData.amenities.length / popularAmenities.length) * 100}
                                    variant="info"
                                    className="mb-0"
                                    style={{ height: '6px' }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                )}

                {/* Step 3: Review & Submit */}
                {formStep === 3 && (
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-success text-white border-0 py-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaCheck className="me-2" />
                                Review & Submit
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={6}>
                                    <Card className="border border-success">
                                        <Card.Header className="bg-success bg-opacity-10 border-success">
                                            <h6 className="fw-bold mb-0">Room Summary</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <small className="text-muted d-block">ROOM NUMBER</small>
                                                <strong className="fs-5">#{formData.roomNumber}</strong>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted d-block">ROOM TYPE</small>
                                                <strong className="fs-5">
                                                    {roomTypes.find(t => t.value === formData.type)?.icon} {formData.type}
                                                </strong>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted d-block">PRICE PER NIGHT</small>
                                                <strong className="fs-4 text-success">${formData.price}</strong>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted d-block">MAX GUESTS</small>
                                                <strong className="fs-5">{formData.maxGuests} guests</strong>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col md={6}>
                                    <Card className="border border-info">
                                        <Card.Header className="bg-info bg-opacity-10 border-info">
                                            <h6 className="fw-bold mb-0">Amenities Preview</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            {formData.amenities.length > 0 ? (
                                                <div className="row g-2">
                                                    {formData.amenities.map((amenity, index) => (
                                                        <Col key={index} xs={6}>
                                                            <div className="bg-light p-2 rounded text-center small">
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
                                            <div className="mt-3 text-center">
                                                <Badge bg="info">
                                                    {formData.amenities.length} amenities included
                                                </Badge>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Description Preview */}
                            {formData.description && (
                                <Card className="border border-warning mt-4">
                                    <Card.Header className="bg-warning bg-opacity-10 border-warning">
                                        <h6 className="fw-bold mb-0">Description Preview</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="mb-0">{formData.description}</p>
                                    </Card.Body>
                                </Card>
                            )}
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
                            Continue to {formStep === 1 ? 'Amenities' : 'Review'}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="success"
                            disabled={isLoading}
                            className="px-5"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Adding Room...
                                </>
                            ) : (
                                <>
                                    <FaSave className="me-2" />
                                    Create Room
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AddRoomForm;