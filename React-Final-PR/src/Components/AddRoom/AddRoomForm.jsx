import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { addRoomAsync } from '../../Services/Actions/RoomActions';

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

    // Room type options
    const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Family'];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle number input changes
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value) || 0
        });
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
            isAvailable: true,
            price: parseFloat(formData.price),
            createdAt: new Date().toISOString()
        };

        try {
            await dispatch(addRoomAsync(roomData));
            alert('Room added successfully!');
            navigate('/rooms');
        } catch (error) {
            alert('Error adding room: ' + error.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <h4 className="mb-3">Room Information</h4>

            <Form.Group className="mb-3">
                <Form.Label>Room Number *</Form.Label>
                <Form.Control
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 101, 202, etc."
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
                            onChange={handleNumberChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="e.g., 99.99"
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
                            onChange={handleNumberChange}
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

            <div className="d-flex justify-content-between mt-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/rooms')}
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
                            <Spinner animation="border" size="sm" /> Adding...
                        </>
                    ) : (
                        'Add Room'
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default AddRoomForm;