import axios from "axios";

export const getAiChats = async (input) => {

    try {
    //    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/generate`, {"input": input}, {
    //     headers: {
	// 			authorization: `Bearer ${localStorage.getItem("token")}`
	// 		}
    //    });
       return res?.data.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const getAllAiChatsHistory = async () => {

    try {
       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/chat/history`, {
        headers: {
				authorization: `Bearer ${localStorage.getItem("token")}`
			}
       });
           return res?.data.chats
    } catch (error) {
        console.log(error);
        throw error
    }
}