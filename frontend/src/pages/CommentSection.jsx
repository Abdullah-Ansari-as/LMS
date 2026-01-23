import React, { useEffect, useState } from "react";
import { createComment, getAllComments } from "../api/commentApi.js";

const CommentSection = ({ isOpen }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("comments : ", comments);

  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      try {
        const data = await getAllComments();
        // console.log(data);
        setComments(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, [isOpen]);

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
    <div className="space-y-4 w-full">
      <div className="flex items-center space-x-3 w-full">
        <div className="relative flex-shrink-0">
          <img
            src="https://via.placeholder.com/40x40"
            alt="User profile"
            className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">John Doe</p>
          <p className="text-xs text-gray-500">@johndoe</p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="flex space-x-3 w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-end gap-2 w-full min-w-0">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What are your thoughts?"
                rows={2}
                className="flex-1 min-w-0 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !comment.trim()}
                className={`flex-shrink-0 h-fit rounded-lg px-5 py-3 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading || !comment.trim()
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
