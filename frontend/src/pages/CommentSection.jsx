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
        // console.log("datadatadatadata: ", data);
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
    <div className="flex h-full min-h-0 flex-col bg-gray-50" dir="ltr">
      <div className="shrink-0 bg-white border-b border-gray-200 px-2.5 py-2 sm:px-3 sm:py-2">
        <div className="flex items-center gap-2.5 sm:hidden">
          <div className="relative shrink-0">
            <img
              src={user.profilePicture}
              alt="Your profile"
              className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500">
              @{user?.name?.toLowerCase()}
            </p>
          </div>
        </div>

        {replyingTo && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50 px-2.5 py-1.5 sm:mt-0 sm:px-3 sm:py-2">
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

      <div ref={commentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-3 p-2.5 sm:space-y-4 sm:p-4">
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

      <div className="sticky bottom-0 shrink-0 border-t border-gray-200 bg-white p-2 sm:p-3">
        <div className="relative">
          {replyingTo && (
            <div className="mb-2 flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs text-blue-600 sm:hidden">
              <svg
                className="mr-1 h-3 w-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">Replying to comment</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-auto shrink-0 pl-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-end gap-1.5 sm:gap-2">
            <div className="relative min-w-0 flex-1" dir="ltr">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  replyingTo
                    ? "Add to your reply..."
                    : "What are your thoughts?"
                }
                rows={2}
                className="h-fit min-h-[2.75rem] w-full shrink-0 resize-none rounded-lg border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 sm:min-h-[3rem] sm:rounded-xl sm:px-4 sm:pt-2.5 sm:text-sm sm:focus:ring-2"
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  unicodeBidi: "isolate",
                }}
                dir="ltr"
                lang="en"
                onFocus={(e) => {
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
            <button
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className={`h-fit shrink-0 rounded-lg px-2.5 py-2 text-[11px] font-medium text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 sm:px-4 sm:py-2.5 sm:text-sm sm:focus:ring-2 sm:focus:ring-offset-2 ${
                loading || !comment.trim()
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "..." : "Post"}
            </button>
          </div>

          <div className="mt-1.5 hidden items-center justify-between sm:flex">
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
