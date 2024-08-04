//env variable from dotenv remain in env variables as long as server is running
const express = require('express');

const bodyParser = require('body-parser')

const ServerConfig = require('./config/serverConfig');
const connectdb = require('./config/dbConfig');
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
})