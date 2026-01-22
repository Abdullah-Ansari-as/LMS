import axios from "axios";

export const createComment = async (userInput) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/createComment`,
      { userInput },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
