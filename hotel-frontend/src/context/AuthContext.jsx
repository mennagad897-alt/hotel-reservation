/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(function() {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        // لو فيه بيانات متخزنة، نرجعها، غير كدة نرجع null
        return savedToken ? { token: savedToken, ...JSON.parse(savedUser) } : null;
    });

    // --- دالة الـ Login اللي كانت ناقصة ---
    function login(userData, token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData)); // بنخزن بيانات اليوزر كمان
        setUser({ ...userData, token: token });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}