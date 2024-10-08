// src/components/Customer/Transactions.js
import React, { useEffect, useState } from 'react';
import { getTransactions, cancelTransaction } from '../../api';

const Transactions = ({ token }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions(token);
                setTransactions(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch transactions');
            }
        };

        fetchTransactions();
    }, [token]);

    const handleCancel = async (transactionId) => {
        try {
            const response = await cancelTransaction(transactionId, token);
            setSuccess('Transaction canceled successfully');
            setError('');
            // Refresh the list of transactions after cancellation
            const updatedTransactions = transactions.filter(tx => tx.transactionId !== transactionId);
            setTransactions(updatedTransactions);
        } catch (err) {
            setError(err.message || 'Failed to cancel transaction');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Your Transactions</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.transactionId}>
                            <p>Receiver Account: {transaction.receiverAccountNumber}</p>
                            <p>Amount: {transaction.amount} {transaction.currency}</p>
                            <p>Status: {transaction.status}</p>
                            {transaction.status === 'Pending' && (
                                <button onClick={() => handleCancel(transaction.transactionId)}>Cancel</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

export default Transactions;
