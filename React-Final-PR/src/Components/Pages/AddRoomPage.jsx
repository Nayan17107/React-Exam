import React from 'react';
import { Card } from 'react-bootstrap';
import AddRoomForm from '../AddRoom/AddRoomForm';

const AddRoomPage = () => {
    return (
        <div>
            <h1 className="mb-4">Add New Room</h1>
            <Card>
                <Card.Body>
                    <AddRoomForm />
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddRoomPage;