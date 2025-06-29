const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes', userRoutes);
const postRoutes = require('./routes', postRoutes);
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');
const postRoutes = require('./routes/acivityFeedRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const flirtRoutes = require('./routes/flirtRoutes');
const paypalRoutes = require('./routes/paypalRoutes');
const activityFeedRoutes = require('./routes/activityFeedRoutes');
const cors = require('cors');
const postsRoutes = require('./routes/postRoutes');
require('dotenv').config();
const preloadRooms = require('./preloadRooms');
preloadRooms(); // Right after DB connects

dotenv.config();
app.use(express.json());
const PORT = process.env.PORT || https://flirtingsingles.blog;

mongooseconnect,('process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, 
.replacethen(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/auth', require('./routes/auth'));
app.use('api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/flirts', flirtRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/activityFeed', activityFeedRoutes);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', require('./routes/admin'));

app.listen(f, () => console.log('Server running on port 3000'));

const http = require('http');
const setupSocket = require('./socket');

setupSocket(server);

server.listen(PORT, () => console.log('Server running on port ${PORT}'));

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://flirtingsingles.blog', // Use for production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("generate_number", ({ room, number }) => {
    io.to(room).emit("bingo_number", number);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

socket.on('send-message', ({ senderId, recipientId, text }) => {
  const recipientSocketId = onlineUsers.get(recipientId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('recipient_message', {
      senderId,
      text,
      timestamp: new Date()
    });
  }
});

socket.on('disconnect', () => {
  for (let [userId, sockId] of onlineUsers.entries()) {
    if (sockId === socket.id) {
      onlineusers.delete(userId);
      break;
    }
  }
  console.log('User disconnected:', socket.id);
});

server.listen(5000, () => {
  console.log('Server and Socket.IO running on port 5000');
})

