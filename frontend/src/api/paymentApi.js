import axios from "axios";

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

// api/paymentApi.js
export const getPayment = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/payments/get-payment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header if you have authentication
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching payments:', error);
        return {
            success: false,
            getPayment: [],
            transactions: [],
            message: 'Failed to fetch payments'
        };
    }
};
// Update payment status after successful Stripe payment
export const updatePaymentStatus = async (transactionData) => {
	try {
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		
		const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/updatePaymentStatus`, transactionData, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		return response.data;
	} catch (error) {
		console.error("Error updating payment status:", error);
		return {
			success: false,
			message: error.response?.data?.message || "Failed to update payment status"
		};
	}
};
export const createPayment = async (data) => {
	try {
		const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/createPaymentIntent`, data, {
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