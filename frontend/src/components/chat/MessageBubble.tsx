import React from 'react';

interface MessageBubbleProps {
  message: string;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  return (
    <div className={`message-bubble ${isSender ? 'sender' : 'receiver'}`}>
      <p>{message}</p>
    </div>
  );
};

export default MessageBubble;