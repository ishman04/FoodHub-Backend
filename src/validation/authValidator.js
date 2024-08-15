// Node.js middleware function named isLoggedIn, which is designed to check if a user is authenticated before allowing them to access certain routes in an Express.js application

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');

async function isLoggedIn(req, res, next) {
    const token = req.cookies.authToken; // Accessing the cookie correctly
    if (!token) {
        return res.status(401).json({
            message: "No auth token provided",
            error: "Not authenticated",
            success: false,
            data: {}
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); //to check if token found is not tampered and is valid

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token provided",
                error: "Not authenticated",
                success: false,
                data: {}
            });
        }

        // If user reaches here, they are authenticated
        req.user = {
            email: decoded.email,
            id: decoded.id 
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token provided",
            error: "Not authenticated",
            success: false,
            data: {}
        });
    }
}

module.exports = {
    isLoggedIn
};
