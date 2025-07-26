import React from 'react';
import './Message.css';

interface MessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">{content}</div>
      <div className="message-timestamp">{new Date(timestamp).toLocaleTimeString()}</div>
    </div>
  );
};

export default Message;
