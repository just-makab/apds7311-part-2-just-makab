// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import CreateTransaction from './components/Customer/CreateTransaction';
import Transactions from './components/Customer/Transactions';

const App = () => {
    const [token, setToken] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                {token && (
                    <>
                        <Route path="/createTransaction" element={<CreateTransaction token={token} />} />
                        <Route path="/transactions" element={<Transactions token={token} />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;
