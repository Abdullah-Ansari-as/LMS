import axios from "axios";

// Admin api
export const uploadGrades = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/grades/uploadGrades`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getAssignmentsGrades = async (course) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grades/getResultsOfAssignments/${course}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getQuizesGrades = async (course) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grades/getResultsOfQuizes/${course}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getGrades = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grades/getGradesByStudentId`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
};

// admin api
export const getTotalGrades = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grades/getTotalGrades`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
};
