import React from 'react';
import useChatStore from '../store/chatStore';
import './ConversationPanel.css';

const ConversationPanel: React.FC = () => {
  const { sessions, activeSessionId, loadSession } = useChatStore();

  return (
    <div className="conversation-panel">
      <h2>Past Conversations</h2>
      <div className="sessions-list">
        {sessions.map((session) => (
          <button
            key={session.id}
            className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
            onClick={() => loadSession(session.id)}
          >
            <div className="session-title">
              Conversation {session.id}
            </div>
            <div className="session-date">
              {new Date(session.started_at).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationPanel;
