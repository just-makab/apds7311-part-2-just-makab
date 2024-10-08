import jwt from "jsonwebtoken";

const checkauth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, "this_secret_should_be_longer_than_it_is");

        // Attach user details to the request object based on role
        req.user = {
            username: decoded.username,
            role: decoded.role,
            accountNumber: decoded.role === 'employee' ? null : decoded.accountNumber
        };

        next();
    } catch (error) {
        res.status(401).json({
            message: "Token is invalid or expired."
        });
    }
};

export default checkauth;
