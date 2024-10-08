// src/api.js
import axios from 'axios';

const API_URL = 'https://localhost:3001';

// Signup API
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Login API
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create transaction API
export const createTransaction = async (transactionData, token) => {
    try {
        const response = await axios.post(`${API_URL}/customer/createTransaction`, transactionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get all transactions API
export const getTransactions = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/customer/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Cancel a transaction
export const cancelTransaction = async (transactionId, token) => {
    try {
        const response = await axios.post(`${API_URL}/customer/transaction/cancel/${transactionId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
