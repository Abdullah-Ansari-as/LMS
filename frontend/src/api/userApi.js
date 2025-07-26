import axios from "axios";

export const register = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, data);
		if (res.data.token) {
			localStorage.setItem("token", res.data.token);
		}
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

export const login = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, data);
		if (res.data.token) {
			localStorage.setItem("token", res.data.token);
		}
		return res.data;
	} catch (error) {
		console.log(error);
		throw error
	}
}

export const updateProfilePicture = async (file) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/uploadProfilePicture`, file, {
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

export const changePassword = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/changePassword`, data, {
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


// Admin Api's
export const getAllStudents = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getAllStudents`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}

// admin api
export const topPerformingStudents = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getTopPerformingStudents`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			}
		});
		return res.data;
	} catch (error) {
		console.error(error);
		throw error
	}
}