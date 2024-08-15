const UserRepository = require("../repositories/userRepository");
const AuthService = require("../services/authService");
const cookieParser = require('cookie-parser')

async function login(req,res){
    console.log(req.cookies) //displays prev queries sent by the client and which are stored at browser
    const authService = new AuthService(new UserRepository);
    try {
        const result = await authService.login(req.body);

        res.cookie("authToken", result, { //creates a new cookie containing new jwt token on the browser
            httpOnly: true, //makes cookie unavailable to user (only stored in backend)
            secure: false,
            maxAge: 7*24*60*60*1000
        })
        return res.status(200).json({
            message: "Login Success",
            data: {},
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message,
            data: {},
            error : error
        })
    }
    
}
module.exports = {login};