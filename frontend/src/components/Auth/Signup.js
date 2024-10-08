// src/components/Auth/Signup.js
import React, { useState } from 'react';
import { signup } from '../../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        idNumber: '',
        accountNumber: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            setSuccess('User created successfully!');
            setError('');
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input type="text" name="name" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} required />
            <input type="text" name="accountNumber" placeholder="Account Number" onChange={handleChange} required />
            <button type="submit">Signup</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default Signup;
