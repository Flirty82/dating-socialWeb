import React, { useState } from "react";
import "./Messages.css";

const sampleThreads = [
  { id: 1, name: "FlirtQueen88", lastMessage: "Had fun last night 😘" },
  { id: 2, name: "GamerGuy", lastMessage: "You up for Bingo later?" },
  { id: 3, name: "MysteryLover", lastMessage: "I think I know who the killer is..." }
];

const Messages = () => {
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    alert(`Message sent to ${selected.name}: "${newMsg}"`);
    setNewMsg("");
  };

  return (
    <div className="messages-page">
      <div className="thread-list">
        <h3>📨 Your Messages</h3>
        {sampleThreads.map((thread) => (
          <div
            key={thread.id}
            className={`thread ${selected?.id === thread.id ? "active" : ""}`}
            onClick={() => setSelected(thread)}
          >
            <strong>{thread.name}</strong>
            <p>{thread.lastMessage}</p>
          </div>
        ))}
      </div>

      <div className="chat-box">
        {selected ? (
          <>
            <h3>💬 Chat with {selected.name}</h3>
            <div className="chat-history">
              <p><strong>You:</strong> Hey there!</p>
              <p><strong>{selected.name}:</strong> {selected.lastMessage}</p>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </>
        ) : (
          <p>Select a conversation to start chatting 💌</p>
        )}
      </div>
    </div>
  );
};

<div className="mobile-stack">
  <div style={{ flex: 1 }}>Sidebar</div>
  <div style={{ flex: 3 }}>Chat Area</div>
</div>

export default Messages;
