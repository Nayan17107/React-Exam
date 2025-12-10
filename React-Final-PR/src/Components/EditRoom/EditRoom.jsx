import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
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
    const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Family'];

    // Fetch room data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getRoomAsync(id));
        }
    }, [dispatch, id]);

    // Update form data when room is loaded
    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber || '',
                type: room.type || 'Single',
                price: room.price || '',
                maxGuests: room.maxGuests || 1,
                amenities: room.amenities || [],
                description: room.description || '',
                isAvailable: room.isAvailable !== undefined ? room.isAvailable : true
            });
        }
    }, [room]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else if (name === 'price' || name === 'maxGuests') {
            setFormData({
                ...formData,
                [name]: value === '' ? '' : parseFloat(value)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Add new amenity
    const handleAddAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, newAmenity.trim()]
            });
            setNewAmenity('');
        }
    };

    // Remove amenity
    const handleRemoveAmenity = (amenity) => {
        setFormData({
            ...formData,
            amenities: formData.amenities.filter(a => a !== amenity)
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.roomNumber || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

        const roomData = {
            ...formData,
            price: parseFloat(formData.price)
        };

        try {
            await dispatch(updateRoomAsync(id, roomData));
            alert('Room updated successfully!');
            navigate(`/rooms/${id}`);
        } catch (error) {
            alert('Error updating room: ' + error.message);
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
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Room: {room?.roomNumber}</h2>
                <Button variant="outline-secondary" onClick={() => navigate(`/rooms/${id}`)}>
                    ← Back to Room
                </Button>
            </div>

            <Card>
                <Card.Body>
                    {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <h4 className="mb-3">Edit Room Information</h4>

                        <Form.Group className="mb-3">
                            <Form.Label>Room Number *</Form.Label>
                            <Form.Control
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Room Type *</Form.Label>
                            <Form.Select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                {roomTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
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
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
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
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Amenities</Form.Label>
                            <div className="d-flex mb-2">
                                <Form.Control
                                    type="text"
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    placeholder="Add amenity (e.g., WiFi, TV, AC)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleAddAmenity}
                                    className="ms-2"
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
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="availability-switch"
                                label="Room Available for Booking"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/rooms/${id}`)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" /> Updating...
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