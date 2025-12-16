import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../src/index.css";
import { getAiChats, getAllAiChatsHistory } from "../api/chatbotApi";
import { useSelector } from "react-redux";
import ChatInput from "./chatInput";
import MessagesList from "./MessagesList";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoader, setIsChatLoader] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useSelector((store) => store.user);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      if (!inputValue.trim() || isLoading) return;

      const userText = inputValue;

      const userMessage = {
        id: crypto.randomUUID(),
        text: userText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await getAiChats(userText);

        const aiMessage = {
          id: response?._id || crypto.randomUUID(),
          text: response?.aiResponse ?? "no response",
          sender: "ai",
          timestamp: response?.createdAt || new Date().toISOString(),
          rawData: response,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);

        const errorMessage = {
          id: `error_${Date.now()}`,
          text: "Sorry, there was an error processing your request.",
          sender: "error",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading]
  );

  const splitChatsIntoMessages = useCallback((chats = []) => {
    if (!Array.isArray(chats)) return [];

    const messages = [];

    for (const d of chats) {
      const created = new Date(d.createdAt);
      const aiDate = new Date(d.updatedAt || created.getTime() + 1);

      messages.push({
        id: `${d._id}_user`,
        text: d.userInput || "",
        sender: "user",
        timestamp: created.toISOString(),
      });

      messages.push({
        id: `${d._id}_ai`,
        text: d.aiResponse || "",
        sender: "ai",
        timestamp: aiDate.toISOString(),
      });
    }

    return messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    const fetchChatHistory = async () => {
      try {
        setIsChatLoader(true);
        const res = await getAllAiChatsHistory();
        const messages = splitChatsIntoMessages(res || []);

        if (isMounted) {
          setIsChatLoader(false);
          setMessages(messages);
        }
      } catch (error) {
        if (isMounted) {
          setIsChatLoader(false);
          console.error("Failed to fetch chat history:", error.message);
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [splitChatsIntoMessages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="ai-avatar">AI</div>
          <h3>AI Assistant</h3>
        </div>
        <div className="chatbot-status">
          <span
            className={`status-indicator ${isLoading ? "loading" : "online"}`}
          ></span>
          {isLoading ? "Thinking..." : "Online"}
        </div>
      </div>

      <div className="messages-container">
        <MessagesList messages={messages} user={user} chatLoader={chatLoader} />

        {isLoading && (
          <div className="flex items-center jutify-center gap-x-2">
            <img
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80"
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm mt-1.5"
            />
            <div className="message-wrapper ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default React.memo(ChatBot);
