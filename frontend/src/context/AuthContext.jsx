import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth token for axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile');
        setUser(data);
      } catch (error) {
        console.error('Load user error:', error);
        setAuthToken(null);
      }
    }
    setLoading(false);
  };

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
      setAuthToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setAuthToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
