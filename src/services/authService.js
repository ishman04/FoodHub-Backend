const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRY } = require('../config/serverConfig')
const bcrypt = require('bcrypt')
class AuthService{
    constructor(userRepository){
        this.userRepository = userRepository
    }
    async login(authDetails){
        const email = authDetails.email
        const plainPassword = authDetails.password
        const user = await this.userRepository.findUser({
            email: email
        })
        if(!user){
            throw {message: "No user found with the given mail", statusCode: 404}
        }
        const isValidPassword = await bcrypt.compare(plainPassword, user.password)
        if(!isValidPassword){
            throw {message: "Password is invalid", statusCode: 401}

        }
        //if password correct create token
        const userRole = user.role ? user.role : 'user';
        const token = jwt.sign({email: user.email, _id: user._id, role: userRole}, JWT_SECRET, {   //payload,secretkey,options
            expiresIn: '1h'
        })
        return {token,userRole, userData:{
            email: user.email,
            firstName : user.firstName
        }}
    }


}

module.exports = AuthService;