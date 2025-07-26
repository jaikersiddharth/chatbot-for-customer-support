import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import useChatStore from '../store/chatStore';
import './ChatWindow.css';

const ChatWindow: React.FC = () => {
  const { loading, setLoading, addMessage } = useChatStore();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    addMessage({
      content: message,
      sender: 'user'
    });
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      // Add AI response
      // Add AI response
      addMessage({
        content: data.response,
        sender: 'ai'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        content: 'Sorry, there was an error processing your request.',
        sender: 'ai'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <MessageList />
      <UserInput onSend={sendMessage} disabled={loading} />
    </div>
  );
};

export default ChatWindow;
