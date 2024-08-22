const User = require('../schema/userSchema')
class UserRepository{
    async findUser(parameters){
        const response = await User.findOne(parameters);
        return response
    }
    async createUser(userDetails){
        const newUser = await User.create(userDetails)
        return newUser;
    }

}
module.exports = UserRepository;