import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chats, ChatMessage } from "@/types";

interface chats {
  user_chats: Chats[] | null;
}

const initialState: chats = {
  user_chats: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Chats[] | null>) => {
      state.user_chats = action.payload;
    },
    setNewMessage: (state, action: PayloadAction<ChatMessage>) => {
      const newMessage = action.payload;
      console.log("message at redux", newMessage);

      if (state.user_chats) {
        const chatIndex = state.user_chats.findIndex(
          (chat) => chat.chatInfo.id === newMessage.chat_id
        );

        if (chatIndex !== -1) {
          state.user_chats[chatIndex].chat_messages.push(newMessage);
        }
      }
    },
  },
});

export const { setChat, setNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
