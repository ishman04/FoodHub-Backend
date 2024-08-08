const express = require('express');
const bodyParser = require('body-parser');

const ServerConfig = require('./config/serverConfig');
const connectdb = require('./config/dbConfig');
const User = require('./schema/userSchema');
const userRouter = require('./routes/userRoute'); // Import without destructuring
const cartRouter = require('./routes/cartRoute'); // Import without destructuring

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/carts', cartRouter);

app.listen(ServerConfig.PORT, async () => {
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);
});
