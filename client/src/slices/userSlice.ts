import { Artist, Song, Userinfo, Chats } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the User interface
export interface User {
  user : Userinfo;
  user_top_artist_long: Artist[];
  user_top_artist_medium: Artist[];
  user_top_artist_short: Artist[];

  user_top_artist: Artist[];
  user_top_songs: Song[];

  user_top_songs_long: Song[];
  user_top_songs_medium: Song[];
  user_top_songs_short: Song[];
  user_chats: Chats[] | []

}

// Define the UserState interface
interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    getUser: (state) => {
      const userDataString = localStorage.getItem("user");
      
      if (userDataString) {
        state.user = JSON.parse(userDataString);
      }
    },
    logOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    }
  },
});

export const { setUser, getUser, logOut } = userSlice.actions;
export default userSlice.reducer;
