import {Chats} from '@/types'
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
        }
    }
})

export const {setChat} = chatSlice.actions
export default chatSlice.reducer