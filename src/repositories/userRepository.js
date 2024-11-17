const User = require('../schema/userSchema');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
class UserRepository{
    async findUser(parameters){
        const response = await User.findOne(parameters);
        return response
    }
    async createUser(userDetails){
        try {
            const newUser = await User.create(userDetails)
            return newUser;
        } catch (error) {
            if(error.name === 'ValidationError'){
                const errorMessageList = Object.keys(error.errors).map((property) => { //error has a property named errors
                    return error.errors[property].message;
                });

                throw new BadRequestError(errorMessageList);
            }
            console.log(error)
            throw new InternalServerError();
        }
        
    }

}
module.exports = UserRepository;