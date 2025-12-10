import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>Room {room.roomNumber}</Card.Title>
                    <Badge bg={room.isAvailable ? "success" : "danger"}>
                        {room.isAvailable ? "Available" : "Booked"}
                    </Badge>
                </div>

                <Card.Subtitle className="mb-2 text-muted">
                    {room.type} Room
                </Card.Subtitle>

                <Card.Text>
                    <strong>Price:</strong> ${room.price}/night<br />
                    <strong>Capacity:</strong> {room.maxGuests} guests<br />
                    <strong>Amenities:</strong> {room.amenities?.join(', ')}
                </Card.Text>

                <div className="d-flex justify-content-between">
                    <Button
                        as={Link}
                        to={`/rooms/${room.id}`}
                        variant="outline-primary"
                        size="sm"
                    >
                        View Details
                    </Button>

                    <Button
                        as={Link}
                        to={`/reservations/new?roomId=${room.id}`}
                        variant="primary"
                        size="sm"
                        disabled={!room.isAvailable}
                    >
                        Book Now
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RoomCard;