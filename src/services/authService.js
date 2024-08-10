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
        console.log("Plain Password:", plainPassword);
console.log("Hashed Password from DB:", user.password);
console.log("Password Match:", isValidPassword);
        if(!isValidPassword){
            throw {message: "Password is invalid", statusCode: 401}

        }
        //if password correct create token
        const token = jwt.sign({email: user.email, _id: user._id}, JWT_SECRET, {
            expiresIn: '1h'
        })
        return token
    }


}

module.exports = AuthService;