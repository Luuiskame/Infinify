import {Chats, ChatMessage} from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface chats {
    user_chats: Chats[] | null
}

const initialState: chats = {
    user_chats: null
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChat: (state,action: PayloadAction<Chats[] | null>)=> {
            state.user_chats = action.payload
            localStorage.setItem("chats", JSON.stringify(action.payload))
        },
        getChats: (state)=> {
            const userChatDataString = localStorage.getItem("chats")

            if(userChatDataString){
                state.user_chats = JSON.parse(userChatDataString)
            }
        },
        setNewMessage: (state,action: PayloadAction<ChatMessage>)=> {
            const newMessage = action.payload
            console.log('messsage at redux', newMessage)

            if(state.user_chats){
                const chatIndex = state.user_chats.findIndex(chat=> chat.chatInfo.id === newMessage.chat_id)

                if(chatIndex !== -1){
                    state.user_chats[chatIndex].chat_messages.push(newMessage)
                }
            }
        },
    }
})

export const {setChat, getChats, setNewMessage} = chatSlice.actions
export default chatSlice.reducer