const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Connect to Database
connectDB();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Socket.io Implementation
io.on('connection', (socket) => {
    console.log('New Socket Connection:', socket.id);

    socket.on('joinRoom', ({ complaintId }) => {
        socket.join(complaintId);
        console.log(`User joined complaint room: ${complaintId}`);
    });

    socket.on('chatMessage', async ({ complaintId, senderId, senderRole, message }) => {
        try {
            const newMessage = await Message.create({
                complaintId,
                senderId,
                senderRole,
                message
            });

            io.to(complaintId).emit('message', newMessage);
        } catch (error) {
            console.error('Socket message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket Disconnected');
    });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
