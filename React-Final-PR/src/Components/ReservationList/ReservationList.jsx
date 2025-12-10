// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllReservationsAsync } from '../../Services/Actions/ReservationActions';
// import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
// import { Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
// import { format } from 'date-fns';

// const ReservationList = () => {
//     const dispatch = useDispatch();

//     // Get data from Redux store
//     const { reservations, isLoading, errorMsg } = useSelector(state => state.reservations);
//     const { rooms } = useSelector(state => state.rooms);

//     // Fetch data on component mount
//     useEffect(() => {
//         dispatch(getAllReservationsAsync());
//         dispatch(getAllRoomsAsync());
//     }, [dispatch]);

//     // Get room details by ID
//     const getRoomDetails = (roomId) => {
//         return rooms.find(room => room.id === roomId);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return format(new Date(dateString), 'MMM dd, yyyy');
//     };

//     // Get status badge color
//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'confirmed':
//                 return 'success';
//             case 'cancelled':
//                 return 'danger';
//             case 'checked-in':
//                 return 'primary';
//             case 'checked-out':
//                 return 'secondary';
//             default:
//                 return 'warning';
//         }
//     };

//     // Handle cancel reservation
//     const handleCancel = (reservationId, roomId) => {
//         if (window.confirm('Are you sure you want to cancel this reservation?')) {
//             // Dispatch cancel action (we'll create this later)
//             console.log('Cancel reservation:', reservationId);
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="text-center mt-5">
//                 <Spinner animation="border" variant="primary" />
//                 <p>Loading reservations...</p>
//             </div>
//         );
//     }

//     if (errorMsg) {
//         return <Alert variant="danger">Error: {errorMsg}</Alert>;
//     }

//     return (
//         <div>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2>Reservations</h2>
//                 <Button variant="success" href="/reservations/new">
//                     + New Reservation
//                 </Button>
//             </div>

//             {reservations.length === 0 ? (
//                 <Alert variant="info">
//                     No reservations found. Create your first reservation!
//                 </Alert>
//             ) : (
//                 <div className="table-responsive">
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Guest Name</th>
//                                 <th>Room</th>
//                                 <th>Check-in</th>
//                                 <th>Check-out</th>
//                                 <th>Status</th>
//                                 <th>Total</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reservations.map((res, index) => {
//                                 const room = getRoomDetails(res.roomId);
//                                 return (
//                                     <tr key={res.id}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <div>{res.guestName}</div>
//                                             <small className="text-muted">{res.guestEmail}</small>
//                                         </td>
//                                         <td>
//                                             {room ? (
//                                                 <>
//                                                     Room {room.roomNumber}
//                                                     <br />
//                                                     <small className="text-muted">{room.type}</small>
//                                                 </>
//                                             ) : (
//                                                 'Room not found'
//                                             )}
//                                         </td>
//                                         <td>{formatDate(res.checkIn)}</td>
//                                         <td>{formatDate(res.checkOut)}</td>
//                                         <td>
//                                             <Badge bg={getStatusBadge(res.status)}>
//                                                 {res.status}
//                                             </Badge>
//                                         </td>
//                                         <td>${res.totalPrice || 'N/A'}</td>
//                                         <td>
//                                             <div className="d-flex gap-2">
//                                                 <Button
//                                                     size="sm"
//                                                     variant="outline-primary"
//                                                     href={`/reservations/${res.id}`}
//                                                 >
//                                                     View
//                                                 </Button>
//                                                 {res.status === 'confirmed' && (
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline-danger"
//                                                         onClick={() => handleCancel(res.id, res.roomId)}
//                                                     >
//                                                         Cancel
//                                                     </Button>
//                                                 )}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </Table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReservationList;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllReservationsAsync,
    deleteReservationAsync
} from '../../Services/Actions/ReservationActions';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import { Table, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { format } from 'date-fns';

const ReservationList = () => {
    const dispatch = useDispatch();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    // Get data from Redux store
    const { reservations, isLoading, errorMsg } = useSelector(state => state.reservations);
    const { rooms } = useSelector(state => state.rooms);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(getAllReservationsAsync());
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    // Filter reservations to only show those with valid rooms
    const validReservations = reservations.filter(reservation => {
        const room = rooms.find(room => room.id === reservation.roomId);
        return room !== undefined; // Only keep reservations with existing rooms
    });

    const deletedRoomReservations = reservations.filter(reservation => {
        const room = rooms.find(room => room.id === reservation.roomId);
        return room === undefined; // Reservations for deleted rooms
    });

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

    // NEW VERSION (actually calls the action):
    const handleCancelClick = (reservation) => {
        setSelectedReservation(reservation);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (selectedReservation) {
            try {
                // ACTUALLY CALL THE DELETE ACTION
                await dispatch(deleteReservationAsync(
                    selectedReservation.id,
                    selectedReservation.roomId
                ));
                alert('Reservation cancelled successfully!');
                setShowCancelModal(false);
                setSelectedReservation(null);

                // Refresh the reservations list
                dispatch(getAllReservationsAsync());
            } catch (error) {
                alert('Error cancelling reservation: ' + error.message);
            }
        }
    };

    const handleDeleteStaleReservation = async (reservationId) => {
        if (window.confirm('Delete this orphan reservation?')) {
            try {
                await dispatch(deleteReservationAsync(reservationId, null));
                alert('Orphan reservation deleted!');
                dispatch(getAllReservationsAsync());
            } catch (error) {
                alert('Error: ' + error.message);
            }
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

            {/* Show warning for deleted room reservations */}
            {deletedRoomReservations.length > 0 && (
                <Alert variant="warning" className="mb-3">
                    <strong>Warning:</strong> {deletedRoomReservations.length} reservation(s) are linked to deleted rooms.
                    <div className="mt-2">
                        {deletedRoomReservations.map(res => (
                            <Badge key={res.id} bg="warning" className="me-2 mb-1">
                                {res.guestName} - Room ID: {res.roomId}
                                <Button
                                    variant="link"
                                    className="text-dark p-0 ms-1"
                                    size="sm"
                                    onClick={() => handleDeleteStaleReservation(res.id)}
                                >
                                    ×
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </Alert>
            )}

            {validReservations.length === 0 ? (
                <Alert variant="info">
                    No active reservations found. Create your first reservation!
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
                            {validReservations.map((res, index) => {
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
                                                <Badge bg="danger">Room Deleted</Badge>
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
                                                        onClick={() => handleCancelClick(res)}
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

            {/* Cancel Confirmation Modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Cancellation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <>
                            <p>Are you sure you want to cancel this reservation?</p>
                            <div className="alert alert-warning">
                                <strong>Guest:</strong> {selectedReservation.guestName}<br />
                                <strong>Check-in:</strong> {formatDate(selectedReservation.checkIn)}<br />
                                <strong>Check-out:</strong> {formatDate(selectedReservation.checkOut)}<br />
                                <strong>Total:</strong> ${selectedReservation.totalPrice || 'N/A'}
                            </div>
                            <p className="text-danger">
                                <small>This action cannot be undone. The room will become available again.</small>
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        No, Keep Reservation
                    </Button>
                    <Button variant="danger" onClick={confirmCancel}>
                        Yes, Cancel Reservation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReservationList;