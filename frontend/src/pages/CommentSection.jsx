import React, { useState } from "react";
import { createComment } from "../api/commentApi.js";

const CommentSection = () => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  //   console.log(comment);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const data = await createComment(comment);
      console.log("comment created: ", data);

      // setComment
    } catch (error) {
      console.log("failed to fetch commnets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        onClick={handleSubmit}
        className="rounded-lg  bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? "Loading..." : "Post"}
      </button>
    </div>
  );
};

export default CommentSection;
