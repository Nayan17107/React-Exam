import React from 'react';
import { Card, Button, Badge, ProgressBar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaBed,
    FaUsers,
    FaWifi,
    FaTv,
    FaCoffee,
    FaCar,
    FaSnowflake,
    FaShower,
    FaEye,
    FaCalendarPlus,
    FaStar
} from 'react-icons/fa';
import './RoomCard.css';

const RoomCard = ({ room }) => {
    const amenityIcons = {
        'WiFi': <FaWifi />,
        'TV': <FaTv />,
        'AC': <FaSnowflake />,
        'Breakfast': <FaCoffee />,
        'Parking': <FaCar />,
        'Shower': <FaShower />,
        'default': <FaStar />
    };

    const typeColors = {
        'Single': 'primary',
        'Double': 'success',
        'Suite': 'warning',
        'Deluxe': 'info',
        'default': 'secondary'
    };

    const roomTypeColor = typeColors[room.type] || typeColors.default;
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(room.price || 0);

    return (
        <Card className="border-0 shadow-sm h-100 hover-lift room-card">
            {/* Status Ribbon */}
            <div className={`room-status-ribbon ${room.isAvailable ? 'available' : 'booked'}`}>
                {room.isAvailable ? 'Available' : 'Booked'}
            </div>

            <Card.Body className="p-4 d-flex flex-column">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Badge
                            bg={roomTypeColor}
                            className="mb-2 px-3 py-2"
                            style={{ fontSize: '0.75rem' }}
                        >
                            <FaBed className="me-1" />
                            {room.type}
                        </Badge>
                        <Card.Title className="mb-1 fw-bold">
                            Room {room.roomNumber}
                        </Card.Title>
                        <Card.Subtitle className="text-muted small">
                            <FaUsers className="me-1" />
                            {room.maxGuests || 1} Guest{room.maxGuests > 1 ? 's' : ''}
                        </Card.Subtitle>
                    </div>

                    {/* Price Display */}
                    <div className="text-end">
                        <div className="display-6 fw-bold text-primary">
                            {formattedPrice}
                        </div>
                        <small className="text-muted">per night</small>
                    </div>
                </div>

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4">
                        <small className="text-muted d-block mb-2">AMENITIES</small>
                        <div className="d-flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map((amenity, index) => (
                                <OverlayTrigger
                                    key={index}
                                    placement="top"
                                    overlay={<Tooltip>{amenity}</Tooltip>}
                                >
                                    <Badge
                                        bg="light"
                                        text="dark"
                                        className="px-3 py-2 d-flex align-items-center"
                                    >
                                        {amenityIcons[amenity] || amenityIcons.default}
                                        <span className="ms-2">{amenity}</span>
                                    </Badge>
                                </OverlayTrigger>
                            ))}
                            {room.amenities.length > 4 && (
                                <Badge bg="secondary" className="px-3 py-2">
                                    +{room.amenities.length - 4} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                {room.description && (
                    <div className="mb-4">
                        <small className="text-muted d-block mb-2">DESCRIPTION</small>
                        <p className="small text-muted mb-0 room-description">
                            {room.description.length > 100
                                ? `${room.description.substring(0, 100)}...`
                                : room.description}
                        </p>
                    </div>
                )}

                {/* Availability Bar */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">AVAILABILITY</small>
                        <Badge bg={room.isAvailable ? "success" : "danger"} className="px-2 py-1">
                            {room.isAvailable ? 'READY TO BOOK' : 'OCCUPIED'}
                        </Badge>
                    </div>
                    <ProgressBar
                        now={room.isAvailable ? 100 : 0}
                        variant={room.isAvailable ? "success" : "danger"}
                        className="mb-0"
                        style={{ height: '6px', borderRadius: '3px' }}
                    />
                </div>

                {/* Actions */}
                <div className="mt-auto pt-3">
                    <div className="d-grid gap-2">
                        <Button
                            as={Link}
                            to={`/rooms/${room.id}`}
                            variant="outline-primary"
                            className="d-flex align-items-center justify-content-center"
                        >
                            <FaEye className="me-2" />
                            View Details
                        </Button>

                        <Button
                            as={Link}
                            to={`/reservations/new?roomId=${room.id}`}
                            variant={room.isAvailable ? "primary" : "secondary"}
                            className="d-flex align-items-center justify-content-center"
                            disabled={!room.isAvailable}
                        >
                            <FaCalendarPlus className="me-2" />
                            {room.isAvailable ? 'Book Now' : 'Not Available'}
                        </Button>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="mt-3 pt-3 border-top">
                    <div className="row text-center">
                        <div className="col-4">
                            <small className="text-muted d-block">TYPE</small>
                            <strong className="small">{room.type}</strong>
                        </div>
                        <div className="col-4 border-start border-end">
                            <small className="text-muted d-block">GUESTS</small>
                            <strong className="small">{room.maxGuests || 1}</strong>
                        </div>
                        <div className="col-4">
                            <small className="text-muted d-block">SIZE</small>
                            <strong className="small">
                                {room.type === 'Single' ? 'Small' :
                                    room.type === 'Double' ? 'Medium' :
                                        room.type === 'Suite' ? 'Large' : 'XL'}
                            </strong>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RoomCard;