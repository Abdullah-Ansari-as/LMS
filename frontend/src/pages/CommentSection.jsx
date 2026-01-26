import React, { useEffect, useState } from "react";
import { createComment, getAllComments } from "../api/commentApi.js";
import { useSelector } from "react-redux";

const CommentSection = ({ isOpen }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("comments: ", comments)

  	const { user } = useSelector((store) => store.user);

    console.log("user: ", user)


  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      try {
        const data = await getAllComments();
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
      setComments(prev => [data, ...prev]);
      setComment("");
    } catch (error) {
      console.log("failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List - Takes remaining space */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Current User Profile */}
        <div className="flex items-center space-x-3 mb-6 p-4 border-b border-gray-200">
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePicture}
              alt="User profile"
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">@{user?.name.toLowerCase()}</p>
          </div>
        </div>

        {/* Comments Container */}
        <div className="px-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map((commentItem) => (
              <div 
                key={commentItem._id} 
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={commentItem.user?.profilePicture || "https://via.placeholder.com/32x32"}
                    alt={commentItem.user?.name || "User"}
                    className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {commentItem.user?.name || "user"}
                      </p>
                      <span className="text-xs text-gray-500">
                        {commentItem.timestamp || "Just now"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {commentItem.userInput}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fixed Comment Input */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <div className="relative w-full">
          <div className="flex items-end gap-2 w-full">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts?"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
  );
};

export default CommentSection;
