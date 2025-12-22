import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthState, loadInitialUser } from './Services/Actions/AuthActions';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Pages/Home';
import RoomsPage from './Components/Pages/RoomsPage';
import ReservationsPage from './Components/Pages/ReservationsPage';
import AddRoomPage from './Components/Pages/AddRoomPage';
import RoomDetailsPage from './Components/Pages/RoomDetailsPage';
import AddReservationPage from './Components/Pages/AddReservationPage';
import Profile from './Components/Pages/Profile';
import EditRoomPage from './Components/Pages/EditRoomPage';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import AdminRoute from './Components/Admin/AdminRoute';
import AdminDashboard from './Components/Pages/AdminDashboard';
import AdminRooms from './Components/Pages/AdminRooms';
import AdminUsers from './Components/Pages/AdminUsers';
import AdminReservations from './Components/Pages/AdminReservations';
import PaymentPage from './Components/Pages/PaymentPage';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInitialUser());
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      {/* <Container> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/add" element={<AdminRoute><AddRoomPage /></AdminRoute>} />
          <Route path="/rooms/edit/:id" element={<AdminRoute><EditRoomPage /></AdminRoute>} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/new" element={<AddReservationPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* Payment (static/demo) */}
          <Route path="/reservations/payment/:id" element={<PaymentPage />} />

          {/* Admin area */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />

        </Routes>
      {/* </Container> */}
    </Router>
  );
}

export default App;