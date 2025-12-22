import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReservationAsync, updateReservationAsync } from '../../Services/Actions/ReservationActions';
import { Card, Button, Alert, Spinner, Container } from 'react-bootstrap';

const PaymentPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reservation } = useSelector(state => state.reservations);
    const { user } = useSelector(state => state.auth);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!reservation || reservation.id !== id) {
            dispatch(getReservationAsync(id));
        }
    }, [dispatch, id, reservation]);

    const current = useSelector(state => state.reservations.reservation) || reservation;

    // Only reservation owner or admin can access this page
    useEffect(() => {
        if (current && user) {
            const isOwner = current.userId && user.uid && current.userId === user.uid;
            const isAdmin = user.role === 'admin';
            if (!isAdmin && !isOwner) {
                navigate('/');
            }
        }
    }, [current, user, navigate]);

    const handleSimulatePayment = async () => {
        setIsProcessing(true);
        try {
            await dispatch(updateReservationAsync(id, { status: 'confirmed', paidAt: new Date().toISOString() }));
            // navigate to reservations list after payment
            navigate('/reservations');
        } catch (err) {
            console.error('Payment simulation failed', err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!current) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container className="payment-page">
            <h2 className="mb-4">Complete Payment (Demo)</h2>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <h5 className="fw-bold mb-3">Reservation Summary</h5>
                    <p className="mb-1"><strong>Guest:</strong> {current.guestName}</p>
                    <p className="mb-1"><strong>Room ID:</strong> {current.roomId}</p>
                    <p className="mb-1"><strong>Check-in:</strong> {current.checkIn}</p>
                    <p className="mb-1"><strong>Check-out:</strong> {current.checkOut}</p>
                    <p className="mb-1"><strong>Total:</strong> ${current.totalPrice || '0'}</p>
                    <Alert variant="info" className="mt-3">
                        This is a static (non-functional) payment screen for demo purposes. Clicking "Simulate Payment" will mark the reservation as paid.
                    </Alert>
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="secondary" onClick={() => navigate('/reservations')}>Cancel</Button>
                        <Button variant="success" onClick={handleSimulatePayment} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Simulate Payment'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentPage;
