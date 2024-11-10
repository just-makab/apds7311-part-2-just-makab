import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";
import checkauth, { checkRole } from "../check-auth.mjs";
import sanitize from "mongo-sanitize";

const router = express.Router();
router.use(checkauth);
router.use(checkRole("employee"));

// Middleware to check if the user is an employee
router.use((req, res, next) => {
    if (req.user.role !== "employee") {
        return res.status(403).json({ message: "Access denied. Employee role required." });
    }
    next();
});

// Route to view all transactions
router.get("/transactions", async (req, res) => {
    try {
        // Fetch all transactions
        const transactions = await db.collection("transactions").find({}).toArray();

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found." });
        }

        // Simplify output by including only necessary fields
        const simplifiedTransactions = transactions.map(transaction => ({
            transactionId: transaction._id,
            senderAccountNumber: transaction.senderAccountNumber,
            receiverAccountNumber: transaction.receiverAccountNumber,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            createdAt: transaction.createdAt
        }));

        res.status(200).json(simplifiedTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
});

// Route to update transaction status
router.post("/transaction/updateStatus/:transactionId", async (req, res) => {
    try {
        const transactionId = sanitize(req.params.transactionId);
        const { status } = req.body;

        // Ensure status is either "Verified" or "Completed"
        if (!["Verified", "Completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'Verified' and 'Completed'." });
        }

        // Find the transaction by its ID
        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(transactionId) });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        // Ensure logical status flow: "Pending" → "Verified" → "Completed"
        if (transaction.status === "Pending" && status !== "Verified") {
            return res.status(400).json({ message: "Pending transactions can only be updated to 'Verified'." });
        }
        if (transaction.status === "Verified" && status !== "Completed") {
            return res.status(400).json({ message: "Verified transactions can only be updated to 'Completed'." });
        }
        if (transaction.status === "Completed") {
            return res.status(400).json({ message: "Transaction already completed." });
        }

        // Update the transaction status
        await db.collection("transactions").updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { status: status } }
        );

        res.status(200).json({ message: `Transaction status updated to ${status}.` });
    } catch (error) {
        console.error("Error updating transaction status:", error);
        res.status(500).json({ message: "Failed to update transaction status." });
    }
});

export default router;
