// Node.js middleware function named isLoggedIn, which is designed to check if a user is authenticated before allowing them to access certain routes in an Express.js application

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');
const UnauthorizedLoginError = require('../utils/unautorizedLoginError');

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
            throw new UnauthorizedLoginError;
        }

        // If user reaches here, they are authenticated
        req.user = {
            email: decoded.email,
            id: decoded._id, 
            role: decoded.role
        };

        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            res.cookie("authToken","",{
                httpOnly: true,
                secure: false,
                maxAge: 7*24*60*60*1000
            })
            return res.status(200).json({
                success: true,
                message: "Logout successfull",
                error: {},
                data:{}
            })
        }
        return res.status(401).json({
            message: "Invalid token provided",
            error: "Not authenticated",
            success: false,
            data: {}
        });
    }
}
// first check if user is logged in if he is then we check if he is an admin or user
// in req we recieve updated req from isLoggedIn function
async function isAdmin(req,res,next){
    const loggedInUser = req.user;
    console.log(loggedInUser)
    if(loggedInUser.role === 'admin'){
        next();
    }
    else{
        return res.status(401).json({
            message: "You are not authorized to perform this action",
            error:{
                statusCode: 401,
                reason:"Unauthorized user"
            },
            data:{},
            success: false
        })
    }
}

module.exports = {
    isLoggedIn,
    isAdmin 
};
