import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../axiosConfig';
import Cookies from 'js-cookie';

const AuthContext = createContext({ userData: null, loading: true, setUser: () => {}});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userData, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/accounts/user/');
                setUser(response.data);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
                Cookies.remove('token');
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ userData, loading, setUser }}>
        {children}
        </AuthContext.Provider>
    );
};
