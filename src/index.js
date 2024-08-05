//env variable from dotenv remain in env variables as long as server is running
const express = require('express');

const bodyParser = require('body-parser')

const ServerConfig = require('./config/serverConfig');
const connectdb = require('./config/dbConfig');
const User = require('./schema/userSchema');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

app.post('/ping',(req,res)=>{
    console.log(req.body);
    return res.json({message: "pong"});
})
app.listen(ServerConfig.PORT,async ()=>{
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);

    try {
        const newUser = await User.create({
          firstName: 'Johnny',
          lastName: 'Doeses',
          mobileNumber: '1234567890',
          email: 'john.doe@example.com',
          password: 'securepassword'
        });
        console.log('User created:', newUser);
      } catch (err) {
        if (err.code === 11000) {
          console.error('Duplicate key error:', err.message);
        } else {
          console.error('Error creating user:', err);
        }
      }
      
})