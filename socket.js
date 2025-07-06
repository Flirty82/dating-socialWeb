const { Server } = require('socket.io');
const Message = require('../models/Message');

let io;

function setupSocket(server) {
    io = new Server(server, {
        cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        },
    });
    
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        });
    
        socket.on('sendMessage', async (data) => {
        const { room, message } = data;
        const newMessage = new Message({ room, message });
        await newMessage.save();
        io.to(room).emit('receiveMessage', message);
        });
    
        socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        });
    });
}