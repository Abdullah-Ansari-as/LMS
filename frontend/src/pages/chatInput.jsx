import { memo } from "react";

const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}) {
  return (
    <form className="input-container" onSubmit={onSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit(e);
          }}
          placeholder="Type your message here..."
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="send-button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>

      <div className="input-hint">
        Chatbot can make mistakes. Check important info.
      </div>
    </form>
  );
});

export default ChatInput;
