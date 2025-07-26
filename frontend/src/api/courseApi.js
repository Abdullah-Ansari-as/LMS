import axios from "axios";

export const getAllCourses = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/getAllCourses`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data
	} catch (error) {
		console.log(error);
		throw error
	}
}

// admin api
export const uploadAssignmentByAdmin = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/uploadAssignmentFromAdmin`, data, {
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

export const fetchAssignmentsById = async (courseId) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/fetchAssignmentsById/${courseId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

export const submitAssignment = async (file, id) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/submitAssignment/${id}`, formData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				"Content-Type": "multipart/form-data",
			}
		})
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

// admin api
export const uploadQuizByAdmin = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/uploadQuizFromAdmin`, data, {
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


export const fetchQuizesById = async (courseId) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/fetchQuizesById/${courseId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

export const submitQuiz = async (quizId, data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/submitQuiz/${quizId}`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
	}
}

// admin api
export const uploadCourseAnnouncement = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/uploadAnnouncement`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		})
		return res.data
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getCourseAnnouncement = async (courseId) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/getAnnouncementsByCourseId/${courseId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		})
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

// admin api
export const uploadNewCourse = async (newCourseData) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/newCourse`, newCourseData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		})
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

// admin api
export const uploadLecture = async (LectureData) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/uploadLecture`, LectureData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		})
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

// admin api
export const getTotalAnnouncements = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/getTotalAnnouncements`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		})
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}