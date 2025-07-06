const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const paypalRoutes = require('./routes/paypalRoutes');
const searchRoutes = require('./routes/searchRoutes');

(express()).use(cors());
(express()).use(express.json());
dotenv.config();

(express()).use('/api/posts', postRoutes);
(express()).use('/api/users', userRoutes);
(express()).use('/api/comments', commentRoutes);
(express()).use('/api/paypal', paypalRoutes);

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const paypalRoutes = require('./routes/paypalRoutes');
app.use('/api/paypal', paypalRoutes);
app.use('/api/search', searchRoutes);

const app = express();
const server = http.createServer(express());
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ roomId, user }) => {
    socket.join(roomId);
    io.to(roomId).emit('user_joined', `${user} joined room ${roomId}`);
  });

  socket.on('call_number', ({ number, roomId }) => {
    io.to(roomId).emit('number_called', number);
  });

  socket.on('bingo_win', ({ user, roomId }) => {
    io.to(roomId).emit('winner_announce', `${user} has BINGO! 🎉`);
  });

  socket.on('chat_message', ({ message, user, roomId }) => {
    io.to(roomId).emit('chat_broadcast', { message, user });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));

