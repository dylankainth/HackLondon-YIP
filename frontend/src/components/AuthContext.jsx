import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || null; // Load from localStorage
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Save to localStorage
        } else {
            localStorage.removeItem('user'); // Remove if user logs out
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
