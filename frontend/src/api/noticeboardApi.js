import axios from "axios";

export const uploadNoticeBoardAnnoucements = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/nbannounce/nbannounce`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

export const getNoticeBoardAnnoucements = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/nbannounce/getAllNbAnnouncements`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}