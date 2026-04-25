import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  createComment,
  addReply,
  deleteComment,
  deleteReply,
  getCommentsByLecture,
} from "../api/commentApi.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import "../../src/index.css";
import CommentItem from "./CommentItem.jsx";

const CommentSection = ({ isOpen, comments, setComments, selectLecture }) => {
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [activeReplies, setActiveReplies] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (!isOpen || !selectLecture) return;

    const fetchComments = async () => {
      try {
        // const data = await getAllComments();
        // setComments(data);
        const data = await getCommentsByLecture(selectLecture);
        console.log("datadatadatadata: ", data);
        setComments([...data]);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, [isOpen, selectLecture, setComments]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const commentRef = useRef(null);
  const menuRef = useRef(null);

  dayjs.extend(relativeTime);

  const timeAgo = (date) => {
    if (!date) return;
    return dayjs(date).fromNow();
  };

  const handleDeleteComment = async (comment) => {
    try {
      const commentDeleted = await deleteComment(comment._id);

      if (commentDeleted) {
        toast.success("Comment deleted successfully!");
      }

      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await deleteReply(commentId, replyId);

      toast.success("Reply deleted successfully!!");


        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId ? {
              ...comment,
              replies: comment.replies.filter(
                reply => reply._id !== replyId
              )
            } : comment
          )
        )
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const data = await createComment(comment, selectLecture);

      toast.success("Comment added successfully!");

      const commentdata = await getCommentsByLecture(selectLecture);
      setComments(commentdata);

      
      commentRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setComment("");
    } catch (error) {
      console.log("failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);

      const reply = await addReply(commentId, replyText);
      const commentsData = await getCommentsByLecture(selectLecture);
      setComments(commentsData);

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.log("failed to create reply", error);
    } finally {
      setReplyLoading(false);
    }
  };

  const toggleReplies = (commentId) => {
    setActiveReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50" dir="ltr">
      <div className="top-0 z-10 bg-white border-b border-gray-200">
        <div className="sm:hidden flex items-center space-x-3 py-2">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt="Your profile"
              className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              @{user?.name?.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Reply Status Indicator - Responsive */}
        {replyingTo && (
          <div className="flex items-center justify-between mt-2 sm:mt-0 bg-blue-50 px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-blue-600 font-medium">
                Replying to comment
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-sm text-gray-600 hover:text-gray-800 ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div ref={commentRef} className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {comments?.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💬</div>
              <p className="text-gray-600 font-medium text-sm sm:text-base mb-2">
                No comments yet
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Start the conversation!
              </p>
            </div>
          ) : (
            comments?.map((commentItem) => (
              <CommentItem
                key={commentItem._id}
                comment={commentItem}
                replyingTo={replyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                handleReplySubmit={handleReplySubmit}
                replyLoading={replyLoading}
                setReplyingTo={setReplyingTo}
                activeReplies={activeReplies}
                toggleReplies={toggleReplies}
                user={user}
                handleDeleteComment={handleDeleteComment}
                handleDeleteReply={handleDeleteReply}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                menuRef={menuRef}
                timeAgo={timeAgo}
              />
            ))
          )}
        </div>
      </div>

      {/* ... your existing bottom textarea JSX ... */}

      <div className="sticky bottom-0 left-0 right-0 border-gray-200 bg-white pb-3 sm:p-3">
        <div className="relative">
          {replyingTo && window.innerWidth < 640 && (
            <div className="mb-2 flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Replying to comment</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-row xs:flex-row xs:items-end gap-2">
            <div className="flex-1 relative" dir="ltr">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  replyingTo
                    ? "Add to your reply..."
                    : "What are your thoughts?"
                }
                rows={
                  window.innerWidth < 475 ? 2 : window.innerWidth < 768 ? 2 : 3
                }
                className="w-full resize-none rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 h-fit shrink-0 pt-2 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-200"
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  unicodeBidi: "isolate",
                }}
                dir="ltr"
                lang="en"
                onFocus={(e) => {
                  // Force LTR on focus
                  e.target.style.direction = "ltr";
                  e.target.style.textAlign = "left";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between xs:justify-end gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !comment.trim()}
                className={`shrink-0 h-fit rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-white transition-colors focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:focus:ring-offset-2 ${
                  loading || !comment.trim()
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          {/* Character Count - Desktop */}
          <div className="hidden xs:flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {replyingTo ? "Posting a reply" : "Posting a comment"}
            </span>
            <span
              className={`text-xs ${comment.length > 500 ? "text-red-500" : "text-gray-500"}`}
            >
              {comment.length}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
