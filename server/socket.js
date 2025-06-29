const { Server } = require('socket.io');
const Message = require('./models/Message');
const RoomMessage = require('./models/RoomMessage');

let io;

function setupSocket(server) {
    io = new Server(server, {
        cors: { origin: '*' }
    });
}

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('join', userId => {
        socket.join(userId);
    });

    socket.on('send-message', async ({ sender, receiver, content }) => {
        const message = new Message({ sender, receiver, content });
        await message.save();

        io.to(receiver).emit('receive-message', message);
    });
});

socket.on('send-room-message', async ({ roomId, sender, content }) => {
    const msg = new RoomMessage({ roomId, sender, content });
    await msg.save();

    io.to(roomId).emit('receive-room-message', msg);
});

module.exports = setupSocket;

io.on('connection', socket => {
    socket.on('join-room', roomId => {
        socket.join(roomId);
    });

    socket.on('game-update', ({ roomId, data }) => {
        io.to(roomId).emit('game-update', data);
    });
});

io.on('connection', (socket) => {
    socket.on('join-room', roomId => {
        socket.join(roomId);
    });

    socket.on('send-game-update', ({ roomId, payload }) => {
        io.to(roomId).emit('receive-game-update', payload);
    });

    socket.on('start-bingo', (roomId) => {
        const drawNumber = Math.floor(Math.random()*75) + 1;
        io.to(roomId).emit('bingo-number', drawnNumber);
});

});

// Emit from server on game start or number call

socket.on('bingo-started', game => {
    // Load card, show HUD
});

socket.on('bingo-number', number => {
    // Highlight number if on player card
});