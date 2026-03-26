import { Routes, Route } from 'react-router-dom';
// تخيلي إنك عاملة Folders للصفحات دي
import Home from '../pages/Home';
import Login from '../pages/Login';
import Rooms from '../pages/Rooms';
import Profile from '../pages/Profile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/profile" element={<Profile />} />
            {/* صفحة 404 لو اللينك غلط */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes;