import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const uploadPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/upload-payment`,
      paymentData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Upload payment error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getPayment = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/getPayment`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Get payment error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const createPaymentIntent = async (transactionId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/createPaymentIntent`,
      { transactionId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Create payment intent error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updatePaymentStatus = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/update-status`,
      paymentData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Update payment status error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
