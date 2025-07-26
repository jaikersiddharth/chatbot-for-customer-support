import React from 'react';
import useChatStore from '../store/chatStore';
import './UserInput.css';

interface UserInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, disabled }) => {
  const { inputValue, setInputValue } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <form className="user-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !inputValue.trim()}>
        Send
      </button>
    </form>
  );
};

export default UserInput;
