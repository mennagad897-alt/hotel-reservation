import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Rooms from '../pages/Rooms';
import Profile from '../pages/Profile';
import Signup from '../pages/Signup';
import RoomDetails from '../pages/RoomDetails';
import AdminAddRoom from "../pages/AdminAddRoom";
import ProtectedRoute from "../pages/ProtectedRoute";
import AdminManageUsers from "../pages/AdminManageUsers";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            
            <Route 
                path="/profile" 
                element={
                    <ProtectedRoute allowedRoles={["user", "admin", "employee"]}>
                        <Profile />
                    </ProtectedRoute>
                } 
            />

            <Route
                path="/admin/add-room"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminAddRoom />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        <Route
              path="/admin/users"
              element={
              <ProtectedRoute allowedRoles={["admin"]}>
                 <AdminManageUsers />
                </ProtectedRoute>
              }
        />
        </Routes>
    );
};

export default AppRoutes;