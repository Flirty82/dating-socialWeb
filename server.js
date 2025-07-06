const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const videoRoutes = require('./routes/videoRoutes');

const server = http.createServer(app);
const io = new Server(server);
const searchRoutes = require('./routes/searchRoutes');

mongoose.connect("mongodb+srv://flirtingsingles:<tzhGKEDNt8wkEo8L>@flirtingsingles1.8pfjj.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected!"))
.catch (err => console.error(err));

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ sender, receiver, content }) => {
        const message = new MessageChannel({ sender, receiver, content });
        await message.save();
        io.emit("newMessage", message);  // Broadcast messages to users
    });

    socket.io("disconnect", () => console.log("User disconnected", socket.id));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/moderation', require('./routes/moderationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/video', videoRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/api/data', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT );
})

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flirtingsingles', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.
