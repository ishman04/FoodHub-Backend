const UserRepository = require("../repositories/userRepository");
const AuthService = require("../services/authService");
const cookieParser = require('cookie-parser')

async function login(req,res){
    console.log(req.cookies)
    const authService = new AuthService(new UserRepository);
    try {
        const result = await authService.login(req.body);

        res.cookie("authToken", result, {
            httpOnly: true, //makes cookie unavailable to user (only stored in backend)
            secure: false,
            maxAge: 7*24*60*60*1000
        })
        console.log(res.cookie)
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