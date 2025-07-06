import React from 'react';
import { useSelector } from 'react-redux';
import BingoCard from '../components/BingoCard';

export default function Bingo() {
    return <div>Bingo board goes here!</div>
    // const bingoCard = useSelector((state) => state.bingoCard);
    // return (
    //     <div className="bingo-container">
    //         <h1>Bingo Board</h1>
    //         <BingoCard bingoCard={bingoCard} />
    //     </div>
    // );
}
// Uncomment the above code when BingoCard component is ready
// The BingoCard component will be responsible for rendering the bingo card based on the state from Redux

import React from 'react';
import BingoBoard from '../games/BingoBoard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function BingoPage() {
  return (
    <ProtectedRoute>
      <div>
        <h2>🎉 Virtual Bingo Night</h2>
        <BingoBoard />
      </div>
    </ProtectedRoute>
  );
}
import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import BingoBoard from '../games/BingoBoard';

export default function BingoPage() {
  const socket = useSocket();
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const user = 'DiamondUser123';

  const joinRoom = () => {
    socket.emit('join_room', { roomId, user });
    setJoined(true);
  };

  socket.on('number_called', (number) => alert(`Number Called: ${number}`));
  socket.on('chat_broadcast', ({ message, user }) => {
    setMessages((prev) => [...prev, `${user}: ${message}`]);
  });

  const sendMessage = () => {
    socket.emit('chat_message', { message: chatInput, user, roomId });
    setChatInput('');
  };

  return (
    <div>
      {!joined ? (
        <>
          <input onChange={(e) => setRoomId(e.target.value)} placeholder="Enter Room ID" />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <h3>Room: {roomId}</h3>
          <BingoBoard roomId={roomId} user={user} />
          <div>
            {messages.map((msg, i) => <div key={i}>{msg}</div>)}
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

const checkWin = (selected) => {
  const winPatterns = [
    [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], // rows
    [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], // columns
    [0,6,12,18,24], [4,8,12,16,20] // diagonals
  ];
  return winPatterns.some(pattern => pattern.every(i => selected.includes(i)));
};

const onCellClick = (index) => {
  const newSelected = [...selectedCells, index];
  setSelectedCells(newSelected);

  if (checkWin(newSelected)) {
    socket.emit('bingo_win', { user, roomId });
    alert("You've got BINGO! 🎉");
  }
};

socket.on('winner_announce', (msg) => {
  alert(msg); // Or display in UI
});


