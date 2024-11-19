import { configureStore } from "@reduxjs/toolkit";

// hooks
import { spotifyApi } from "@/services/spotifyApi";
import { authApi } from "@/services/authApi";
import { profileApi } from "@/services/profileApi";
import { chatsApi } from "@/services/chatsApi";

// slices
import userSlice from '../slices/userSlice'
import chatSlice from '../slices/chatSlice'

const store = configureStore({
    reducer: {
        // here we'll use the ones who manage global state
        userReducer: userSlice,
        chatsReducer: chatSlice,

        //hooks
        [spotifyApi.reducerPath]: spotifyApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
    },

    middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(
        spotifyApi.middleware,
        authApi.middleware,
        profileApi.middleware,
        chatsApi.middleware,
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
