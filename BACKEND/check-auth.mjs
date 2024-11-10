import jwt from "jsonwebtoken";

// Authentication Middleware
const checkauth = (req, res, next) => {
    try {
        // Ensure the authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Authorization header is missing." });
        }

        const token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, "this_secret_should_be_longer_than_it_is");

        req.user = {
            username: decoded.username,
            role: decoded.role,
            accountNumber: decoded.role === "employee" ? null : decoded.accountNumber
        };

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token is invalid." });
        }
        
        res.status(401).json({ message: "Authentication failed." });
    }
};

// Role-Based Access Control Middleware
export const checkRole = (requiredRole) => (req, res, next) => {
    if (req.user?.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
};

export default checkauth;
