import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chats, ChatMessage } from "@/types";

interface chats {
  user_chats: Chats[] | null;
  total_unread_messages: number 
}

interface setIsFetchedProps {
  chatId: string
  isFetched: boolean
}

const initialState: chats = {
  user_chats: null,
  total_unread_messages: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Chats[] | null>) => {
      state.user_chats = action.payload;
    },
    setOneChat: (state, action: PayloadAction<Chats>) => {
      console.log(action.payload)

      if(!state.user_chats){
        state.user_chats = [action.payload]
      } else {
        state.user_chats = [...state.user_chats, action.payload]
      }
    },
    setIsFetched: (state, action: PayloadAction<setIsFetchedProps>)=> {
      console.log('redux set fetched is dispatched')
      if(state.user_chats){
        const chatIndex = state.user_chats.findIndex(
          (chatId)=> chatId.chatInfo.id === action.payload.chatId
        )

        state.user_chats[chatIndex].isFetched = action.payload.isFetched
      }
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
    setMultipleChatMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      const newMessages = action.payload;
      console.log('redux payload:', newMessages);
    
      // Group messages by chat_id
      const messagesByChatId = newMessages.reduce<Record<string, ChatMessage[]>>((acc, message) => {
        if (!acc[message.chat_id]) {
          acc[message.chat_id] = [];
        }
        acc[message.chat_id].push(message);
        return acc;
      }, {});
    
      // Update each chat with its new messages
      if (state.user_chats) {
        Object.keys(messagesByChatId).forEach((chatId) => {
          const chatIndex = state.user_chats!.findIndex(
            (chat) => chat.chatInfo.id === chatId
          );
    
          // Removed chatIndex from condition since it can be 0
          if (chatIndex !== -1 && state.user_chats) {
            state.user_chats[chatIndex].chat_messages.push(
              ...messagesByChatId[chatId]
            );
          }
        });
      }
    },
    
    substractTotalUnreadMessages: (state, action: PayloadAction<number>) => {
      const newTotal = state.total_unread_messages - action.payload;
      state.total_unread_messages = newTotal < 0 ? 0 : newTotal;
    },
    substractChatUnreadMessages: (state, action: PayloadAction<{ chatId: string, numberToSubstract: number }>) => {
      const { chatId, numberToSubstract } = action.payload;
      const chat = state.user_chats?.find(chat => chat.chatInfo.id === chatId);

      if (chat) {
        const newUnreadMessages = chat.chatInfo.unread_messages - numberToSubstract;
        chat.chatInfo.unread_messages = newUnreadMessages < 0 ? 0 : newUnreadMessages;
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

export const { setChat, setOneChat, setIsFetched, setNewMessage, setMultipleChatMessages,substractTotalUnreadMessages, substractChatUnreadMessages, sumChatUnreadMessages, setTotalUnreadMessages } = chatSlice.actions;
export default chatSlice.reducer;
