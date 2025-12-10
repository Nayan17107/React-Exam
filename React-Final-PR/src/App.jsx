import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Pages/Home';
import RoomsPage from './Components/Pages/RoomsPage';
import ReservationsPage from './Components/Pages/ReservationsPage';
import AddRoomPage from './Components/Pages/AddRoomPage';
import RoomDetailsPage from './Components/Pages/RoomDetailsPage';
import AddReservationPage from './Components/Pages/AddReservationPage';
import EditRoomPage from './Components/Pages/EditRoomPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/add" element={<AddRoomPage />} />
          <Route path="/rooms/edit/:id" element={<EditRoomPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/new" element={<AddReservationPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;