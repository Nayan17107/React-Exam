import React from 'react';
import ReservationList from '../ReservationList/ReservationList';

const ReservationsPage = () => {
    return (
        <div>
            <h1 className="mb-4">Reservation Management</h1>
            <ReservationList />
        </div>
    );
};

export default ReservationsPage;