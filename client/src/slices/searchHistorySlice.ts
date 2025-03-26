import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchHistoryState {
  searchHistory: string[];
}

const saveToLocalStorage = (data: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("searchHistory", JSON.stringify(data));
  }
};

const initialState: SearchHistoryState = {
  searchHistory: [],
};

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.trim();
      if (searchTerm && !state.searchHistory.includes(searchTerm)) {
        state.searchHistory.unshift(searchTerm);
        if (state.searchHistory.length > 6) state.searchHistory.pop();
        saveToLocalStorage(state.searchHistory);
      }
    },
    removeSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== action.payload
      );
      saveToLocalStorage(state.searchHistory);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      saveToLocalStorage(state.searchHistory);
    },
    setSearchHistory: (state, action: PayloadAction<string[]>) => {
      state.searchHistory = action.payload
        .filter((term) => term.trim())
        .slice(0, 10);
      saveToLocalStorage(state.searchHistory);
    },
  },
});

export const {
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  setSearchHistory,
} = searchHistorySlice.actions;

export default searchHistorySlice.reducer;