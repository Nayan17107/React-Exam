import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import RoomList from '../../Components/RoomList/RoomList';
import { FaPlus, FaBed, FaTag, FaUsers, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Rooms = () => {
    const dispatch = useDispatch();
    const { rooms = [], isLoading, errorMsg } = useSelector(state => state.rooms);
    const { user, isAuthenticated } = useSelector(state => state.auth);
    useEffect(() => {
        // load rooms on mount
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(getAllRoomsAsync());
    };

    const totalRooms = rooms?.length || 0;
    const availableRooms = rooms?.filter(room => room?.isAvailable)?.length || 0;
    const roomTypes = [...new Set(rooms?.map(room => room?.type) || [])].length;
    const totalValue = rooms?.reduce((sum, room) => sum + (room?.price || 0), 0) || 0;
    const formattedTotalValue = totalValue.toLocaleString();
    const showEmptyState = !isLoading && rooms.length === 0 && !errorMsg;

    return (
        <Container className="rooms-page mt-5">
            {/* Page Header with Stats */}
            <div className="mb-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                    <div>
                        <h1 className="fw-bold display-5 mb-4">Room Management</h1>
                        <p className="text-muted mb-0">
                            Manage and view all hotel rooms in one place
                        </p>
                    </div>
                    <div className="d-flex gap-2 mt-3 mt-md-0">
                        <Button
                            variant="outline-secondary"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="d-flex align-items-center"
                        >
                            <FaSync className={`me-2 ${isLoading ? 'fa-spin' : ''}`} />
                            Refresh
                        </Button>
                        {isAuthenticated && user?.role === 'admin' && (
                            <Button
                                as={Link}
                                to="/rooms/add"
                                variant="primary"
                                size="lg"
                                className="px-4 py-2 shadow"
                            >
                                <FaPlus className="me-2" />
                                Add New Room
                            </Button>
                        )} 
                    </div>
                </div>

                {/* Stats Cards - Show even when loading */}
                <Row className="g-4 mb-4">
                    <Col xl={3} lg={6} md={6}>
                        <Card className="border-0 shadow-sm h-100 hover-lift">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        <FaBed size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-1">
                                            {isLoading ? '...' : totalRooms}
                                        </h2>
                                        <p className="text-muted mb-0">Total Rooms</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6}>
                        <Card className="border-0 shadow-sm h-100 hover-lift">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                        <FaBed size={24} className="text-success" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-1">
                                            {isLoading ? '...' : availableRooms}
                                        </h2>
                                        <p className="text-muted mb-0">Available Now</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6}>
                        <Card className="border-0 shadow-sm h-100 hover-lift">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                        <FaTag size={24} className="text-info" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-1">
                                            {isLoading ? '...' : roomTypes}
                                        </h2>
                                        <p className="text-muted mb-0">Room Types</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xl={3} lg={6} md={6}>
                        <Card className="border-0 shadow-sm h-100 hover-lift">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                        <FaUsers size={24} className="text-warning" />
                                    </div>
                                    <div>
                                        <h2 className="fw-bold mb-1">
                                            {isLoading ? '...' : `$${formattedTotalValue}`}
                                        </h2>
                                        <p className="text-muted mb-0">Total Value</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
                            <div>
                                <h5 className="fw-bold mb-2">Quick Actions</h5>
                                <p className="text-muted mb-0">
                                    Manage your hotel rooms efficiently
                                </p>
                            </div>
                            <div className="d-flex gap-2 mt-3 mt-sm-0">
                                {user?.role === 'admin' && (
                                    <Button
                                        as={Link}
                                        to="/rooms/add"
                                        variant="outline-primary"
                                        disabled={isLoading}
                                    >
                                        <FaPlus className="me-2" />
                                        Add Room
                                    </Button>
                                )}
                                {!isLoading && availableRooms > 0 && (
                                    <Badge bg="success" className="px-3 py-2 align-self-center">
                                        {availableRooms} {availableRooms === 1 ? 'room' : 'rooms'} ready to book
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Room List Component */}
            <div className="mt-4">
                {isLoading && rooms.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" aria-label="Loading rooms">
                            <span className="visually-hidden">Loading rooms...</span>
                        </div>
                        <p className="mt-3" aria-live="polite">Loading rooms...</p>
                    </div>
                ) : errorMsg ? (
                    <Alert variant="danger">
                        <Alert.Heading>Error Loading Rooms</Alert.Heading>
                        <p>{errorMsg}</p>
                        <Button
                            variant="outline-danger"
                            onClick={handleRefresh}
                            disabled={isLoading}
                        >
                            Retry
                        </Button>
                    </Alert>
                ) : showEmptyState ? (
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center py-5">
                            <h4 className="text-muted mb-3">No Rooms Found</h4>
                            <p className="mb-4">Add your first room to get started!</p>
                            {isAuthenticated && user?.role === 'admin' ? (
                                <Button
                                    as={Link}
                                    to="/rooms/add"
                                    variant="primary"
                                    size="lg"
                                >
                                    <FaPlus className="me-2" />
                                    Add Your First Room
                                </Button>
                            ) : (
                                <Button as={Link} to="/register" variant="outline-primary">Create Admin Account</Button>
                            )}
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">
                                All Rooms ({rooms.length})
                            </h5>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <FaSync className={`me-1 ${isLoading ? 'fa-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                        <RoomList />
                    </>
                )}
            </div>
        </Container>
    );
};

export default Rooms;