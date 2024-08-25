const model = require('mongoose');
const UserService = require('../services/userService');
const UserRepository = require('../repositories/userRepository');

async function createUser(req, res) {
    const userService = new UserService(new UserRepository());

    try {
        const user = await userService.registerUser(req.body);
        return res.status(201).json({
            message: "Success",
            data: user,
            error: {},
            success: true
        });
        
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: "Failed",
            data: {},
            error: error.reason || error.message,
            success: false
        });
    }
}

module.exports = {
    createUser
};
