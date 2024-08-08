const express = require('express');
const { createUser } = require('../controllers/userController');

// Router object is initialized to add routes in new file
// Router is used to segregate our routes in different modules
const userRouter = express.Router();

userRouter.post('/',createUser)

module.exports = userRouter;
