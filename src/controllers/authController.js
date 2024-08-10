const UserRepository = require("../repositories/userRepository");
const AuthService = require("../services/authService");


async function login(req,res){
    const authService = new AuthService(new UserRepository);
    try {
        const result = await authService.login(req.body);
        return res.status(200).json({
            message: "Login Success",
            data: result,
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