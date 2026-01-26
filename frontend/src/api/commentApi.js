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
      },
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/deleteComment/${commentId}`,
      {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllComments = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/getComments`,
      {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const addReply = async (commentId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/addReply/${commentId}`,
      {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



