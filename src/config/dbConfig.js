const mongoose = require('mongoose');
const serverConfig = require('./serverConfig');

//this function helps to connect to mongo server
async function connectdb(){
    try {
        await mongoose.connect(serverConfig.DB_URL);
        console.log("Successfully connected to Mongodb server...");
    } catch (error) {
        console.log("Not able to connect to Mongodb server...")
        console.log(error)
    }
}
module.exports = connectdb;