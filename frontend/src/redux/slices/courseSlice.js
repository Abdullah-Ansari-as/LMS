import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
	name: "course",
	initialState: {
		courses: [],
		assignments: [],
		submittedAssignments: [], 
		quizes: [],
		submittedQuizes: []
	},
	reducers: {
		// actions  
		setCourses: (state, action) => {
			state.courses = action.payload;
		},
		setAssignments: (state, action) => {
			state.assignments = action.payload;
		},
		setSubmittedAssignments: (state, action) => {
			state.submittedAssignments = [...(state.submittedAssignments || []), action.payload];
		}, 
		setQuizes: (state, action) => {
			state.quizes = action.payload;
		},
		setSubmittedQuizes: (state, action) => {
			state.submittedQuizes = [...(state.submittedQuizes || []), action.payload];
		},
		
	}
});

export const { setCourses, setAssignments, setSubmittedAssignments, setQuizes, setSubmittedQuizes } = courseSlice.actions;
export default courseSlice.reducer;