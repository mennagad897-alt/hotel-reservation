import { Routes, Route } from 'react-router-dom';
// تخيلي إنك عاملة Folders للصفحات دي
import Home from '../pages/Home';
import Login from '../pages/Login';
import Rooms from '../pages/Rooms';
import Profile from '../pages/Profile';
import Signup from '../pages/Signup';
import RoomDetails from '../pages/RoomDetails';
// ... داخل الـ Routes

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Signup" element={<Signup/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/profile" element={<Profile />} />
            {/* صفحة 404 لو اللينك غلط */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes;