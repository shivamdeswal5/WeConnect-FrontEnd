import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface ChatState {
  currentChatId: string | null;
  messagesByChatId: {
    [chatId: string]: ChatMessage[];
  };
}

const initialState: ChatState = {
  currentChatId: null,
  messagesByChatId: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>
    ) => {
      const { chatId, messages } = action.payload;
      state.messagesByChatId[chatId] = messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: ChatMessage }>
    ) => {
      const { chatId, message } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = [];
      }
      state.messagesByChatId[chatId].push(message);
    },
  },
});

export const { setCurrentChatId, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
