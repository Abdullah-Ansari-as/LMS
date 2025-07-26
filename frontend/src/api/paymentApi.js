import axios from "axios";

// admin api
export const uploadPayment = async (paymentData) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/upload-payment`, paymentData, {
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

export const getPayment = async () => {
	try {
		const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payments/get-payment`, {
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