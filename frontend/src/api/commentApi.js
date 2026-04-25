import axios from "axios";

export const createComment = async (userInput,lectureId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/createComment/${lectureId}`,
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

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const addReply = async (commentId, repliedText) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/addReply/${commentId}`,
      {repliedText},
      {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(res.data)
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteReply = async (commentId, replyId) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/${commentId}/deleteReply/${replyId}`,
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

export const getCommentsByLecture = async (lectureId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/comments/${lectureId}/getCommentsByLecture`,
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


