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