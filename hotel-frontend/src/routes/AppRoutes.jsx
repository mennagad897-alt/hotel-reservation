import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Rooms from '../pages/Rooms';
import Profile from '../pages/Profile';
import Signup from '../pages/Signup';
import RoomDetails from '../pages/RoomDetails';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Signup" element={<Signup/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<h1>welcome at luxHotel </h1>} />
        </Routes>
    );
};

export default AppRoutes;
