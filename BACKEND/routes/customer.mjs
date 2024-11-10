import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";
import checkauth, { checkRole } from "../check-auth.mjs";
import sanitize from "mongo-sanitize";

const router = express.Router();

// Use the authentication middleware for all routes in this router
router.use(checkauth);
router.use(checkRole("customer"));


// Insert Transaction (Create a transaction with Provider)
router.post("/createTransaction", async (req, res) => {
    try {
        // Extract and sanitize user input
        const senderAccountNumber = req.user.accountNumber; // Get the sender's account number from authenticated user
        const receiverAccountNumber = sanitize(req.body.receiverAccountNumber);
        const swiftCode = sanitize(req.body.swiftCode);
        const amount = sanitize(req.body.amount);
        const currency = sanitize(req.body.currency);
        const provider = sanitize(req.body.provider);

        // Validate that all necessary fields are provided
        if (!receiverAccountNumber || !swiftCode || !amount || !currency || !provider) {
            return res.status(400).json({ message: "All fields, are required." });
        }

        // Create new transaction object
        const newTransaction = {
            senderAccountNumber,
            receiverAccountNumber,
            swiftCode,
            amount,
            currency,
            provider,
            status: "Pending",
            createdAt: new Date(),
        };

        // Insert transaction into the database
        const result = await db.collection("transactions").insertOne(newTransaction);
        res.status(201).json({ message: "Transaction created", transactionId: result.insertedId });
    } catch (error) {
        console.error("Transaction creation error:", error);
        res.status(500).json({ message: "Transaction creation failed" });
    }
});

// View all transactions created by the customer
router.get("/transactions", async (req, res) => {
    try {
        const accountNumber = req.user.accountNumber; // Get the sender's account number from authenticated user

        // Fetch all transactions for the customer's account number
        const transactions = await db.collection("transactions").find({ senderAccountNumber: accountNumber }).toArray();

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found." });
        }

        // Simplify the output by including only necessary fields
        const simplifiedTransactions = transactions.map(transaction => ({
            receiverAccountNumber: transaction.receiverAccountNumber,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status
        }));

        res.status(200).json(simplifiedTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
});

// Cancel a pending transaction
router.post("/transaction/cancel/:transactionId", async (req, res) => {
    try {
        const transactionId = sanitize(req.params.transactionId);
        const accountNumber = req.user.accountNumber; // Get the sender's account number from authenticated user

        // Find the transaction by its ID and ensure it belongs to the user
        const transaction = await db.collection("transactions").findOne({ 
            _id: new ObjectId(transactionId),
            senderAccountNumber: accountNumber // Ensure the transaction belongs to the user
        });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or you do not have permission to cancel this transaction." });
        }

        // Check if the transaction is already completed or canceled
        if (transaction.status === "Completed") {
            return res.status(400).json({ message: "Transaction already completed." });
        }

        if (transaction.status === "Canceled") {
            return res.status(400).json({ message: "Transaction already canceled." });
        }

        // Ensure the transaction is pending before cancellation
        if (transaction.status !== "Pending") {
            return res.status(400).json({ message: "Only pending transactions can be canceled." });
        }

        // Update the transaction status to "Canceled"
        await db.collection("transactions").updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { status: "Canceled" } }
        );

        res.status(200).json({ message: "Transaction canceled successfully." });
    } catch (error) {
        console.error("Error canceling transaction:", error);
        res.status(500).json({ message: "Failed to cancel transaction." });
    }
});

export default router;
