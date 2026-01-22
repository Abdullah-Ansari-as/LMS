import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		user: null,
		allStudents: [],
		topPerformingStudents: [],  
	},
	reducers: {
		// actions
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setLogout: (state) => {
			state.user = null
		}, 
		setAllStudents: (state, action) => {
			state.allStudents = action.payload;
		},
		setTopPerformingStudents: (state, action) => {
			state.topPerformingStudents = action.payload;
		}, 

	}
});

export const {setUser, setLogout, setAllStudents, setTopPerformingStudents} = userSlice.actions;
export default userSlice.reducer;