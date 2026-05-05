import axios from "axios";

export const getProgress = async (course) => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/progress/${course}`, {
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

export const markLectureComplete = async (courseId, lectureId) => {
	try {
		const res = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/api/progress/lecture/${courseId}/${lectureId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getStudentProgress = async (studentId) => {
	try {
		const res = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}/api/progress/student/${studentId}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}