/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // استخدمنا الـ Function جوه الـ useState عشان نجيب التوكن فوراً
    // ده بيغنينا عن الـ useEffect وبيلغي الـ Error التاني
    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return savedToken ? { token: savedToken } : null;
    });

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};