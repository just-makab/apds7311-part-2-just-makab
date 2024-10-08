// src/components/Customer/CreateTransaction.js
import React, { useState } from 'react';
import { createTransaction } from '../../api';

const CreateTransaction = ({ token }) => {
    const [transactionData, setTransactionData] = useState({
        receiverAccountNumber: '',
        swiftCode: '',
        amount: '',
        currency: '',
        provider: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setTransactionData({
            ...transactionData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createTransaction(transactionData, token);
            setSuccess('Transaction created successfully!');
            setError('');
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Transaction</h2>
            <input type="text" name="receiverAccountNumber" placeholder="Receiver Account Number" onChange={handleChange} required />
            <input type="text" name="swiftCode" placeholder="SWIFT Code" onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
            <input type="text" name="currency" placeholder="Currency" onChange={handleChange} required />
            <input type="text" name="provider" placeholder="Provider" onChange={handleChange} required />
            <button type="submit">Create Transaction</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default CreateTransaction;
