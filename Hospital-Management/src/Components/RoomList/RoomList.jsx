import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import RoomCard from '../RoomCard/RoomCard';
import { Row, Col, Spinner, Alert, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSortAmountDown, FaEye, FaEyeSlash } from 'react-icons/fa';

const RoomList = () => {
    const dispatch = useDispatch();
    const { rooms, isLoading, errorMsg } = useSelector(state => state.rooms);

    // Data should be fetched by parent page (RoomsPage); avoid duplicate calls here.

    const availableRooms = rooms?.filter(room => room.isAvailable)?.length || 0;
    const bookedRooms = rooms?.filter(room => !room.isAvailable)?.length || 0;
    const roomTypes = [...new Set(rooms?.map(room => room.type) || [])];

    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading luxury rooms...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="danger" className="border-0 shadow-sm">
                <Alert.Heading className="d-flex align-items-center">
                    <span className="me-2">❌</span>
                    Unable to Load Rooms
                </Alert.Heading>
                <p>{errorMsg}</p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => dispatch(getAllRoomsAsync())}
                    >
                        Try Again
                    </Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="room-list-container">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">All Rooms</h2>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <Badge bg="light" text="dark" className="px-3 py-2">
                            <FaEye className="me-1" />
                            {rooms.length} Total
                        </Badge>
                        <Badge bg="success" className="px-3 py-2">
                            <FaEye className="me-1" />
                            {availableRooms} Available
                        </Badge>
                        <Badge bg="secondary" className="px-3 py-2">
                            <FaEyeSlash className="me-1" />
                            {bookedRooms} Booked
                        </Badge>
                        {roomTypes.length > 0 && (
                            <Badge bg="info" className="px-3 py-2">
                                <FaFilter className="me-1" />
                                {roomTypes.length} Types
                            </Badge>
                        )}
                    </div>
                </div>
                <Button
                    as={Link}
                    to="/rooms/add"
                    variant="primary"
                    className="mt-3 mt-md-0 px-4 shadow"
                >
                    <FaPlus className="me-2" />
                    Add New Room
                </Button>
            </div>

            {/* Empty State */}
            {rooms.length === 0 ? (
                <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                        <div className="display-1 text-muted mb-4">🏨</div>
                        <h3 className="fw-bold mb-3">No Rooms Available</h3>
                        <p className="text-muted mb-4">
                            Start by adding your first room to the hotel management system.
                        </p>
                        <Button
                            as={Link}
                            to="/rooms/add"
                            variant="primary"
                            size="lg"
                            className="px-5"
                        >
                            <FaPlus className="me-2" />
                            Add Your First Room
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {/* Grid Layout Toggle */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <small className="text-muted">
                                Showing <strong>{rooms.length}</strong> room{rooms.length !== 1 ? 's' : ''}
                            </small>
                        </div>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled
                            >
                                <FaSortAmountDown className="me-1" />
                                Sort
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled
                            >
                                <FaFilter className="me-1" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    <Row className="g-4">
                        {rooms.map(room => (
                            <Col key={room.id} xl={4} lg={6} md={6} className="mb-4">
                                <RoomCard room={room} />
                            </Col>
                        ))}
                    </Row>

                    {/* Footer Stats */}
                    <Card className="border-0 bg-light mt-4">
                        <Card.Body className="p-3">
                            <Row className="text-center">
                                <Col md={4} className="border-end">
                                    <small className="text-muted d-block">AVERAGE PRICE</small>
                                    <strong className="text-primary">
                                        ${(rooms.reduce((sum, room) => sum + (room.price || 0), 0) / rooms.length).toFixed(2)}
                                    </strong>
                                </Col>
                                <Col md={4} className="border-end">
                                    <small className="text-muted d-block">OCCUPANCY RATE</small>
                                    <strong className={availableRooms === 0 ? 'text-danger' : 'text-success'}>
                                        {((availableRooms / rooms.length) * 100).toFixed(1)}%
                                    </strong>
                                </Col>
                                <Col md={4}>
                                    <small className="text-muted d-block">TOTAL VALUE</small>
                                    <strong className="text-warning">
                                        ${rooms.reduce((sum, room) => sum + (room.price || 0), 0)}
                                    </strong>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
            )}
        </div>
    );
};

export default RoomList;