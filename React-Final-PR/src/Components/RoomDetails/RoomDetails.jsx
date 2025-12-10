import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { getRoomAsync, deleteRoomAsync } from '../../Services/Actions/RoomActions';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get room from Redux store
    const { room, isLoading, errorMsg } = useSelector(state => state.rooms);

    // Fetch room details on component mount
    useEffect(() => {
        if (id) {
            dispatch(getRoomAsync(id));
        }
    }, [dispatch, id]);

    // Handle delete room
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            dispatch(deleteRoomAsync(id))
                .then(() => {
                    alert('Room deleted successfully!');
                    navigate('/rooms');
                })
                .catch(error => {
                    alert('Error deleting room: ' + error.message);
                });
        }
    };

    // Handle edit room
    const handleEdit = () => {
        navigate(`/rooms/edit/${id}`);
    };

    // Handle book room
    const handleBook = () => {
        navigate(`/reservations/new?roomId=${id}`);
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading room details...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="danger" className="mt-4">
                Error: {errorMsg}
                <div className="mt-2">
                    <Button variant="secondary" onClick={() => navigate('/rooms')}>
                        Back to Rooms
                    </Button>
                </div>
            </Alert>
        );
    }

    if (!room) {
        return (
            <Alert variant="warning" className="mt-4">
                Room not found!
                <div className="mt-2">
                    <Button variant="secondary" onClick={() => navigate('/rooms')}>
                        Back to Rooms
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="room-details">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Room Details</h2>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={() => navigate('/rooms')}>
                        ← Back to Rooms
                    </Button>
                </div>
            </div>

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <Card.Title className="mb-1">Room {room.roomNumber}</Card.Title>
                                    <Card.Subtitle className="text-muted mb-3">
                                        {room.type} Room • ${room.price}/night
                                    </Card.Subtitle>
                                </div>
                                <Badge bg={room.isAvailable ? "success" : "danger"} className="fs-6 p-2">
                                    {room.isAvailable ? "Available" : "Booked"}
                                </Badge>
                            </div>

                            {room.description && (
                                <Card.Text className="mb-4">
                                    <strong>Description:</strong> {room.description}
                                </Card.Text>
                            )}

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Body>
                                            <Card.Title>Room Information</Card.Title>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    <strong>Room Number:</strong> {room.roomNumber}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Room Type:</strong> {room.type}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Price:</strong> ${room.price}/night
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Max Guests:</strong> {room.maxGuests} guests
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Status:</strong>
                                                    <Badge bg={room.isAvailable ? "success" : "danger"} className="ms-2">
                                                        {room.isAvailable ? "Available" : "Not Available"}
                                                    </Badge>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="h-100">
                                        <Card.Body>
                                            <Card.Title>Amenities</Card.Title>
                                            {room.amenities && room.amenities.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {room.amenities.map((amenity, index) => (
                                                        <Badge key={index} bg="info" className="p-2">
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted">No amenities listed</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Reservation Actions</Card.Title>
                                    <div className="d-flex gap-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handleBook}
                                            disabled={!room.isAvailable}
                                        >
                                            {room.isAvailable ? 'Book This Room' : 'Not Available'}
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="lg"
                                            onClick={() => navigate(`/reservations?room=${room.id}`)}
                                        >
                                            View Reservations
                                        </Button>
                                    </div>
                                    {!room.isAvailable && (
                                        <Alert variant="warning" className="mt-3">
                                            This room is currently booked. Please check back later or choose another room.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Body>
                            <Card.Title>Room Actions</Card.Title>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="outline-primary"
                                    onClick={handleEdit}
                                    size="lg"
                                >
                                    ✏️ Edit Room Details
                                </Button>

                                <Button
                                    variant="outline-success"
                                    onClick={handleBook}
                                    disabled={!room.isAvailable}
                                    size="lg"
                                >
                                    📅 Make Reservation
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    onClick={handleDelete}
                                    size="lg"
                                >
                                    🗑️ Delete Room
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    onClick={() => navigate('/rooms')}
                                    size="lg"
                                >
                                    ← All Rooms
                                </Button>
                            </div>

                            <hr className="my-4" />

                            <Card.Text>
                                <small className="text-muted">
                                    <strong>Created:</strong> {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A'}<br />
                                    {room.updatedAt && (
                                        <>
                                            <strong>Last Updated:</strong> {new Date(room.updatedAt).toLocaleDateString()}
                                        </>
                                    )}
                                </small>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>Quick Stats</Card.Title>
                            <div className="text-center">
                                <h3>${room.price}</h3>
                                <p className="text-muted">per night</p>
                                <hr />
                                <p><strong>Capacity:</strong> {room.maxGuests} guests</p>
                                <p><strong>Type:</strong> {room.type}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RoomDetails;