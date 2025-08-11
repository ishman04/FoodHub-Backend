const express = require('express');
const http = require('http'); // <-- THIS IS THE FIX
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const ServerConfig = require('./config/serverConfig');
const connectdb = require('./config/dbConfig');
const userRouter = require('./routes/userRoute');
const cartRouter = require('./routes/cartRoute');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const orderRouter = require('./routes/orderRoutes');
const analyticsRouter = require('./routes/analyticsRoute');
const deliveryRouter =require('./routes/deliveryRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const webhookRouter = require('./routes/webhookRoutes');

const app = express();
const server = http.createServer(app); // This line will now work correctly


// Configure Socket.io with explicit origins
const io = new Server(server, {
    cors: {
        origin: "https://food-hub-frontend-eight.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Configure Express CORS with explicit origins
app.use(cors({
    origin: "https://food-hub-frontend-eight.vercel.app",
    credentials: true
}));

app.use('/webhook', webhookRouter); // Must be before bodyParser.json() for Stripe

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json()) // This is redundant as bodyParser.json() is used

// Pass `io` to the app context so controllers can use it
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`[Socket.IO] A user connected: ${socket.id}`);

    // This listener waits for a client to ask to join a specific order room
    socket.on('joinOrderRoom', (roomName) => {
        if (roomName) {
            socket.join(roomName);
            console.log(`[Socket.IO] Socket ${socket.id} joined room: ${roomName}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });
});



app.get('/ping', (req, res) => {
    console.log('pinged');
    res.json({ message: "pong" });
});

app.use('/users', userRouter);
app.use('/carts', cartRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/analytics', analyticsRouter);
app.use('/delivery', deliveryRouter);
app.use('/payment', paymentRouter);

server.listen(ServerConfig.PORT, async () => {
    await connectdb();
    console.log(`Server running on port ${ServerConfig.PORT}`);
});