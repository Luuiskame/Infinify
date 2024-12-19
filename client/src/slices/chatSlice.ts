import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chats, ChatMessage } from "@/types";

interface chats {
  user_chats: Chats[] | null;
  total_unread_messages: number 
}

const initialState: chats = {
  user_chats: null,
  total_unread_messages: 0
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
    substractTotalUnreadMessages: (state,action: PayloadAction<number>)=>{
      state.total_unread_messages += - action.payload
    },
    substractChatUnreadMessages: (state,action: PayloadAction<{chatId: string, numberToSubstract: number}>)=> {
      const {chatId, numberToSubstract} = action.payload
      const chat = state.user_chats?.find(chat=> chat.chatInfo.id === chatId)

      if(chat){
      chat.chatInfo.unread_messages += - numberToSubstract

      }
    },
    sumChatUnreadMessages: (state,action: PayloadAction<{chatId: string, numberToSum: number}>)=> {
      const {chatId, numberToSum} = action.payload
      const chat = state.user_chats?.find(chat=> chat.chatInfo.id === chatId)

      if(chat){
      chat.chatInfo.unread_messages +=  numberToSum

      }
    },
    setTotalUnreadMessages: (state,action: PayloadAction<number>)=>{
      state.total_unread_messages += action.payload
    },
  },
});

export const { setChat, setNewMessage, substractTotalUnreadMessages, substractChatUnreadMessages, sumChatUnreadMessages, setTotalUnreadMessages } = chatSlice.actions;
export default chatSlice.reducer;
