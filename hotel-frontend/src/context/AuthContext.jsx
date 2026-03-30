/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // 1. أول ما الموقع يفتح، بنشوف هل فيه يوزر متخزن ولا لأ
    const [user, setUser] = useState(function() {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        // لو التوكن والبيانات موجودين، بنرجع كائن اليوزر كامل (وبيكون جواه الـ role)
        if (savedToken && savedUser) {
            return { token: savedToken, ...JSON.parse(savedUser) };
        }
        return null;
    });

    // 2. دالة الـ Login: بنستلم بيانات اليوزر والتوكن من صفحة الـ Login
    function login(userData, token) {
        // بنخزن التوكن كـ string عادي
        localStorage.setItem('token', token);
        // بنخزن بيانات اليوزر (اللي هي object فيها id, email, role) كـ JSON
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        // بنحدث الـ state عشان كل الموقع يحس بالتغيير
        setUser({ ...userData, token: token });
    }

    // 3. دالة الـ Logout: بنمسح كل حاجة
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