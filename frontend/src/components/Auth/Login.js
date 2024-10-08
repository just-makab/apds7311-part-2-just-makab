// src/components/Auth/Login.js
import React, { useState } from 'react';
import { login } from '../../api'; // Your API call
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate function from react-router

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const data = await login(accountNumber, name, password); // Call the login API
            setToken(data.token); // Save the JWT token or any other data if necessary

            // After successful login, navigate to the transactions page
            navigate('/transactions'); 
        } catch (err) {
            setError(err.message); // Show the error message if login fails
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
        </div>
    );
};

export default Login;
