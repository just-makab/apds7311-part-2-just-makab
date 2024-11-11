import express from "express";
import db from "../db/conn.mjs";
import pkg from 'mongodb';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bruteforce from "../middleware/bruteforce.mjs";


const { ObjectID } = pkg;
const router = express.Router();

// Regex patterns for validation
const NAME_REGEX = /^\w{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const IDNUMBER_REGEX = /^\d{13}$/;
const ACCOUNTNUMBER_REGEX = /^\d{8,12}$/;

// User Signup Route
router.post("/signup", async (req, res) => {
    const { name, password, idNumber, accountNumber } = req.body;

    // Validate username
    if (!NAME_REGEX.test(name.trim())) {
        return res.status(400).json({ message: "Invalid username. It should be 3-20 characters long and can only contain letters, numbers, and underscores." });
    }

    // Validate password
    if (!PASSWORD_REGEX.test(password.trim())) {
        return res.status(400).json({ message: "Invalid password. It should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
    }

    // Validate ID Number
    if (!IDNUMBER_REGEX.test(idNumber.trim())) {
        return res.status(400).json({ message: "Invalid ID number. It must be exactly 13 digits long." });
    }

    // Validate Account Number
    if (!ACCOUNTNUMBER_REGEX.test(accountNumber.trim())) {
        return res.status(400).json({ message: "Invalid account number. It must be between 8 and 12 digits long." });
    }

    try {
        // Check if the account number already exists
        const collection = await db.collection("users");
        const existingUser = await collection.findOne({ accountNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Account number already exists. Please choose a different account number." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user document with a default "customer" role
        let newDocument = {
            name: name,
            password: hashedPassword,
            idNumber: idNumber,
            accountNumber: accountNumber,
            role: "customer"
        };

        // Insert new user into database
        let result = await collection.insertOne(newDocument);
        res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" });
    }
});

// User Login Route with Brute Force Protectio
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { accountNumber, name, password } = req.body;

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ accountNumber, name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Generate JWT token valid for 30 mins with user ID, account, and role
            const token = jwt.sign(
                {
                    userId: user._id,
                    username: name,
                    accountNumber: user.accountNumber,
                    role: user.role
                },
                "this_secret_should_be_longer_than_it_is",
                { expiresIn: "30m" }
            );

            res.status(200).json({
                message: "Authentication successful",
                token,
                userId: user._id,
                name: name,
                accountNumber: accountNumber,
                role: user.role
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

router.post("/logout", (req, res) => {
    if (req.cookies?.refreshToken) {
      // Clear the refresh token cookie to log the user out
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
      res.status(200).json({ message: "Logged Out" });
    } else {
      res.status(400).json({ message: "No user logged in" });
    }
  });

export default router;
