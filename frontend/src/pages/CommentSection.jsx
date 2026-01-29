import React, { useEffect, useRef, useState } from "react";
import {
  createComment,
  getAllComments,
  addReply,
  deleteComment,
} from "../api/commentApi.js";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import { BsThreeDotsVertical } from "react-icons/bs";
const CommentSection = ({ isOpen, comments, setComments }) => {
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [activeReplies, setActiveReplies] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const { user } = useSelector((store) => store.user);

  //   console.log("comments: ", comments);

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

      const data = await getAllComments();
      setComments(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);
      const data = await createComment(comment);
      setComments((prev) => [data, ...prev]);

      toast.success("Comment added successfully!");

      const commentdata = await getAllComments();
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
      const replyData = {
        commentId,
        repliedText: replyText,
      };

      const data = await addReply(replyData);

      // Update the comment with the new reply
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data],
              updatedAt: new Date().toISOString(),
            };
          }
          return comment;
        }),
      );

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

  const CommentItem = ({ comment, isReply = false }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = activeReplies[comment._id];
    const isReplying = replyingTo === comment._id;

    return (
      <div className={` ${isReply ? "ml-8 mt-3" : ""}`}>
        {/* Comment Card */}
        <div
          className={`${isReply ? "bg-gray-50" : "bg-white"} rounded-lg p-4 border border-gray-200 `}
        >
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <img
              src={
                comment.user?.profilePicture ||
                "https://via.placeholder.com/32x32"
              }
              alt={comment.user?.name || "User"}
              className={`${isReply ? "h-8 w-8" : "h-10 w-10"} rounded-full border border-gray-300 object-cover shrink-0`}
            />

            <div className="flex-1 min-w-0">
              {/* User Info and Time */}
              <div className="flex items-baseline space-x-2">
                <p className="text-sm font-semibold text-gray-900">
                  {comment.user?.name || "User"}
                </p>
                <span className="text-xs text-gray-500">
                  {timeAgo(comment.createdAt)}
                </span>
                {isReply && (
                  <span className="text-xs text-blue-600 font-medium">
                    ↶ Replied
                  </span>
                )}
              </div>

              {/* Comment Text */}
              <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                {comment.userInput || comment.repliedText}
              </p>

              {/* Actions */}
              <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-100">
                {!isReply && (
                  <button
                    onClick={() => {
                      setReplyingTo(isReplying ? null : comment._id);
                      setReplyText("");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    <span>Reply</span>
                  </button>
                )}

                {/* Show/Hide Replies Button */}
                {hasReplies && !isReply && (
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="text-xs text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-1"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform ${showReplies ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span>
                      {comment.replies.length}{" "}
                      {comment.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  </button>
                )}
              </div>

              {/* Reply Input */}
              {isReplying && (
                <div className="mt-4 border-l-2 border-blue-200 pl-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
                        rows={2}
                        className="input-ltr w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
             focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
             text-left"
                        style={{
                          direction: "ltr",
                          unicodeBidi: "plaintext",
                        }}
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplySubmit(comment._id)}
                        disabled={replyLoading || !replyText.trim()}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                          replyLoading || !replyText.trim()
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {replyLoading ? "Posting..." : "Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="relative inline-block">
                <BsThreeDotsVertical
                  className="cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === comment._id ? null : comment._id,
                    )
                  }
                />

                {openMenuId === comment._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    {comment.user?._id === user._id ? (
                      <div>
                        <button
                          className="block w-full px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => {
                            handleDeleteComment(comment);
                            setOpenMenuId(null);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          className="block w-full px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => {
                            setOpenMenuId(null);
                          }}
                        >
                          Report
                        </button>
                      </div>
                    ) : (
                      <button
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => {
                          setOpenMenuId(null);
                        }}
                      >
                        Report
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Render Replies */}
        {hasReplies && showReplies && !isReply && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Comments Count Header - Merged with user info on mobile */}
      <div className="top-0 z-10 bg-white border-b border-gray-200">
        {/* User info for mobile (above input) */}
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

      <div ref={commentRef} className="flex-1 overflow-y-auto ">
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
              <CommentItem key={commentItem._id} comment={commentItem} />
            ))
          )}
        </div>
      </div>

      {/* Bottom Comment Input - Fully Responsive */}
      <div className="sticky bottom-0 left-0 right-0 border-gray-200 bg-white pb-3 sm:p-3">
        <div className="relative">
          {/* Reply Indicator for mobile */}
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
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                replyingTo ? "Add to your reply..." : "What are your thoughts?"
              }
              rows={
                window.innerWidth < 475 ? 2 : window.innerWidth < 768 ? 2 : 3
              }
              className="flex-1 resize-none rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 h-fit shrink-0 pt-2 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-200"
            />
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
