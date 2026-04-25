import React, { useEffect, useRef, useState, memo } from "react";
// ... other imports
import { BsThreeDotsVertical } from "react-icons/bs";

// MOVE CommentItem COMPONENT OUTSIDE CommentSection
const CommentItem = memo(
  ({
    comment,
    isReply = false,
    replyingTo,
    replyText,
    parentCommentId,
    setReplyText,
    handleReplySubmit,
    replyLoading,
    setReplyingTo,
    activeReplies,
    toggleReplies,
    user,
    handleDeleteComment,
    handleDeleteReply,
    openMenuId,
    setOpenMenuId,
    menuRef,
    timeAgo,
  }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = activeReplies[comment._id];
    const isReplying = replyingTo === comment._id;
    const replyTextareaRef = useRef(null);

    // Focus the textarea when it becomes visible
    useEffect(() => {
      if (isReplying && replyTextareaRef.current) {
        replyTextareaRef.current.focus();
        // Move cursor to end
        const length = replyTextareaRef.current.value.length;
        replyTextareaRef.current.setSelectionRange(length, length);
      }
    }, [isReplying]);

    // console.log("replyText: ",replyText);
    // console.log("replyingTo: ", replyingTo);
    // console.log("activeReplies: ", activeReplies);
    // console.log("isReplying: ", isReplying);
    // console.log("isReply: ", isReply);
    // console.log("comment: ", comment);
    // console.log("parentCommentId: ", parentCommentId);


    return (
      <div className={`${isReply ? "ml-8 mt-3" : ""}`}>
        {/* Comment Card */}
        <div
          className={`${isReply ? "bg-gray-50" : "bg-white"} rounded-lg p-4 border border-gray-200`}
        >
          <div className="flex items-start space-x-3">
            {/* ... rest of your CommentItem JSX remains exactly the same ... */}
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
                        ref={replyTextareaRef}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
                        rows={2}
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        dir="ltr"
                        style={{
                          direction: "ltr",
                          textAlign: "left",
                          unicodeBidi: "plaintext",
                        }}
                        onKeyDown={(e) => {
                          // Prevent Enter from submitting if shift is not held (optional)
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            // Optional: submit on enter
                            // handleReplySubmit(comment._id);
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
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
                            if (isReply) {
                              handleDeleteReply(parentCommentId, comment._id);

                            } else {
                              handleDeleteComment(comment);
                            }

                            setOpenMenuId(null);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="block w-full px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50 transition-colors duration-150"
                          onClick={() => setOpenMenuId(null)}
                        >
                          Report
                        </button>
                      </div>
                    ) : (
                      <button
                        className="block w-full px-3 py-1.5 text-sm text-gray-700 text-left hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setOpenMenuId(null)}
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
              <CommentItem
                key={reply._id}
                comment={reply}
                parentCommentId={comment._id}
                isReply={true}
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
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default CommentItem;
