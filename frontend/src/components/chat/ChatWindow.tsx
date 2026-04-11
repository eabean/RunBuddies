import React from 'react';

const ChatWindow: React.FC = () => {
  return (
    <div className="chat-window">
      <h2>Chat</h2>
      <div className="messages">
        {/* Message bubbles will be rendered here */}
      </div>
      <div className="input-area">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;