import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import { getAllReservationsAsync } from '../../Services/Actions/ReservationActions';
import { FaHotel, FaBed, FaCalendarCheck, FaStar, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const dispatch = useDispatch();
    const { rooms } = useSelector(state => state.rooms);
    const { reservations } = useSelector(state => state.reservations);

    useEffect(() => {
        dispatch(getAllRoomsAsync());
        dispatch(getAllReservationsAsync());
    }, [dispatch]);

    const availableRooms = rooms?.filter(room => room.isAvailable)?.length || 0;
    const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe'];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="mb-5">
                <div
                    className="rounded-4 overflow-hidden position-relative"
                    style={{
                        background: 'linear-gradient(rgba(26, 35, 126, 0.9), rgba(57, 73, 171, 0.9)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '500px'
                    }}
                >
                    <Container className="py-5">
                        <Row className="align-items-center min-vh-70">
                            <Col lg={8} className="mx-auto text-center text-white">
                                <Badge pill bg="warning" className="mb-3 px-3 py-2 fs-6">
                                    🏆 Luxury Hotel Experience
                                </Badge>
                                <h1 className="display-4 fw-bold mb-4">
                                    Welcome to <span className="text-warning">LuxuryStay</span>
                                </h1>
                                <p className="lead mb-5 opacity-90">
                                    Experience unparalleled luxury and comfort. Our premium hotel offers
                                    world-class amenities, exquisite rooms, and exceptional service for
                                    an unforgettable stay.
                                </p>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <Button
                                        as={Link}
                                        to="/rooms"
                                        variant="light"
                                        size="lg"
                                        className="px-5 py-3 fw-bold"
                                    >
                                        <FaBed className="me-2" />
                                        View Rooms
                                        <FaArrowRight className="ms-2" />
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/reservations/new"
                                        variant="outline-light"
                                        size="lg"
                                        className="px-5 py-3 fw-bold"
                                    >
                                        <FaCalendarCheck className="me-2" />
                                        Book Now
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>

            {/* Stats Section */}
            <section className="mb-5">
                <Container>
                    <Row className="g-4">
                        <Col md={3} sm={6}>
                            <Card className="border-0 shadow-sm text-center h-100 hover-lift">
                                <Card.Body className="p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <FaHotel size={30} className="text-primary" />
                                    </div>
                                    <h2 className="display-6 fw-bold text-primary mb-2">{rooms?.length || 0}</h2>
                                    <p className="text-muted mb-0 fw-medium">Total Rooms</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6}>
                            <Card className="border-0 shadow-sm text-center h-100 hover-lift">
                                <Card.Body className="p-4">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <FaBed size={30} className="text-success" />
                                    </div>
                                    <h2 className="display-6 fw-bold text-success mb-2">{availableRooms}</h2>
                                    <p className="text-muted mb-0 fw-medium">Available Now</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6}>
                            <Card className="border-0 shadow-sm text-center h-100 hover-lift">
                                <Card.Body className="p-4">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <FaCalendarCheck size={30} className="text-warning" />
                                    </div>
                                    <h2 className="display-6 fw-bold text-warning mb-2">{reservations?.length || 0}</h2>
                                    <p className="text-muted mb-0 fw-medium">Total Bookings</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6}>
                            <Card className="border-0 shadow-sm text-center h-100 hover-lift">
                                <Card.Body className="p-4">
                                    <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                                        <FaStar size={30} className="text-info" />
                                    </div>
                                    <h2 className="display-6 fw-bold text-info mb-2">4.8/5</h2>
                                    <p className="text-muted mb-0 fw-medium">Guest Rating</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Room Types */}
            <section className="mb-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">Our Room Types</h2>
                        <p className="text-muted">Choose from our variety of luxurious accommodations</p>
                    </div>

                    <Row className="g-4">
                        {roomTypes.map((type) => {
                            const count = rooms?.filter(r => r.type === type)?.length || 0;
                            return (
                                <Col key={type} lg={3} md={6}>
                                    <Card className="border-0 shadow-sm h-100 hover-lift">
                                        <Card.Body className="text-center p-4">
                                            <div className={`rounded-circle p-3 mb-3 d-inline-flex ${type === 'Single' ? 'bg-primary bg-opacity-10' :
                                                    type === 'Double' ? 'bg-success bg-opacity-10' :
                                                        type === 'Suite' ? 'bg-warning bg-opacity-10' :
                                                            'bg-info bg-opacity-10'
                                                }`}>
                                                <FaBed size={40} className={
                                                    type === 'Single' ? 'text-primary' :
                                                        type === 'Double' ? 'text-success' :
                                                            type === 'Suite' ? 'text-warning' :
                                                                'text-info'
                                                } />
                                            </div>
                                            <h4 className="fw-bold mb-2">{type}</h4>
                                            <Badge
                                                bg={
                                                    type === 'Single' ? 'primary' :
                                                        type === 'Double' ? 'success' :
                                                            type === 'Suite' ? 'warning' :
                                                                'info'
                                                }
                                                className="mb-3"
                                            >
                                                {count} Available
                                            </Badge>
                                            <p className="text-muted small mb-3">
                                                {type === 'Single' && 'Perfect for solo travelers'}
                                                {type === 'Double' && 'Ideal for couples'}
                                                {type === 'Suite' && 'Luxury living experience'}
                                                {type === 'Deluxe' && 'Premium accommodations'}
                                            </p>
                                            <Button
                                                as={Link}
                                                to={`/rooms?type=${type}`}
                                                variant="outline-primary"
                                                size="sm"
                                                className="w-100"
                                            >
                                                View {type} Rooms
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>

            {/* Call to Action */}
            <section>
                <div
                    className="rounded-4 overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #3949ab, #283593)',
                        padding: '4rem 0'
                    }}
                >
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={8}>
                                <h2 className="text-white fw-bold mb-3">Ready for an Unforgettable Stay?</h2>
                                <p className="text-white opacity-90 mb-0">
                                    Book your luxury room now and experience world-class hospitality.
                                </p>
                            </Col>
                            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
                                <Button
                                    as={Link}
                                    to="/reservations/new"
                                    variant="light"
                                    size="lg"
                                    className="fw-bold px-5"
                                >
                                    Book Your Stay
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
        </div>
    );
};

export default Home;