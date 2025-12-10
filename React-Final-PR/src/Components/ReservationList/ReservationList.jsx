import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReservationsAsync } from '../../Services/Actions/ReservationActions';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import { Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { format } from 'date-fns';

const ReservationList = () => {
    const dispatch = useDispatch();

    // Get data from Redux store
    const { reservations, isLoading, errorMsg } = useSelector(state => state.reservations);
    const { rooms } = useSelector(state => state.rooms);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(getAllReservationsAsync());
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    // Get room details by ID
    const getRoomDetails = (roomId) => {
        return rooms.find(room => room.id === roomId);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'cancelled':
                return 'danger';
            case 'checked-in':
                return 'primary';
            case 'checked-out':
                return 'secondary';
            default:
                return 'warning';
        }
    };

    // Handle cancel reservation
    const handleCancel = (reservationId, roomId) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            // Dispatch cancel action (we'll create this later)
            console.log('Cancel reservation:', reservationId);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading reservations...</p>
            </div>
        );
    }

    if (errorMsg) {
        return <Alert variant="danger">Error: {errorMsg}</Alert>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Reservations</h2>
                <Button variant="success" href="/reservations/new">
                    + New Reservation
                </Button>
            </div>

            {reservations.length === 0 ? (
                <Alert variant="info">
                    No reservations found. Create your first reservation!
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Guest Name</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res, index) => {
                                const room = getRoomDetails(res.roomId);
                                return (
                                    <tr key={res.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div>{res.guestName}</div>
                                            <small className="text-muted">{res.guestEmail}</small>
                                        </td>
                                        <td>
                                            {room ? (
                                                <>
                                                    Room {room.roomNumber}
                                                    <br />
                                                    <small className="text-muted">{room.type}</small>
                                                </>
                                            ) : (
                                                'Room not found'
                                            )}
                                        </td>
                                        <td>{formatDate(res.checkIn)}</td>
                                        <td>{formatDate(res.checkOut)}</td>
                                        <td>
                                            <Badge bg={getStatusBadge(res.status)}>
                                                {res.status}
                                            </Badge>
                                        </td>
                                        <td>${res.totalPrice || 'N/A'}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    href={`/reservations/${res.id}`}
                                                >
                                                    View
                                                </Button>
                                                {res.status === 'confirmed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleCancel(res.id, res.roomId)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default ReservationList;