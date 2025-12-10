import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card, Badge, Row, Col } from 'react-bootstrap';
import { getRoomAsync, updateRoomAsync } from '../../Services/Actions/RoomActions';

const EditRoom = () => {
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

    const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Family'];

    // Fetch room data
    useEffect(() => {
        if (id) {
            dispatch(getRoomAsync(id));
        }
    }, [dispatch, id]);

    // Update form when room loads
    useEffect(() => {
        if (room) {
            console.log("Room data loaded:", room);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                (name === 'price' || name === 'maxGuests') ?
                    (value === '' ? '' : name === 'price' ? parseFloat(value) : parseInt(value)) :
                    value
        }));
    };

    const handleAddAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()]
            }));
            setNewAmenity('');
        }
    };

    const handleRemoveAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.roomNumber || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

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

            console.log("Updating room with data:", roomData);

            await dispatch(updateRoomAsync(id, roomData));
            alert('Room updated successfully!');
            navigate(`/rooms/${id}`);
        } catch (error) {
            console.error("Update error:", error);
            alert('Error updating room: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !room) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading room details...</p>
            </div>
        );
    }

    return (
        <div className="edit-room-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Room: {room?.roomNumber || 'Loading...'}</h2>
                <Button variant="outline-secondary" onClick={() => navigate(`/rooms/${id}`)}>
                    ← Back to Room
                </Button>
            </div>

            <Card>
                <Card.Body>
                    {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Number *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room Type *</Form.Label>
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
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price per Night ($) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        disabled={isSubmitting}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Maximum Guests *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="maxGuests"
                                        value={formData.maxGuests}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="10"
                                        disabled={isSubmitting}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Amenities</Form.Label>
                            <div className="d-flex mb-2">
                                <Form.Control
                                    type="text"
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                    placeholder="Add amenity (e.g., WiFi, TV, AC)"
                                    disabled={isSubmitting}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleAddAmenity}
                                    className="ms-2"
                                    disabled={isSubmitting}
                                >
                                    Add
                                </Button>
                            </div>

                            {formData.amenities.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {formData.amenities.map((amenity, index) => (
                                        <Badge key={index} bg="info" className="p-2 d-flex align-items-center">
                                            {amenity}
                                            <Button
                                                variant="link"
                                                className="text-white p-0 ms-2"
                                                onClick={() => handleRemoveAmenity(amenity)}
                                                style={{ fontSize: '12px' }}
                                                disabled={isSubmitting}
                                            >
                                                ×
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Room description, features, etc."
                                disabled={isSubmitting}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Check
                                type="switch"
                                id="availability-switch"
                                label={
                                    <>
                                        Room Available for Booking
                                        <Badge bg={formData.isAvailable ? "success" : "danger"} className="ms-2">
                                            {formData.isAvailable ? "Available" : "Booked"}
                                        </Badge>
                                    </>
                                }
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/rooms/${id}`)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Room'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default EditRoom;