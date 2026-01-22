// store/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLectureModalOpen: false,
    isSidebarOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openLectureModal: (state) => {
      state.isLectureModalOpen = true;
      state.isSidebarOpen = false; // auto-close sidebar
    },
    closeLectureModal: (state) => {
      state.isLectureModalOpen = false;
    },
  },
});

export const { openLectureModal, closeLectureModal, toggleSidebar, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer;
