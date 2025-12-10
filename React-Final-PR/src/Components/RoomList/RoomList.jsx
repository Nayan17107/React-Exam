import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomsAsync } from '../../Services/Actions/RoomActions';
import RoomCard from '../RoomCard/RoomCard';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomList = () => {
    const dispatch = useDispatch();
    const { rooms, isLoading, errorMsg } = useSelector(state => state.rooms);

    useEffect(() => {
        dispatch(getAllRoomsAsync());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading rooms...</p>
            </div>
        );
    }

    if (errorMsg) {
        return <Alert variant="danger">Error: {errorMsg}</Alert>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Available Rooms</h2>
                <Button as={Link} to="/rooms/add" variant="success">
                    + Add New Room
                </Button>
            </div>

            <Row>
                {rooms.length === 0 ? (
                    <Col>
                        <Alert variant="info">No rooms available. Add some rooms to get started.</Alert>
                    </Col>
                ) : (
                    rooms.map(room => (
                        <Col key={room.id} md={4} className="mb-4">
                            <RoomCard room={room} />
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default RoomList;