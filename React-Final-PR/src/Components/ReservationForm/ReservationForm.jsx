import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { addReservationAsync } from '../../Services/Actions/ReservationActions';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';

const ReservationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Get query parameters
    const queryParams = new URLSearchParams(location.search);
    const roomIdFromUrl = queryParams.get('roomId');

    // Get rooms from Redux store
    const { rooms } = useSelector(state => state.rooms);
    const { isLoading, errorMsg } = useSelector(state => state.reservations);

    // Form state
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

    // Selected room details
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Fetch rooms on component mount
    useEffect(() => {
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    // Update selected room when roomId changes
    useEffect(() => {
        if (formData.roomId && rooms.length > 0) {
            const room = rooms.find(r => r.id === formData.roomId);
            setSelectedRoom(room);
        }
    }, [formData.roomId, rooms]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Calculate total price
    const calculateTotal = () => {
        if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0;

        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        return nights * selectedRoom.price;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const today = new Date();

        if (checkIn < today) {
            alert('Check-in date cannot be in the past');
            return;
        }

        if (checkOut <= checkIn) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Create reservation object
        const reservationData = {
            ...formData,
            totalPrice: calculateTotal(),
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Dispatch action to add reservation
        try {
            await dispatch(addReservationAsync(reservationData));
            alert('Reservation created successfully!');
            navigate('/reservations');
        } catch (error) {
            alert('Error creating reservation: ' + error.message);
        }
    };

    // Get available rooms
    const availableRooms = rooms.filter(room => room.isAvailable);

    return (
        <Form onSubmit={handleSubmit}>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <h4 className="mb-3">Guest Information</h4>
            <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                    placeholder="Enter guest name"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email Address *</Form.Label>
                <Form.Control
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                />
            </Form.Group>

            <hr className="my-4" />
            <h4 className="mb-3">Booking Details</h4>

            <Form.Group className="mb-3">
                <Form.Label>Select Room *</Form.Label>
                <Form.Select
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    required
                    disabled={roomIdFromUrl}
                >
                    <option value="">Choose a room...</option>
                    {availableRooms.map(room => (
                        <option key={room.id} value={room.id}>
                            Room {room.roomNumber} - {room.type} (${room.price}/night)
                        </option>
                    ))}
                </Form.Select>
                {roomIdFromUrl && (
                    <Form.Text className="text-muted">
                        Pre-selected room from booking
                    </Form.Text>
                )}
            </Form.Group>

            {selectedRoom && (
                <Card className="mb-3">
                    <Card.Body>
                        <h6>Selected Room Details:</h6>
                        <p className="mb-1"><strong>Room:</strong> {selectedRoom.roomNumber}</p>
                        <p className="mb-1"><strong>Type:</strong> {selectedRoom.type}</p>
                        <p className="mb-1"><strong>Price:</strong> ${selectedRoom.price}/night</p>
                        <p className="mb-1"><strong>Capacity:</strong> {selectedRoom.maxGuests} guests</p>
                        <p className="mb-0"><strong>Amenities:</strong> {selectedRoom.amenities?.join(', ')}</p>
                    </Card.Body>
                </Card>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Number of Guests *</Form.Label>
                <Form.Control
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    min="1"
                    max={selectedRoom?.maxGuests || 10}
                    required
                />
                {selectedRoom && (
                    <Form.Text className="text-muted">
                        Maximum capacity: {selectedRoom.maxGuests} guests
                    </Form.Text>
                )}
            </Form.Group>

            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Check-in Date *</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Check-out Date *</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>
                </div>
            </div>

            {formData.checkIn && formData.checkOut && selectedRoom && (
                <Alert variant="info">
                    <strong>Price Calculation:</strong><br />
                    {selectedRoom.price} × {calculateTotal() / selectedRoom.price} nights =
                    <strong> ${calculateTotal()}</strong>
                </Alert>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Special Requests</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or notes..."
                />
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || !formData.roomId}
                >
                    {isLoading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Processing...
                        </>
                    ) : (
                        'Create Reservation'
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default ReservationForm;