import React from 'react';
import { Card } from 'react-bootstrap';
import ReservationForm from '../ReservationForm/ReservationForm';

const AddReservationPage = () => {
    return (
        <div>
            <h1 className="mb-4">Create New Reservation</h1>
            <Card>
                <Card.Body>
                    <ReservationForm />
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddReservationPage;