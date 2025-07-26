import React from 'react';
import Message from './Message';
import './MessageList.css';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map(message => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  );
};

export default MessageList;
