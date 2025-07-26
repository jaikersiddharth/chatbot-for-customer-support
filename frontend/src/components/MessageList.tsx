import React from 'react';
import Message from './Message';
import useChatStore from '../store/chatStore';
import './MessageList.css';

const MessageList: React.FC = () => {
  const messages = useChatStore(state => state.messages);

  return (
    <div className="message-list">
      {messages.map(message => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  );
};

export default MessageList;
