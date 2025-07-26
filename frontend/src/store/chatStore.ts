import create from 'zustand';

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Session {
  id: number;
  started_at: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  inputValue: string;
  sessions: Session[];
  activeSessionId: number | null;
  setInputValue: (value: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setSessions: (sessions: Session[]) => void;
  loadSession: (sessionId: number) => Promise<void>;
  fetchSessions: () => Promise<void>;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  inputValue: '',
  sessions: [],
  activeSessionId: null,

  setInputValue: (value) => set({ inputValue: value }),

  addMessage: (message) => 
    set((state) => ({
      messages: [...state.messages, {
        ...message,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      }],
    })),

  setLoading: (loading) => set({ loading }),
  
  clearMessages: () => set({ messages: [] }),

  setSessions: (sessions) => set({ sessions }),

  fetchSessions: async () => {
    try {
      const response = await fetch('http://localhost:8000/sessions');
      const sessions = await response.json();
      set({ sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  },

  loadSession: async (sessionId) => {
    try {
      set({ loading: true });
      const response = await fetch(`http://localhost:8000/sessions/${sessionId}/messages`);
      const messages = await response.json();
      set({
        messages,
        activeSessionId: sessionId
      });
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      set({ loading: false });
    }
  }
}));

export default useChatStore;
