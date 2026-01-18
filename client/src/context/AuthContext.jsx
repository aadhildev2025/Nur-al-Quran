import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await axios.get(`${API_URL}/auth/me`);
                    setUser(res.data);
                    await fetchBookmarks();
                } catch (err) {
                    console.error("Session restoration failed:", err);
                    logout();
                }
            } else {
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
                setBookmarks([]);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const fetchBookmarks = async () => {
        try {
            const res = await axios.get(`${API_URL}/bookmarks`);
            setBookmarks(res.data);
        } catch (err) {
            console.error("Failed to fetch bookmarks:", err);
            // If token is invalid, logout user
            if (err.response?.status === 401) {
                logout();
            }
        }
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_URL}/auth/register`, userData);
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        return res.data;
    };

    const login = async (userData) => {
        const res = await axios.post(`${API_URL}/auth/login`, userData);
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setBookmarks([]);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const toggleBookmark = async (surahId, ayahNumber) => {
        if (!token) return false;
        try {
            const res = await axios.post(`${API_URL}/bookmarks/toggle`, { surahId, ayahNumber });
            setBookmarks(res.data);
            return true;
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
            return false;
        }
    };

    const isBookmarked = (surahId, ayahNumber) => {
        return bookmarks.some(b => b.surahId === surahId && b.ayahNumber === ayahNumber);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            bookmarks,
            toggleBookmark,
            isBookmarked,
            login,
            register,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
