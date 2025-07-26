import create from 'zustand';

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  loading: false,
  inputValue: '',

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
}));

export default useChatStore;
