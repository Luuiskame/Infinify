import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web

// hooks
import { spotifyApi } from "@/services/spotifyApi";
import { authApi } from "@/services/authApi";
import { profileApi } from "@/services/profileApi";
import { chatsApi } from "@/services/chatsApi";
import { getUsersApi } from "@/services/getUsersApi";

// slices
import userSlice from "../slices/userSlice";
import chatSlice from "../slices/chatSlice";
import  searchHistorySlice  from "../slices/searchHistorySlice";

// Persist configuration for chatSlice
const chatPersistConfig = {
  key: "chat",
  storage,
};

// Create a persisted reducer for chatSlice
const persistedChatReducer = persistReducer(chatPersistConfig, chatSlice);

const store = configureStore({
  reducer: {
    searchHistory: searchHistorySlice,
    userReducer: userSlice,
    chatsReducer: persistedChatReducer, // Use the persisted reducer for chats
    [spotifyApi.reducerPath]: spotifyApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
    [getUsersApi.reducerPath]: getUsersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      spotifyApi.middleware,
      authApi.middleware,
      profileApi.middleware,
      chatsApi.middleware,
      getUsersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); // Create the persistor
export default store;
